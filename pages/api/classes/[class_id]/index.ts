import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";
import { Class } from "..";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const classID = req.query.class_id;
  const client = await getDBClient();
  try {
    const query = {
      text: `
        WITH ActiveStudentCounts AS
          (SELECT class_id, COUNT(*) AS active_student_count
          FROM class_student
          WHERE active = TRUE
          GROUP BY class_id)
        SELECT c.id,
          c.name AS "className",
          g.name AS "grade",
          c.capacity,
          p.name AS "teacherName",
          COALESCE(active_counts.active_student_count, 0) AS "studentCount",
          json_build_object(
            'Monday', json_build_object('startTime', COALESCE(schedules1.start_time, '00:00:00'), 'endTime', COALESCE(schedules1.end_time, '00:00:00')), 
            'Tuesday', json_build_object('startTime', COALESCE(schedules2.start_time, '00:00:00'), 'endTime', COALESCE(schedules2.end_time, '00:00:00')),
            'Sunday', json_build_object('startTime', COALESCE(schedules7.start_time, '00:00:00'), 'endTime', COALESCE(schedules7.end_time, '00:00:00'))) 
            AS "schedules",
          (
            SELECT json_agg(
              json_build_object(
                'id', p.id,
                'name', p.name,
                'gender', p.gender,
                'phone', p.phone,
                'email', p.email,
                'dateOfBirth', p.date_of_birth,
                'notes', p.notes,
                'joinDate', s.join_date,
                'leaveDate', s.leave_date,
                'active', p.active
              )
            )
            FROM class_student AS cs
            JOIN student AS s ON cs.student_id = s.id
            JOIN person AS p ON s.person_id = p.id
            WHERE cs.class_id = c.id
              AND cs.active = TRUE
          ) AS "activeStudents",
          (
            SELECT json_agg(
              json_build_object(
                'id', a.id,
                'classId', ca.class_id,
                'name', a.name,
                'description', a.description,
                'dueDate', a.due_date,
                'timeCreated', a.time_created
              )
            )
            FROM class_assignment AS ca
            JOIN assignment AS a ON ca.assignment_id = a.id
            WHERE ca.class_id = c.id
              AND a.due_date <= current_date 
              AND a.due_date >= current_date - interval '1 month'
          ) AS "pastAssignments",
          (
            SELECT json_agg(
              json_build_object(
                'id', a.id,
                'classId', ca.class_id,
                'name', a.name,
                'description', a.description,
                'dueDate', a.due_date,
                'timeCreated', a.time_created
              )
            )
            FROM class_assignment AS ca
            JOIN assignment AS a ON ca.assignment_id = a.id
            WHERE ca.class_id = c.id
              AND a.due_date > current_date
          ) AS "upcomingAssignments"
        FROM class AS c
        JOIN staff AS s ON c.teacher_id = s.id
        JOIN person AS p ON s.person_id = p.id
        JOIN grade AS g ON c.grade_id = g.id
        LEFT JOIN schedule AS schedules1 ON c.id = schedules1.class_id
          AND schedules1.day_of_week = 'Monday'
        LEFT JOIN schedule AS schedules2 ON c.id = schedules2.class_id
          AND schedules2.day_of_week = 'Tuesday'
        LEFT JOIN schedule AS schedules7 ON c.id = schedules7.class_id
          AND schedules7.day_of_week = 'Sunday'
        LEFT JOIN ActiveStudentCounts AS active_counts ON c.id = active_counts.class_id
        WHERE c.id = $1
        GROUP BY c.id,
          c.name,
          g.name,
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
    const result = await client.query(query);
    res.status(200).json(result.rows[0] as Class);
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
