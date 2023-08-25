import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";

export interface Schedule {
  id: number;
  dayOfWeek: string;
  startTime: Date;
  endTime: Date;
}

function parseSchedule(row: any): Schedule {
  return {
    id: row.class_id,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
        SELECT
            schedules.id, schedules.day_of_week, schedules.start_time, schedules.end_time,
        FROM
            schedules
        INNER JOIN
            classes ON classes.id = schedules.class_id
        WHERE classes.id = $1;
        `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows.map(parseSchedule));
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
