import { CreateStudentDTO, UpdateStudentDTO } from "./dtos";
import { getDBClient } from "../../../../lib/db-connector";
import { mapRowToStudent } from "./student.mapper";
import { Student } from "./types";
import { UniqueConstraintError } from "../../../../utils/CustomError";

export async function findAllStudents(): Promise<Student[]> {
  const client = await getDBClient();

  try {
    const { rows } = await client.query(
      `
      SELECT
        person.id AS person_id,
        person.name,
        person.gender,
        person.phone,
        person.email,
        person.date_of_birth::timestamp at time zone 'UTC' as date_of_birth,
        person.notes,
        person.active,
        student.id AS student_id,
        student.english_name,
        student.current_school,
        student.textbook_publisher,
        student.join_date, 
        student.leave_date, 
        grade.id AS grade_id,
        grade.name AS grade_name
      FROM student
      INNER JOIN person ON student.person_id = person.id
      INNER JOIN grade ON student.grade_id = grade.id;
      `
    );
    return rows.map(mapRowToStudent);
  } catch (error) {
    console.error("Error fetching students from database:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function findStudentById(
  studentId: number
): Promise<Student | null> {
  const client = await getDBClient();

  try {
    const { rows } = await client.query(
      `
      SELECT 
        person.id AS person_id,
        person.name,
        person.gender,
        person.phone,
        person.email,
        person.date_of_birth::timestamp at time zone 'UTC' as date_of_birth,
        person.notes,
        person.active,
        student.id AS student_id,
        student.english_name,
        student.current_school,
        student.textbook_publisher,
        student.join_date, 
        student.leave_date, 
        grade.id AS grade_id,
        grade.name AS grade_name
      FROM student
      INNER JOIN person ON student.person_id = person.id
      INNER JOIN grade ON student.grade_id = grade.id
      WHERE student.id = $1;
      `,
      [studentId]
    );
    return rows.length ? mapRowToStudent(rows[0]) : null;
  } catch (error) {
    console.error("Error retrieving student from database:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function createStudent(dto: CreateStudentDTO) {
  const client = await getDBClient();

  try {
    await client.query("BEGIN");

    const insertPersonQuery = {
      text: `
        INSERT INTO person(name, gender, phone, email, date_of_birth, notes, active, created, updated)
        VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW()) RETURNING id;
      `,
      values: [
        dto.name,
        dto.gender,
        dto.phone,
        dto.email,
        dto.dateOfBirth,
        dto.notes,
      ],
    };
    const result = await client.query(insertPersonQuery);
    const personId = result.rows[0].id;

    const insertStudentQuery = {
      text: `
        INSERT INTO student(person_id, english_name, current_school, textbook_publisher, grade_id, join_date, leave_date, created, updated)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW());
      `,
      values: [
        personId,
        dto.englishName,
        dto.currentSchool,
        dto.textbookPublisher,
        dto.grade.id,
        dto.joinDate,
        dto.leaveDate,
      ],
    };
    await client.query(insertStudentQuery);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      // Unique violation error code in PostgreSQL
      throw new UniqueConstraintError(
        "A student with the same name, phone, and date of birth already exists."
      );
    } else {
      console.error("Error creating student in the database:", error);
      throw error;
    }
  } finally {
    client.release();
  }
}

export async function updateStudent(dto: UpdateStudentDTO) {
  const client = await getDBClient();

  try {
    await client.query("BEGIN");

    const updatePersonQuery = {
      text: `
        UPDATE person
        SET name = $1, gender = $2, phone = $3, email = $4, date_of_birth = $5, notes = $6, updated = NOW()
        WHERE id = $7
        RETURNING id;
      `,
      values: [
        dto.name,
        dto.gender,
        dto.phone,
        dto.email,
        dto.dateOfBirth,
        dto.notes,
        dto.personId,
      ],
    };
    const result = await client.query(updatePersonQuery);
    const personId = result.rows[0].id;

    const updateStudentQuery = {
      text: `
        UPDATE student
        SET english_name = $1, current_school = $2, textbook_publisher = $3, grade_id = $4, join_date = $5, leave_date = $6, updated = NOW()
        WHERE person_id = $7;
      `,
      values: [
        dto.englishName,
        dto.currentSchool,
        dto.textbookPublisher,
        dto.grade?.id,
        dto.joinDate,
        dto.leaveDate,
        personId,
      ],
    };
    await client.query(updateStudentQuery);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      // Unique violation error code in PostgreSQL
      throw new UniqueConstraintError(
        "A student with the same name, phone, and date of birth already exists."
      );
    } else {
      console.error("Error updating student in the database:", error);
      throw error;
    }
  } finally {
    client.release();
  }
}
