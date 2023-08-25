import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";
import { Class } from "..";

// export interface Class {
//     id: number;
//     name: string;
//     teacherName: string;
//     studentCount: number;
//     capacity: string;
//     schedule: Schedule[];
//   }

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const classID = req.query.class_id;
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
        WITH ActiveStudentCounts AS (
          SELECT
              class_id,
              COUNT(*) AS active_student_count
          FROM
              class_students
          WHERE
              active = true
          GROUP BY
              class_id
      )
      
      SELECT
          c.id,
          c.name,
          c.capacity,
          COALESCE(active_counts.active_student_count, 0) AS "studentCount",
          json_agg(
            json_build_object(
                'dayOfWeek', schedules.day_of_week,
                'startTime', schedules.start_time,
                'endTime', schedules.end_time
            )
        ) AS "schedules"
      FROM
          classes AS c
      LEFT JOIN
          schedules ON c.id = schedules.class_id
      LEFT JOIN
          ActiveStudentCounts AS active_counts ON c.id = active_counts.class_id
      WHERE
          c.id = $1
      GROUP BY
          c.id, c.name, c.capacity, active_counts.active_student_count
      ORDER BY
          c.id;
    
      `,
      values: [classID],
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows[0] as Class);
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
