import { Class } from "./types";
import { CreateClassDTO, UpdateClassDTO } from "./dtos";
import { getDBClient } from "../../../lib/db-connector";
import { mapRowToClass } from "./class.mapper";

const BASE_CLASS_SELECT = `
  SELECT
    c.id                AS class_id,
    c.name              AS class_name,
    c.capacity,
    s.id                AS staff_id,
    p.name              AS staff_name,
    g.id                AS grade_id,
    g.name              AS grade_name,
    (
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id',        sch.id,
          'dayOfWeek', sch.day_of_week,
          'startTime', sch.start_time,
          'endTime',   sch.end_time
        ) ORDER BY sch.day_of_week
      )
      FROM schedule sch
      WHERE sch.class_id = c.id
    ) AS schedules,
    (
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'studentId',     p2.id,
          'name',          p2.name,
          'englishName',   st.english_name,
          'dateOfBirth',   p2.date_of_birth,
          'currentSchool', st.current_school,
          'notes',         p2.notes
        )
      )
      FROM class_student cs
      JOIN student st ON cs.student_id = st.id
      JOIN person p2   ON st.person_id  = p2.id
      WHERE cs.class_id = c.id
        AND cs.active = TRUE
    ) AS students,
    (
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id',          a.id,
          'name',        a.name,
          'description', a.description,
          'dueDate',     a.due_date,
          'created',     a.created
        ) ORDER BY a.due_date
      )
      FROM class_assignment ca
      JOIN assignment a ON ca.assignment_id = a.id
      WHERE ca.class_id = c.id
        AND a.due_date >= CURRENT_DATE
      LIMIT 5
    ) AS assignments
  FROM class c
  JOIN staff s   ON c.teacher_id = s.id
  JOIN person p  ON s.person_id  = p.id
  JOIN grade g   ON c.grade_id   = g.id
  WHERE c.active = TRUE
`;

export async function findAllClasses(): Promise<Class[]> {
  const client = await getDBClient();
  try {
    const { rows } = await client.query(
      BASE_CLASS_SELECT +
        `
      ORDER BY c.id;
    `,
    );
    return rows.map(mapRowToClass);
  } finally {
    client.release();
  }
}

export async function findClassById(classId: string): Promise<Class | null> {
  const client = await getDBClient();
  try {
    const { rows } = await client.query(
      BASE_CLASS_SELECT +
        `
      AND c.id = $1;
    `,
      [classId],
    );
    return rows.length ? mapRowToClass(rows[0]) : null;
  } finally {
    client.release();
  }
}

export async function createClass(dto: CreateClassDTO): Promise<Class> {
  const client = await getDBClient();
  try {
    await client.query("BEGIN");

    // 2) insert into class
    const {
      rows: [{ id: classId }],
    } = await client.query<{ id: number }>(
      `
      INSERT INTO class
        (name, teacher_id, grade_id, capacity, active)
      VALUES ($1, $2, $3, $4,true)
      RETURNING id;
      `,
      [dto.name, dto.teacherId, dto.gradeId, dto.capacity],
    );

    // insert into schedule (or none, if dto.schedules is undefined)
    for (const sch of dto.schedules ?? []) {
      await client.query(
        `
        INSERT INTO schedule
          (class_id, day_of_week, start_time, end_time)
        VALUES ($1, $2, $3, $4);
        `,
        [classId, sch.dayOfWeek, sch.startTime, sch.endTime],
      );
    }

    await client.query("COMMIT");

    // 3) fetch and return the freshly-created Class
    const { rows } = await client.query(
      BASE_CLASS_SELECT +
        `
      AND c.id = $1;
      `,
      [classId],
    );
    return mapRowToClass(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating class:", error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Update class metadata and schedules (wipe + re-insert).
 */
export async function updateClass(dto: UpdateClassDTO) {
  const client = await getDBClient();
  try {
    await client.query("BEGIN");

    // 1) update class
    await client.query(
      `
      UPDATE class
         SET name       = $2,
             teacher_id = $3,
             grade_id   = $4,
             capacity   = $5
       WHERE id = $1
      RETURNING id;
      `,
      [dto.id, dto.name, dto.teacherId, dto.gradeId, dto.capacity],
    );

    // 2) reset schedules
    await client.query(`DELETE FROM schedule WHERE class_id = $1;`, [dto.id]);
    for (const sch of dto.schedules ?? []) {
      await client.query(
        `
        INSERT INTO schedule
          (class_id, day_of_week, start_time, end_time)
        VALUES ($1, $2, $3, $4);
        `,
        [dto.id, sch.dayOfWeek, sch.startTime, sch.endTime],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating class:", error);
    throw error;
  } finally {
    client.release();
  }
}
