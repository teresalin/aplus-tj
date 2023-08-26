import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";

export interface Schedule {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
        SELECT
            schedules.id, 
            schedules.day_of_week AS "dayOfWeek", 
            schedules.start_time AS "startTime", 
            schedules.end_time AS "endTime,
        FROM
            schedules
        INNER JOIN
            classes ON classes.id = schedules.class_id
        WHERE classes.id = $1;
        `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows as Schedule[]);
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
