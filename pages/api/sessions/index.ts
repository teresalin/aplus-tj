import { getDBClient, releaseDBClient } from "../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "../../../src/components/session/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();

  try {
    const { range } = req.query;
    const query = {
      text: `
        SELECT
          s.id AS "id",
          c.id AS "classId",
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
            ($1 = 'last7Days' AND s.session_date >= ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Taipei')::date - INTERVAL '7 days') AND s.session_date < (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Taipei')::date) OR
            ($1 = 'thisMonth' AND s.session_date >= DATE_TRUNC('month', CURRENT_TIMESTAMP, 'Asia/Taipei') AND s.session_date < (DATE_TRUNC('month', CURRENT_TIMESTAMP, 'Asia/Taipei') + INTERVAL '1 month')) OR
            ($1 = 'yearToDate' AND s.session_date >= DATE_TRUNC('year', CURRENT_TIMESTAMP, 'Asia/Taipei'))
          )
        ORDER BY 
          s.session_date DESC;
      `,
      values: [range],
    };
    const result = await client.query(query);
    res.status(200).json({
      status: "Success",
      result: result.rows as Session[],
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
