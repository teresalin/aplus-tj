import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";
import { Student } from "..";
import { Client } from "pg";

async function getStudent(client, studentID) {
  try {
    const getQuery = {
      text: `
          SELECT s.id AS student_id, s.join_date, s.leave_date, p.*
          FROM student s
          INNER JOIN person p ON s.person_id = p.id
          WHERE s.id = $1;
        `,
      values: [studentID],
    };

    const result = await client.query(getQuery);
    return result.rows[0];
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
}

async function createPersonAndStudent(client: Client, data: Student) {
  const { name, gender, phone, email, dateOfBirth, notes, englishName, currentSchool, textbookPublisher, grade, joinDate, leaveDate } = data;

  try {
    await client.query('BEGIN'); // Start a transaction
    const personInsertQuery = {
      text: `
        INSERT INTO person(name, gender, phone, email, date_of_birth, notes, active, time_created, time_updated) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id;
      `,
      values: [name, gender, phone, email, dateOfBirth, notes, 't'],
    };

    const personResult = await client.query(personInsertQuery);

    // Create the student
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
    await client.query('COMMIT'); // Commit the transaction
    return studentResult.rows[0].id;
  } catch (err) {
    await client.query('ROLLBACK'); // Roll back the transaction on error
    throw err;
  }
}

async function updatePerson(
  client,
  personID,
  { name, phone, email, notes, active }
) {
  const updateQuery = {
    text: `
      UPDATE person 
      SET name = $2, phone = $3, email = $4, notes = $5, active = $6, time_updated = NOW()
      WHERE id = $1
      RETURNING id;
    `,
    values: [personID, name, phone, email, notes, active],
  };

  const result = await client.query(updateQuery);
  return result.rows[0].id;
}

async function updateStudent(client, personID, { joinDate, leaveDate }) {
  const updateQuery = {
    text: `
      UPDATE student 
      SET join_date = COALESCE($2, join_date), leave_date = COALESCE($3, leave_date), time_updated = NOW()
      WHERE person_id = $1
      RETURNING id;
    `,
    values: [personID, joinDate, leaveDate],
  };

  const result = await client.query(updateQuery);
  return result.rows[0].id;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const studentID = req.query.student_id;
  const client = await getDBClient();

  switch (req.method) {
    case "GET":
      try {
        const result = await getStudent(client, studentID);
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
      }
      break;
    case "POST":
      try {
        const data: Student = req.body;
        await createPersonAndStudent(client, data);
        res.status(200).json({ message: 'Success' });
      } catch (err) {
        if (err.code === '23505') {
          // PostgreSQL unique constraint violation error
          res.status(409).json({ message: 'A person with the same details already exists' });
        } else {
          res.status(500).json({ message: 'Something went wrong' });
        }
      }
      break;
    case "PUT":
      try {
        const { name, phone, email, notes, joinDate, leaveDate, active } =
          req.body;

        const fetchPersonIdQuery = {
          text: "SELECT person_id FROM student WHERE id = $1;",
          values: [studentID],
        };
        const personIdResult = await client.query(fetchPersonIdQuery);
        const personID = personIdResult.rows[0].person_id;

        await updatePerson(client, personID, {
          name,
          phone,
          email,
          notes,
          active,
        });
        await updateStudent(client, personID, {
          joinDate,
          leaveDate,
        });
        res.status(200).json({ message: "Success" });
      } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
      }
      break;
    case "DELETE":
      const deleteQuery = {
        text: `
          DELETE FROM student WHERE id = $1;
        `,
        values: [studentID],
      };
      await client.query(deleteQuery);
      res.status(200).json({ message: "OK", id: studentID });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
