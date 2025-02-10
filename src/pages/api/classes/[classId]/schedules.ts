import { getDBClient, releaseDBClient } from "../../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();

  try {
    const query = {
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
    const result = await client.query(query);
    res.status(200).json({
      status: "Success",
      result: result.rows[0],
      message: "Schedules retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving schedules", error);
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
