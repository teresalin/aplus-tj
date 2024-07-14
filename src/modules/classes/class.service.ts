import { Class } from "./types";
import { CreateClassDTO, UpdateClassDTO } from "./dtos";
import { getDBClient } from "../../../lib/db-connector";
import { mapRowToClass } from "./class.mapper";
import { UniqueConstraintError } from "../../../utils/CustomError";

export async function findAllClasses(): Promise<Class[]> {
  const client = await getDBClient();

  try {
    const { rows } = await client.query(
      `
        SELECT
          class.id AS class_id,
          class.name AS class_name,
          class.capacity,
          class.teacher_id AS staff_id,
          person.name AS staff_name,
          grade.id AS grade_id,
          grade.name AS grade_name,
          (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', schedule.id,
                'dayOfWeek', schedule.day_of_week,
                'startTime', schedule.start_time,
                'endTime', schedule.end_time
              )
            )
            FROM schedule
            WHERE schedule.class_id = class.id
          ) AS "schedules"
        FROM class
        JOIN staff ON class.teacher_id = staff.id
        JOIN person ON staff.person_id = person.id
        JOIN grade ON class.grade_id = grade.id
        WHERE class.active = true
        GROUP BY class.id, class.name, grade.id, grade.name, class.capacity, person.id
        ORDER BY class.id;
      `
    );
    return rows.map(mapRowToClass);
  } catch (error) {
    console.error("Error fetching classes from database:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function findClassById(classId: number): Promise<Class | null> {
  const client = await getDBClient();

  try {
    const { rows } = await client.query(
      `
      SELECT 
        c.id AS class_id,
        c.name AS class_name,
        c.capacity,
        g.id AS grade_id,
        g.name AS grade_name,
        s.id AS staff_id,
        p.name AS staff_name,
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', schedule.id,
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
              'studentId', p.id,
              'name', p.name,
              'englishName', s.english_name,
              'dateOfBirth', p.date_of_birth,
              'currentSchool', s.current_school,
              'notes', p.notes
            )
          )
          FROM class_student AS cs
          JOIN student AS s ON cs.student_id = s.id
          JOIN person AS p ON s.person_id = p.id
          WHERE cs.class_id = c.id AND cs.active = TRUE
        ) AS students,
        (
          SELECT json_agg(
            json_build_object(
              'id', a.id,
              'name', a.name,
              'description', a.description,
              'dueDate', a.due_date,
              'created', a.created
            ) ORDER BY a.due_date -- Order by due_date here
          )
          FROM class_assignment AS ca
          JOIN assignment AS a ON ca.assignment_id = a.id
          WHERE ca.class_id = c.id AND a.due_date >= current_date
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
      [classId]
    );
    return rows.length ? mapRowToClass(rows[0]) : null;
  } catch (error) {
    console.error("Error retrieving class from database:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function createClass(dto: CreateClassDTO) {
  const client = await getDBClient();

  try {
    await client.query("BEGIN");

    const insertClassQuery = {
      text: `
          INSERT INTO class(name, teacher_id, grade_id, capacity, active, created, updated)
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
          RETURNING id;
        `,
      values: [dto.name, dto.teacherId, dto.gradeId, dto.capacity, true],
    };
    const result = await client.query(insertClassQuery);
    const classId = result.rows[0].id;

    await Promise.all(
      dto.schedules.map(async (schedule) => {
        const insertScheduleQuery = `
            INSERT INTO schedule(class_id, day_of_week, start_time, end_time, created, updated)
            VALUES ($1, $2, $3, $4, NOW(), NOW())
            RETURNING id;
          `;
        const values = [
          classId,
          schedule.dayOfWeek,
          schedule.startTime,
          schedule.endTime,
        ];
        return client.query(insertScheduleQuery, values);
      })
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      // Unique violation error code in PostgreSQL
      throw new UniqueConstraintError(
        "A class with the same name and grade already exists."
      );
    } else {
      console.error("Error creating class in the database:", error);
      throw error;
    }
  } finally {
    client.release();
  }
}

export async function updateClass(dto: UpdateClassDTO) {
  const client = await getDBClient();

  try {
    await client.query("BEGIN");

    const updateClassQuery = {
      text: `
        UPDATE class 
        SET name = $2, teacher_id = $3, grade_id = $4, capacity = $5, updated = NOW()
        WHERE id = $1
        RETURNING id;
      `,
      values: [dto.id, dto.name, dto.teacherId, dto.gradeId, dto.capacity],
    };
    await client.query(updateClassQuery);

    // Retrieve current schedules
    const currentSchedules = (
      await client.query("SELECT * FROM schedule WHERE class_id = $1", [dto.id])
    ).rows;

    // Identify schedules to add, update, and delete
    const schedulesToUpdate = dto.schedules?.filter((schedule) =>
      currentSchedules.some((cs) => cs.id === schedule.id)
    );
    const schedulesToAdd = dto.schedules?.filter((schedule) => !schedule.id);
    const schedulesToDelete = currentSchedules.filter(
      (cs) => !dto.schedules?.some((schedule) => schedule.id === cs.id)
    );

    // Add new schedules
    if (schedulesToAdd) {
      for (const schedule of schedulesToAdd) {
        const insertScheduleQuery = `
            INSERT INTO schedule (class_id, day_of_week, start_time, end_time, updated)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id;
          `;
        await client.query(insertScheduleQuery, [
          dto.id,
          schedule.dayOfWeek,
          schedule.startTime,
          schedule.endTime,
        ]);
      }
    }

    // Update existing schedules
    if (schedulesToUpdate) {
      for (const schedule of schedulesToUpdate) {
        const updateScheduleQuery = `
            UPDATE schedule
            SET day_of_week = $2, start_time = $3, end_time = $4, updated = NOW()
            WHERE id = $1
            RETURNING id;
          `;
        await client.query(updateScheduleQuery, [
          schedule.id,
          schedule.dayOfWeek,
          schedule.startTime,
          schedule.endTime,
        ]);
      }
    }

    // Delete obsolete schedules
    for (const schedule of schedulesToDelete) {
      await client.query("DELETE FROM schedule WHERE id = $1", [schedule.id]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      // Unique violation error code in PostgreSQL
      throw new UniqueConstraintError(
        "A class with the same name and grade already exists."
      );
    } else {
      console.error("Error updating class in the database:", error);
      throw error;
    }
  } finally {
    client.release();
  }
}
