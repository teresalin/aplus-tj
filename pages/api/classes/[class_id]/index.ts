import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";
import { Class } from "..";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const classID = req.query.class_id;
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
        WITH ActiveStudentCounts AS
          (SELECT class_id,
                  COUNT(*) AS active_student_count
          FROM class_students
          WHERE active = TRUE
          GROUP BY class_id)
        SELECT c.id,
          c.name,
          c.capacity,
          p.name AS "teacherName",
          COALESCE(active_counts.active_student_count, 0) AS "studentCount",
          json_build_object(
            'Monday', json_build_object('startTime', COALESCE(schedules1.start_time, '00:00:00'), 'endTime', COALESCE(schedules1.end_time, '00:00:00')), 
            'Tuesday', json_build_object('startTime', COALESCE(schedules2.start_time, '00:00:00'), 'endTime', COALESCE(schedules2.end_time, '00:00:00')),
            'Sunday', json_build_object('startTime', COALESCE(schedules7.start_time, '00:00:00'), 'endTime', COALESCE(schedules7.end_time, '00:00:00'))) 
            AS "schedules"
        FROM classes AS c
        JOIN staffs AS s ON c.teacher_id = s.id
        JOIN persons AS p ON s.person_id = p.id
        LEFT JOIN schedules AS schedules1 ON c.id = schedules1.class_id
          AND schedules1.day_of_week = 'Monday'
        LEFT JOIN schedules AS schedules2 ON c.id = schedules2.class_id
          AND schedules2.day_of_week = 'Tuesday'
        LEFT JOIN schedules AS schedules7 ON c.id = schedules7.class_id
          AND schedules7.day_of_week = 'Sunday'
        LEFT JOIN ActiveStudentCounts AS active_counts ON c.id = active_counts.class_id
        WHERE c.id = $1
        GROUP BY c.id,
          c.name,
          c.capacity,
          p.name,
          active_counts.active_student_count,
          schedules1.start_time,
          schedules1.end_time,
          schedules2.start_time,
          schedules2.end_time,
          schedules7.start_time,
          schedules7.end_time
        ORDER BY c.id;
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
