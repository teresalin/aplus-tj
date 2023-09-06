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
    const { tab } = req.query;
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
            ($1 = 'all') OR
            ($1 = 'upcoming' AND s.session_date >= NOW()) OR
            ($1 = 'past' AND s.session_date < NOW())
          )
        ORDER BY 
          s.session_date DESC;
      `,
      values: [tab],
    };
    const result = await client.query(query);
    res.status(200).json(result.rows as Session[]);
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
