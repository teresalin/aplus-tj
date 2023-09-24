import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../lib/db-connector";

export interface Session {
  id: number;
  className: string;
  sessionDate: Date;
  startTime: Date;
  endTime: Date;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const { range } = req.query;
    const query = {
      text: `
        SELECT
          s.id AS "id",
          c.name AS "className",
          s.session_date AS "sessionDate",
          s.start_time AS "startTime",
          s.end_time AS "endTime"
        FROM
          session s
          INNER JOIN class c ON s.class_id = c.id
        WHERE
          c.active = TRUE
          AND (
            ($1 = 'last7Days' AND s.session_date >= (CURRENT_DATE - INTERVAL '7 days') AND s.session_date < (CURRENT_DATE + INTERVAL '7 days')) OR
            ($1 = 'thisMonth' AND s.session_date >= DATE_TRUNC('month', CURRENT_DATE) AND s.session_date < (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')) OR
            ($1 = 'yearToDate' AND s.session_date >= DATE_TRUNC('year', CURRENT_DATE))
          )
        ORDER BY 
          s.session_date DESC;
      `,
      values: [range],
    };
    const result = await client.query(query);
    res.status(200).json(result.rows as Session[]);
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
