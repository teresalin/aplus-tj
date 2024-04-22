import { getDBClient, releaseDBClient } from "../../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { parseStudent } from "../../../../../utils/apiUtils";
import { PoolClient } from "pg";
import { Student } from "../../../../../src/components/persons/students/types";

async function createPersonAndStudent(client: PoolClient, data: Student) {
  const {
    name,
    gender,
    phone,
    email,
    dateOfBirth,
    notes,
    englishName,
    currentSchool,
    textbookPublisher,
    grade,
    joinDate,
    leaveDate,
  } = data;

  try {
    await client.query("BEGIN");
    const personInsertQuery = {
      text: `
        INSERT INTO person(name, gender, phone, email, date_of_birth, notes, active, created, updated) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id;
      `,
      values: [name, gender, phone, email, dateOfBirth, notes, "t"],
    };

    const personResult = await client.query(personInsertQuery);

    const studentInsertQuery = {
      text: `
        INSERT INTO student(person_id, english_name, current_school, textbook_publisher, grade_id, join_date, leave_date, created, updated) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id;
      `,
      values: [
        personResult.rows[0].id,
        englishName,
        currentSchool,
        textbookPublisher,
        grade.id,
        joinDate,
        leaveDate,
      ],
    };

    const studentResult = await client.query(studentInsertQuery);
    await client.query("COMMIT");
    return studentResult.rows[0].id;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

async function updatePersonAndStudent(client: PoolClient, data: Student) {
  const {
    personId,
    name,
    gender,
    phone,
    email,
    dateOfBirth,
    notes,
    englishName,
    currentSchool,
    textbookPublisher,
    grade,
    joinDate,
    leaveDate,
  } = data;

  try {
    await client.query("BEGIN");

    const personUpdateQuery = {
      text: `
        UPDATE person
        SET name = $1, gender = $2, phone = $3, email = $4, date_of_birth = $5, notes = $6, updated = NOW()
        WHERE id = $7
        RETURNING id;
      `,
      values: [name, gender, phone, email, dateOfBirth, notes, personId],
    };

    const personResult = await client.query(personUpdateQuery);

    const studentUpdateQuery = {
      text: `
        UPDATE student
        SET english_name = $1, current_school = $2, textbook_publisher = $3, grade_id = $4, join_date = $5, leave_date = $6, updated = NOW()
        WHERE person_id = $7
        RETURNING id;
      `,
      values: [
        englishName,
        currentSchool,
        textbookPublisher,
        grade.id,
        joinDate,
        leaveDate,
        personResult.rows[0].id,
      ],
    };

    const studentResult = await client.query(studentUpdateQuery);

    await client.query("COMMIT");
    return studentResult.rows[0].id;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const personID = req.query.id;
  const client = await getDBClient();

  switch (req.method) {
    case "GET":
      try {
        const studentSelectQuery = {
          text: `
            SELECT 
              person.id AS person_id,
              person.name,
              person.gender,
              person.phone,
              person.email,
              person.date_of_birth,
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
            WHERE person.id = $1;
          `,
          values: [personID],
        };
        const result = await client.query(studentSelectQuery);
        res.status(200).json({
          status: "Success",
          result: result.rows.map(parseStudent)[0],
          message: "Student information retrieved successfully.",
        });
      } catch (error) {
        console.error("Error retrieving student information", error);
        res.status(500).json({
          status: "Error",
          message: "Internal server error",
        });
      } finally {
        if (client) {
          await releaseDBClient(client);
        }
      }
      break;
    case "POST":
      try {
        const data: Student = req.body;
        await createPersonAndStudent(client, data); // TODO return created objects
        res.status(200).json({
          status: "Success",
          result: {},
          message: "Student created successfully.",
        });
      } catch (error) {
        if (error.code === "23505") {
          // PostgreSQL unique constraint violation error
          res.status(409).json({
            status: "Error",
            message: "A student with the same details already exists",
          });
        } else {
          console.error("Error creating student", error);
          res.status(500).json({
            status: "Error",
            message: "Internal server error",
          });
        }
      } finally {
        if (client) {
          await releaseDBClient(client);
        }
      }
      break;
    case "PUT":
      try {
        const data: Student = req.body;
        await updatePersonAndStudent(client, data); // TODO return updated objects
        res.status(200).json({
          status: "Success",
          result: {},
          message: "Student updated successfully.",
        });
      } catch (error) {
        console.error("Error updating student", error);
        res.status(500).json({
          status: "Error",
          message: "Internal server error",
        });
      } finally {
        if (client) {
          await releaseDBClient(client);
        }
      }
      break;
    // TODO set to inactive instead of delete
    case "DELETE":
      const studentDeleteQuery = {
        text: `
          DELETE FROM student WHERE id = $1;
        `,
        values: [personID],
      };
      await client.query(studentDeleteQuery);
      res.status(200).json({
        status: "Success",
        message: "Student deleted successfully.",
      });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
