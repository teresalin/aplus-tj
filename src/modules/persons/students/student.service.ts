// src/modules/persons/students/student.service.ts
import prisma from "@/lib/prisma";
import { CreateStudentDTO, UpdateStudentDTO } from "./dtos";
import { mapRowToStudent } from "./student.mapper";
import { Student } from "./types";

/**
 * Convert Prisma’s nested payload into the “flat” shape your mapper expects.
 */
function toRowLike(s: any) {
  return {
    id: s.person.id,
    student_id: s.studentId,
    name: s.person.name,
    preferred_name: s.person.preferredName,
    gender: s.person.gender,
    phone: s.person.phone,
    email: s.person.email,
    date_of_birth: s.person.dateOfBirth,
    notes: s.person.notes,
    active: s.person.active,
    current_school: s.currentSchool,
    textbook_publisher: s.textbookPublisher,
    admission_date: s.admissionDate,
    departure_date: s.departureDate,
    grade_id: s.grade.id,
    grade_name: s.grade.name,
  };
}

export async function findAllStudents(): Promise<Student[]> {
  const raw = await prisma.student.findMany({
    include: {
      person: true,
      grade: { select: { id: true, name: true } },
    },
  });
  return raw.map((s) => mapRowToStudent(toRowLike(s)));
}

export async function findStudentById(id: string): Promise<Student | null> {
  const s = await prisma.student.findUnique({
    where: { id },
    include: {
      person: true,
      grade: { select: { id: true, name: true } },
    },
  });
  return s ? mapRowToStudent(toRowLike(s)) : null;
}

export async function createStudent(dto: CreateStudentDTO): Promise<Student> {
  // nested write: first Person, then its Student
  const created = await prisma.person.create({
    data: {
      name: dto.name,
      preferredName: dto.preferredName,
      gender: dto.gender,
      phone: dto.phone,
      email: dto.email,
      dateOfBirth: new Date(dto.dateOfBirth),
      notes: dto.notes,
      active: true,
      student: {
        create: {
          studentId: dto.studentId,
          currentSchool: dto.currentSchool,
          textbookPublisher: dto.textbookPublisher,
          admissionDate: new Date(dto.admissionDate),
          departureDate: dto.departureDate
            ? new Date(dto.departureDate)
            : undefined,
          grade: { connect: { id: dto.gradeId } },
        },
      },
    },
    include: {
      student: { include: { grade: { select: { id: true, name: true } } } },
    },
  });

  // pull out the nested student record
  const s = created.student!;
  return mapRowToStudent(
    toRowLike({
      person: created,
      ...s,
      grade: s.grade!,
    }),
  );
}

export async function updateStudent(dto: UpdateStudentDTO): Promise<void> {
  await prisma.$transaction([
    prisma.person.update({
      where: { id: dto.id },
      data: {
        name: dto.name,
        preferredName: dto.preferredName,
        gender: dto.gender,
        phone: dto.phone,
        email: dto.email,
        dateOfBirth: new Date(dto.dateOfBirth),
        notes: dto.notes,
        // active left unchanged
      },
    }),
    prisma.student.update({
      where: { id: dto.id },
      data: {
        currentSchool: dto.currentSchool,
        textbookPublisher: dto.textbookPublisher,
        admissionDate: new Date(dto.admissionDate),
        departureDate: dto.departureDate
          ? new Date(dto.departureDate)
          : undefined,
        grade: { connect: { id: dto.gradeId } },
      },
    }),
  ]);
}

// import { CreateStudentDTO, UpdateStudentDTO } from "./dtos";
// import { getDBClient } from "../../../lib/db-connector";
// import { mapRowToStudent } from "./student.mapper";
// import { Student } from "./types";

// const STUDENT_SELECT_BASE = `
//   SELECT
//     p.id,
//     p.name,
//     p.preferred_name,
//     p.gender,
//     p.phone,
//     p.email,
//     (p.date_of_birth AT TIME ZONE 'UTC')   AS date_of_birth,
//     p.notes,
//     p.active,
//     s.student_id,
//     s.current_school,
//     s.textbook_publisher,
//     (s.admission_date AT TIME ZONE 'UTC')  AS admission_date,
//     (s.departure_date AT TIME ZONE 'UTC')  AS departure_date,
//     g.id                                   AS grade_id,
//     g.name                                 AS grade_name
//   FROM student s
//   INNER JOIN person  p ON s.id       = p.id
//   INNER JOIN grade   g ON s.grade_id = g.id
// `;

