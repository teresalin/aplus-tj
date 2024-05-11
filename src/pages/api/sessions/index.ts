import { getDBClient, releaseDBClient } from "../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { parseSession } from "../../../../utils/apiUtils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { range } = req.query;
  const client = await getDBClient();

  try {
    const query = {
      text: `
        SELECT
          session.id,
          c.id AS class_id,
          c.name AS class_name,
          session.date AS date,
          session.start_time,
          session.end_time
        FROM
          session
          INNER JOIN class c ON session.class_id = c.id
        WHERE
          c.active = TRUE
          AND (
            ($1 = 'last7Days' 
              AND session.date >= ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Taipei')::date - INTERVAL '7 days') 
              AND session.date < (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Taipei')::date) 
            OR ($1 = 'thisMonth' 
              AND session.date >= DATE_TRUNC('month', CURRENT_TIMESTAMP, 'Asia/Taipei') 
              AND session.date < (DATE_TRUNC('month', CURRENT_TIMESTAMP, 'Asia/Taipei') + INTERVAL '1 month')) 
            OR ($1 = 'yearToDate' 
              AND session.date >= DATE_TRUNC('year', CURRENT_TIMESTAMP, 'Asia/Taipei')
            )
          )
        ORDER BY 
          session.date DESC;
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
