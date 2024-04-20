import { getDBClient, releaseDBClient } from "../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { parseSession } from "../../../utils/apiUtils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { range } = req.query;
  const client = await getDBClient();

  try {
    const query = {
      text: `
        SELECT
          s.id,
          c.id AS class_id,
          c.name AS class_name,
          s.session_date AS date,
          s.start_time,
          s.end_time
        FROM
          session s
          INNER JOIN class c ON s.class_id = c.id
        WHERE
          c.active = TRUE
          AND (
            ($1 = 'last7Days' 
              AND s.session_date >= ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Taipei')::date - INTERVAL '7 days') 
              AND s.session_date < (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Taipei')::date) 
            OR ($1 = 'thisMonth' 
              AND s.session_date >= DATE_TRUNC('month', CURRENT_TIMESTAMP, 'Asia/Taipei') 
              AND s.session_date < (DATE_TRUNC('month', CURRENT_TIMESTAMP, 'Asia/Taipei') + INTERVAL '1 month')) 
            OR ($1 = 'yearToDate' 
              AND s.session_date >= DATE_TRUNC('year', CURRENT_TIMESTAMP, 'Asia/Taipei')
            )
          )
        ORDER BY 
          s.session_date DESC;
      `,
      values: [range],
    };
    const result = await client.query(query);
    res.status(200).json({
      status: "Success",
      result: result.rows.map(parseSession),
      message: "Sessions retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving sessions", error);
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