// export async function findAllStudents(): Promise<Student[]> {
//   const client = await getDBClient();
//   try {
//     const { rows } = await client.query(`${STUDENT_SELECT_BASE};`);
//     return rows.map(mapRowToStudent);
//   } catch (error) {
//     console.error("Error retrieving students:", error);
//     throw error;
//   } finally {
//     client.release();
//   }
// }

// export async function findStudentById(id: string): Promise<Student | null> {
//   const client = await getDBClient();
//   try {
//     const { rows } = await client.query(
//       `${STUDENT_SELECT_BASE}
//        WHERE s.id = $1;`,
//       [id],
//     );
//     return rows.length ? mapRowToStudent(rows[0]) : null;
//   } catch (error) {
//     console.error("Error retrieving student:", error);
//     throw error;
//   } finally {
//     client.release();
//   }
// }

// export async function createStudent(dto: CreateStudentDTO): Promise<Student> {
//   const client = await getDBClient();
//   try {
//     await client.query("BEGIN");

//     // 1) insert into person
//     const {
//       rows: [{ id: personId }],
//     } = await client.query<{ id: string }>(
//       `
//       INSERT INTO person
//         (name, preferred_name, gender, phone, email, date_of_birth, notes, active)
//       VALUES ($1,$2,$3,$4,$5,$6,$7,true)
//       RETURNING id;
//       `,
//       [
//         dto.name,
//         dto.preferredName,
//         dto.gender,
//         dto.phone,
//         dto.email,
//         dto.dateOfBirth,
//         dto.notes,
//       ],
//     );

//     // 2) insert into student
//     await client.query(
//       `
//       INSERT INTO student
//         (id, current_school, textbook_publisher, grade_id, admission_date, departure_date)
//       VALUES ($1,$2,$3,$4,$5,$6);
//       `,
//       [
//         personId,
//         dto.currentSchool,
//         dto.textbookPublisher,
//         dto.gradeId,
//         dto.admissionDate,
//         dto.departureDate,
//       ],
//     );

//     // 3) fetch and return the freshly-created Student
//     const { rows } = await client.query(
//       `${STUDENT_SELECT_BASE} WHERE s.id = $1;`,
//       [personId],
//     );

//     await client.query("COMMIT");
//     return mapRowToStudent(rows[0]);
//   } catch (error) {
//     await client.query("ROLLBACK");
//     console.error("Error creating student:", error);
//     throw error;
//   } finally {
//     client.release();
//   }
// }

// export async function updateStudent(dto: UpdateStudentDTO) {
//   const client = await getDBClient();
//   try {
//     await client.query("BEGIN");

//     const updatePersonQuery = {
//       text: `
//         UPDATE person
//         SET
//           name           = $1,
//           preferred_name = $2,
//           gender         = $3,
//           phone          = $4,
//           email          = $5,
//           date_of_birth  = $6,
//           notes          = $7
//         WHERE id = $8
//         RETURNING id;
//       `,
//       values: [
//         dto.name,
//         dto.preferredName,
//         dto.gender,
//         dto.phone,
//         dto.email,
//         dto.dateOfBirth,
//         dto.notes,
//         dto.id,
//       ],
//     };
//     const result = await client.query(updatePersonQuery);
//     const personId = result.rows[0].id;

//     const updateStudentQuery = {
//       text: `
//         UPDATE student
//         SET
//           current_school      = $1,
//           textbook_publisher  = $2,
//           grade_id            = $3,
//           admission_date      = $4,
//           departure_date      = $5
//         WHERE id = $6;
//       `,
//       values: [
//         dto.currentSchool,
//         dto.textbookPublisher,
//         dto.gradeId,
//         dto.admissionDate,
//         dto.departureDate,
//         personId,
//       ],
//     };
//     await client.query(updateStudentQuery);

//     await client.query("COMMIT");
//   } catch (error) {
//     await client.query("ROLLBACK");
//     console.error("Error updating student:", error);
//     throw error;
//   } finally {
//     client.release();
//   }
// }
