import { getDBClient, releaseDBClient } from "../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { parseBilling } from "../../../../utils/apiUtils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();

  try {
    const query = {
      text: `
        SELECT
          student.id AS student_id,  
          person.name AS student_name,
          sbr.id,
          sbr.billing_date,
          sbr.description,
          sbr.amount,
          sbr.payment_method,
          sbr.invoice_number,
          sbr.created,
          CASE
            WHEN COALESCE(SUM(sbd.amount), 0) >= sbr.amount THEN true
            ELSE false
          END AS paid
        FROM
          student_billing_record sbr
          INNER JOIN student ON sbr.student_id = student.id
          INNER JOIN person ON student.person_id = person.id
          LEFT JOIN student_billing_details sbd ON sbr.id = sbd.billing_record_id
        GROUP BY
          sbr.id, student.id, person.name
        ORDER BY
          sbr.created;
      `,
    };
    const result = await client.query(query);
    res.status(200).json({
      status: "Success",
      result: result.rows.map(parseBilling),
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
