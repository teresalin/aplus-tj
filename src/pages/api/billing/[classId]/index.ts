import { getDBClient, releaseDBClient } from "../../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();

  try {
    const query = {
      text: `
        -- Find all sessions for the given class that are not on holidays
        WITH valid_sessions AS (
            SELECT s.id AS session_id, s.class_id, s.date
            FROM session s
            LEFT JOIN session_date_history sd ON s.id = sd.session_id
            WHERE s.class_id = {class_id} 
            AND NOT EXISTS (
                SELECT 1 
                FROM holiday h
                WHERE h.holiday_date = COALESCE(sd.new_date, s.date)
            )
        ),

        -- Find all students in the class and their sessions attended
        student_sessions AS (
        SELECT cs.student_id, s.session_id, s.date
        FROM valid_sessions s
        JOIN class_student cs ON s.class_id = cs.class_id
        LEFT JOIN attendance a ON s.session_id = a.session_id AND cs.student_id = a.student_id
        WHERE a.student_id IS NOT NULL -- This only includes students who attended the session
        ),

        -- Find all missed sessions for the given class
        missed_sessions AS (
        SELECT cs.student_id, s.session_id, s.date
        FROM valid_sessions s
        JOIN class_student cs ON s.class_id = cs.class_id
        LEFT JOIN attendance a ON s.session_id = a.session_id AND cs.student_id = a.student_id
        WHERE a.student_id IS NULL -- This only includes students who missed the session
        ),

        -- Get the billing records and details
        billing_information AS (
        SELECT br.id AS billing_record_id, br.billing_date, br.description, br.amount,
                bd.category_id, bd.amount AS detailed_amount, 
                cs.student_id, 
                p.name AS student_name,
                p.date_of_birth,
                br.payment_method,
                br.created,
                br.updated
        FROM student_billing_record br
        JOIN student_billing_details bd ON br.id = bd.billing_record_id
        JOIN class_student cs ON cs.student_id = br.student_id
        JOIN person p ON cs.student_id = p.id
        WHERE cs.class_id = {class_id} 
        ),

        -- Sum up the missed sessions' cost to be refunded in the next billing month
        missed_sessions_cost AS (
        SELECT ms.student_id, 
                COUNT(ms.session_id) AS missed_sessions,
                bd.amount AS missed_sessions_cost -- Assuming each session has a certain cost
        FROM missed_sessions ms
        JOIN class_cost cc ON ms.class_id = cc.class_id -- Assume class_cost stores the cost of each session
        GROUP BY ms.student_id
        )

        -- Final output to fetch student billing information
        SELECT bi.student_name,
            bi.billing_date AS billing_month,
            bi.amount AS total_amount_due,
            bi.description,
            bi.payment_method,
            bi.created,
            bi.updated,
            ms.missed_sessions_cost AS refund_in_next_month
        FROM billing_information bi
        LEFT JOIN missed_sessions_cost ms ON bi.student_id = ms.student_id
        ORDER BY bi.billing_date DESC; -- Sorting by billing month
      `,
    };
    const result = await client.query(query);
    res.status(200).json({
      status: "Success",
      result: result.rows,
      message: "Billing records retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving billing records", error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  } finally {
    if (client) {
      await releaseDBClient(client);
    }
  }
};
