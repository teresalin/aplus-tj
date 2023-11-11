import { PoolClient } from "pg";
import { getDBClient } from "../../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { Student } from "..";
import { parseStudent } from "../../../../../utils/apiUtils";

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
    await client.query("BEGIN"); // Start a transaction
    const personInsertQuery = {
      text: `
        INSERT INTO person(name, gender, phone, email, date_of_birth, notes, active, time_created, time_updated) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id;
      `,
      values: [name, gender, phone, email, dateOfBirth, notes, "t"],
    };

    const personResult = await client.query(personInsertQuery);

    const studentInsertQuery = {
      text: `
        INSERT INTO student(person_id, english_name, current_school, textbook_publisher, grade_id, join_date, leave_date, time_created, time_updated) 
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
    await client.query("COMMIT"); // Commit the transaction
    return studentResult.rows[0].id;
  } catch (err) {
    await client.query("ROLLBACK"); // Roll back the transaction on error
    throw err;
  }
}

async function updatePersonAndStudent(client: PoolClient, data: Student) {
  const {
    id,
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
    await client.query("BEGIN"); // Start a transaction

    const personUpdateQuery = {
      text: `
        UPDATE person
        SET name = $1, gender = $2, phone = $3, email = $4, date_of_birth = $5, notes = $6, time_updated = NOW()
        WHERE id = $7
        RETURNING id;
      `,
      values: [name, gender, phone, email, dateOfBirth, notes, id],
    };

    const personResult = await client.query(personUpdateQuery);

    const studentUpdateQuery = {
      text: `
        UPDATE student
        SET english_name = $1, current_school = $2, textbook_publisher = $3, grade_id = $4, join_date = $5, leave_date = $6, time_updated = NOW()
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

    await client.query("COMMIT"); // Commit the transaction
    return studentResult.rows[0].id;
  } catch (err) {
    await client.query("ROLLBACK"); // Roll back the transaction on error
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
                person.id,
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
        res.status(200).json(result.rows.map(parseStudent)[0]);
      } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
      }
      break;
    case "POST":
      try {
        const data: Student = req.body;
        await createPersonAndStudent(client, data);
        res.status(200).json({ message: "Success" });
      } catch (err) {
        if (err.code === "23505") {
          // PostgreSQL unique constraint violation error
          res
            .status(409)
            .json({
              message: "A student with the same details already exists",
            });
        } else {
          console.error("Error creating student", err);
          res.status(500).json({ message: "Something went wrong" });
        }
      }
      break;
    case "PUT":
      try {
        const data: Student = req.body;
        await updatePersonAndStudent(client, data);
        res.status(200).json({ message: "Success" });
      } catch (err) {
        console.error("Error updating student", err);
        res.status(500).json({ message: "Something went wrong" });
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
      res.status(200).json({ message: "Success" });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
