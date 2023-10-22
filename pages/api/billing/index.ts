import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";

export interface Billing {
  id: number;
  studentId: number;
  studentName: string;
  billingDate: Date;
  description: string;
  amount: number;
  paymentMethod: string;
  invoiceNumber: string;
  paid: boolean;
  created: Date;
}

function parseBilling(row: any): Billing {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    billingDate: row.billing_date,
    description: row.description,
    amount: row.amount,
    paymentMethod: row.payment_method,
    invoiceNumber: row.invoice_number,
    paid: row.paid,
    created: row.time_created,
  };
}

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
            sbr.time_created,
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
            sbr.time_created;
        `,
    };
    const result = await client.query(query);
    res.status(200).json(result.rows.map(parseBilling));
  } catch (error) {
    console.error("Error retrieving billing records", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
