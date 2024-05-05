import { getDBClient, releaseDBClient } from "../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const classID = req.query.class_id;
  const startDate = req.query.start_date;
  const client = await getDBClient();

  try {
    const query = {
      text: `
        SELECT
            cl.name AS class_name,
            st.id AS student_id,
            pe.name AS student_name,
            ss.date AS scheduled_date,
            ss.start_time,
            ss.end_time,
            COALESCE(sdh.new_date, ss.date) AS actual_date,
            sdh.old_date AS original_date,
            sdh.modification_reason,
            (at.session_id IS NOT NULL) AS attended
        FROM
            class cl
        JOIN
            class_student cst ON cl.id = cst.class_id
        JOIN
            student st ON cst.student_id = st.id
        JOIN
            person pe ON st.person_id = pe.id
        JOIN
            session ss ON cl.id = ss.class_id
        LEFT JOIN
            (
                SELECT
                session_id,
                old_date,
                new_date,
                modification_reason,
                ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY modified_at DESC) AS rn
                FROM
                session_date_history
            ) sdh ON ss.id = sdh.session_id AND sdh.rn = 1
        LEFT JOIN
            attendance at ON ss.id = at.session_id AND st.id = at.student_id
        WHERE
            cl.id = $1
            AND cst.active = TRUE
            AND ss.date >= $2::date
            AND ss.date < $2::date + interval '7 days'
        ORDER BY
            ss.date, ss.start_time;
        `,
      values: [classID, startDate],
    };

    const result = await client.query(query);
    res.status(200).json({
      status: "Success",
      result: result.rows,
      message: "Attendance retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving attendance information", error);
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
