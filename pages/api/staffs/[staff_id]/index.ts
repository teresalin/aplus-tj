import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";

async function getStaff(client, staffID) {
  try {
    const getQuery = {
      text: `
        SELECT s.id AS student_id, s.role_id, s.join_date, s.leave_date, p.*
        FROM student s
        INNER JOIN person p ON s.person_id = p.id
        WHERE s.id = $1;
      `,
      values: [staffID],
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
  { name, phone, email, dateOfBirth, notes }
) {
  const insertQuery = {
    text: `
      INSERT INTO person(name, phone, email, date_of_birth, notes, active, time_created, time_updated) 
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id;
    `,
    values: [name, phone, email, dateOfBirth, notes, "t"],
  };

  const result = await client.query(insertQuery);
  return result.rows[0].id;
}

async function createStaff(client, personID, { roleId, joinDate, leaveDate }) {
  const insertQuery = {
    text: `
      INSERT INTO staffs(person_id, role_id, join_date, leave_date, time_created, time_updated) 
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id;
    `,
    values: [personID, roleId, joinDate, leaveDate],
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

async function updateStaff(client, personID, { roleId, joinDate, leaveDate }) {
  const updateQuery = {
    text: `
      UPDATE staff 
      SET role_id = $2 ,join_date = COALESCE($3, join_date), leave_date = COALESCE($4, leave_date), time_updated = NOW()
      WHERE person_id = $1
      RETURNING id;
    `,
    values: [personID, roleId, joinDate, leaveDate],
  };

  const result = await client.query(updateQuery);
  return result.rows[0].id;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const staffID = req.query.student_id;
  const client = await getDBClient();

  switch (req.method) {
    case "GET":
      try {
        const result = await getStaff(client, staffID);
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
          dateOfBirth,
          notes,
          roleId,
          joinDate,
          leaveDate,
        } = req.body;

        const personID = await createPerson(client, {
          name,
          phone,
          email,
          dateOfBirth,
          notes,
        });
        await createStaff(client, personID, { roleId, joinDate, leaveDate });
        res.status(200).json({ message: "Success" });
      } catch (err) {
        if (err.code === "23505") {
          // PostgreSQL unique constraint violation error
          res
            .status(409)
            .json({ message: "A person with the same details already exists" });
        } else {
          res.status(500).json({ message: "Something went wrong" });
        }
      }
      break;
    case "PUT":
      try {
        const {
          name,
          phone,
          email,
          notes,
          roleId,
          joinDate,
          leaveDate,
          active,
        } = req.body;

        const fetchPersonIdQuery = {
          text: "SELECT person_id FROM student WHERE id = $1;",
          values: [staffID],
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
        await updateStaff(client, personID, {
          roleId,
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
        values: [staffID],
      };
      await client.query(deleteQuery);
      res.status(200).json({ message: "OK", id: staffID });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
