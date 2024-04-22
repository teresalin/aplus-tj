import { getDBClient, releaseDBClient } from "../../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { parseStaff } from "../../../../../utils/apiUtils";
import { PoolClient } from "pg";
import { Staff } from "../../../../../src/components/persons/staffs/types";

async function createPersonAndStaff(client: PoolClient, data: Staff) {
  const {
    name,
    gender,
    phone,
    email,
    dateOfBirth,
    notes,
    role,
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

    const staffInsertQuery = {
      text: `
        INSERT INTO staff(person_id, role_id, join_date, leave_date, created, updated) 
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id;
      `,
      values: [personResult.rows[0].id, role.id, joinDate, leaveDate],
    };

    const staffResult = await client.query(staffInsertQuery);
    await client.query("COMMIT");
    return staffResult.rows[0].id;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

async function updatePersonAndStaff(client: PoolClient, data: Staff) {
  const {
    personId,
    name,
    gender,
    phone,
    email,
    dateOfBirth,
    notes,
    role,
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

    const staffUpdateQuery = {
      text: `
        UPDATE staff
        SET role_id = $1, join_date = $1, leave_date = $3, updated = NOW()
        WHERE person_id = $4
        RETURNING id;
      `,
      values: [role.id, joinDate, leaveDate, personResult.rows[0].id],
    };

    const staffResult = await client.query(staffUpdateQuery);

    await client.query("COMMIT");
    return staffResult.rows[0].id; // TODO return updated objects
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
        const staffSelectQuery = {
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
                staff.id AS staff_id,
                staff.join_date, 
                staff.leave_date, 
                role.id AS role_id,
                role.name AS role_name
              FROM staff
              INNER JOIN person ON staff.person_id = person.id
              INNER JOIN role ON staff.role_id = role.id
              WHERE person.id = $1;
            `,
          values: [personID],
        };
        const result = await client.query(staffSelectQuery);
        res.status(200).json({
          status: "Success",
          result: result.rows.map(parseStaff)[0],
          message: "Staff information retrieved successfully.",
        });
      } catch (err) {
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
        const data: Staff = req.body;
        await createPersonAndStaff(client, data);
        res.status(200).json({
          status: "Success",
          result: {},
          message: "Staff information created successfully.",
        });
      } catch (err) {
        if (err.code === "23505") {
          // PostgreSQL unique constraint violation error
          res.status(409).json({
            status: "Error",
            message: "A person with the same details already exists",
          });
        } else {
          console.error("Error retrieving staff information", err);
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
        const data: Staff = req.body;
        await updatePersonAndStaff(client, data);
        res.status(200).json({
          status: "Success",
          result: {},
          message: "Staff information updated successfully.",
        });
      } catch (err) {
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
    case "DELETE": // TODO set to inactive instead of delete
      try {
        const staffDeleteQuery = {
          text: `
            DELETE FROM staff WHERE id = $1;
          `,
          values: [personID],
        };
        await client.query(staffDeleteQuery);
        res.status(200).json({
          status: "Success",
          message: "Staff deleted successfully.",
        });
      } catch (err) {
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
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
