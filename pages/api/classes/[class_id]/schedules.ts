import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";

export interface Schedule {
  id?: number;
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
          schedule.id, 
          schedule.day_of_week AS "dayOfWeek", 
          schedule.start_time AS "startTime", 
          schedule.end_time AS "endTime,
        FROM
          schedule
        INNER JOIN
          class ON class.id = schedule.class_id
        WHERE class.id = $1;
        `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows as Schedule[]);
  } catch (error) {
    console.error("Error retrieving schedules", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
