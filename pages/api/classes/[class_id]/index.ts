import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient, releaseDBClient } from "../../../../lib/db-connector";
import { parseClass } from "../../../../utils/apiUtils";
import { Class } from "..";
import { PoolClient } from "pg";

async function createClassAndSchedule(client: PoolClient, data: Class) {
  const { name, teacher, grade, schedules, capacity } = data;

  try {
    await client.query("BEGIN");
    const classInsertQuery = {
      text: `
        INSERT INTO class(name, teacher_id, grade_id, capacity, active, time_created, time_updated)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING id;
      `,
      values: [name, teacher.id, grade.id, capacity, true],
    };

    const classResult = await client.query(classInsertQuery);
    const classId = classResult.rows[0].id;

    // Use Promise.all to wait for all insert operations to complete
    await Promise.all(
      schedules.map(async (schedule) => {
        const insertQuery = `
        INSERT INTO schedule(class_id, day_of_week, start_time, end_time, time_created, time_updated)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id;
      `;
        const values = [
          classId,
          schedule.dayOfWeek,
          schedule.startTime,
          schedule.endTime,
        ];
        return client.query(insertQuery, values);
      })
    );

    await client.query("COMMIT"); // Commit the transaction
    // If you need to return something specific, adjust this return statement
    return classId;
  } catch (err) {
    await client.query("ROLLBACK"); // Roll back the transaction on error
    throw err;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const classID = req.query.class_id;
  const client = await getDBClient();

  switch (req.method) {
    case "GET":
      try {
        const query = {
          text: `
            SELECT 
              c.id,
              c.name AS class_name,
              c.capacity,
              g.id AS grade_id,
              g.name AS grade_name,
              p.name,
              s.id AS staff_id,
              (
                SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'dayOfWeek', schedule.day_of_week,
                    'startTime', schedule.start_time,
                    'endTime', schedule.end_time
                  )
                )
                FROM schedule
                WHERE schedule.class_id = c.id
              ) AS schedules,      
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
                    'active', p.active,
                    'englishName', s.english_name,
                    'currentSchool', s.current_school,
                    'textbookPublisher', s.textbook_publisher,
                    'startDate', cs.start_date -- Add startDate field
                  )
                )
                FROM class_student AS cs
                JOIN student AS s ON cs.student_id = s.id
                JOIN person AS p ON s.person_id = p.id
                WHERE cs.class_id = c.id
                AND cs.active = TRUE
              ) AS active_students,
              (
                SELECT json_agg(
                  json_build_object(
                    'id', a.id,
                    'classId', ca.class_id,
                    'name', a.name,
                    'description', a.description,
                    'dueDate', a.due_date,
                    'created', a.time_created
                  ) ORDER BY a.due_date -- Order by due_date here
                )
                FROM class_assignment AS ca
                JOIN assignment AS a ON ca.assignment_id = a.id
                WHERE ca.class_id = c.id
                AND a.due_date >= current_date
                LIMIT 5
              ) AS assignments
            FROM class AS c
            JOIN staff AS s ON c.teacher_id = s.id
            JOIN person AS p ON s.person_id = p.id
            JOIN grade AS g ON c.grade_id = g.id
            LEFT JOIN schedule AS schedules1 ON c.id = schedules1.class_id
            AND schedules1.day_of_week = 'Monday'
            LEFT JOIN schedule AS schedules2 ON c.id = schedules2.class_id
            AND schedules2.day_of_week = 'Tuesday'
            LEFT JOIN schedule AS schedules3 ON c.id = schedules3.class_id
            AND schedules3.day_of_week = 'Wednesday'
            LEFT JOIN schedule AS schedules4 ON c.id = schedules4.class_id
            AND schedules4.day_of_week = 'Thursday'
            LEFT JOIN schedule AS schedules5 ON c.id = schedules5.class_id
            AND schedules5.day_of_week = 'Friday'
            LEFT JOIN schedule AS schedules6 ON c.id = schedules6.class_id
            AND schedules6.day_of_week = 'Saturday'
            LEFT JOIN schedule AS schedules7 ON c.id = schedules7.class_id
            AND schedules7.day_of_week = 'Sunday'
            WHERE c.id = $1
            GROUP BY 
              c.id,
              c.name,
              c.capacity,
              g.id,
              g.name,
              p.name,
              s.id,
              schedules1.start_time,
              schedules1.end_time,
              schedules2.start_time,
              schedules2.end_time,
              schedules3.start_time,
              schedules3.end_time,
              schedules4.start_time,
              schedules4.end_time,
              schedules5.start_time,
              schedules5.end_time,
              schedules6.start_time,
              schedules6.end_time,
              schedules7.start_time,
              schedules7.end_time
            ORDER BY c.id;
          `,
          values: [classID],
        };
        const result = await client.query(query);
        res.status(200).json(result.rows.map(parseClass)[0]);
      } catch (err) {
        console.error("Error retrieving class", err);
        res.status(500).json({ message: "Internal server error" });
      } finally {
        await releaseDBClient(client);
      }
      break;
    case "POST":
      try {
        const data: Class = req.body;
        console.log(data);
        const createResult = await createClassAndSchedule(client, data);
        res.status(200).json({
          status: "Success",
          result: createResult,
          message: "Class created successfully.",
        });
      } catch (err) {
        console.error("Error creating class", err);
        res.status(500).json({ message: "Internal server error" });
      } finally {
        await releaseDBClient(client);
      }
  }
};
