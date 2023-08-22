import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";
import { Student } from "..";

async function getStudent(client, studentID) {
  try {
    const getQuery = {
      text: `
          SELECT s.id AS student_id, s.join_date, s.leave_date, p.*
          FROM students s
          INNER JOIN persons p ON s.person_id = p.id
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

async function createPerson(
  client,
  { name, phone, email, date_of_birth, notes, active }
) {
  const insertQuery = {
    text: `
        INSERT INTO persons(name, phone, email, date_of_birth, notes, active, time_created, time_updated) 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id;
      `,
    values: [name, phone, email, date_of_birth, notes, active],
  };

  const result = await client.query(insertQuery);
  return result.rows[0].id;
}

async function createStudent(client, personID, { join_date, leave_date }) {
  const insertQuery = {
    text: `
        INSERT INTO students(person_id, join_date, leave_date, time_created, time_updated) 
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING id;
      `,
    values: [personID, join_date, leave_date],
  };

  const result = await client.query(insertQuery);
  return result.rows[0].id;
}

async function updatePerson(
  client,
  personID,
  { name, phone, email, notes, active }
) {
  const updateQuery = {
    text: `
        UPDATE persons 
        SET name = $2, phone = $3, email = $4, notes = $5, active = $6, time_updated = NOW()
        WHERE id = $1
        RETURNING id;
      `,
    values: [personID, name, phone, email, notes, active],
  };

  const result = await client.query(updateQuery);
  return result.rows[0].id;
}

async function updateStudent(client, personID, { join_date, leave_date }) {
  const updateQuery = {
    text: `
        UPDATE students 
        SET join_date = COALESCE($2, join_date), leave_date = COALESCE($3, leave_date), time_updated = NOW()
        WHERE person_id = $1
        RETURNING id;
      `,
    values: [personID, join_date, leave_date],
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
        const {
          name,
          phone,
          email,
          date_of_birth,
          notes,
          join_date,
          leave_date,
          active,
        } = req.body;

        const personID = await createPerson(client, {
          name,
          phone,
          email,
          date_of_birth,
          notes,
          active,
        });
        await createStudent(client, personID, { join_date, leave_date });
        res.status(200).json({ message: "Success" });
      } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
      }
      break;
    case "PUT":
      try {
        const { name, phone, email, notes, join_date, leave_date, active } =
          req.body;

        const fetchPersonIdQuery = {
          text: "SELECT person_id FROM students WHERE id = $1;",
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
          join_date,
          leave_date,
        });
        res.status(200).json({ message: "Success" });
      } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
      }
      break;
    case "DELETE":
      const deleteQuery = {
        text: `
          DELETE FROM students WHERE id = $1;
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
