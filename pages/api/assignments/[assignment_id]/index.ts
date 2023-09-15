import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";

async function getAssignment(client, assignmentID) {
  try {
    const query = {
      text: `
          SELECT 
            assignment.id, 
            assignment.name, 
            assignment.description, 
            assignment.due_date
          FROM assignment
          WHERE assignment.id = $1;
        `,
      values: [assignmentID],
    };

    const result = await client.query(query);
    return result.rows[0];
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
}

async function createAssignment(client, { name, description, dueDate }) {
  const query = {
    text: `
      INSERT INTO assignment(name, description, due_date, time_created, time_updated) 
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id;
    `,
    values: [name, description, dueDate],
  };

  const result = await client.query(query);
  return result.rows[0].id;
}

async function createClassAssignment(client, classID, assignmentID) {
  const query = {
    text: `
      INSERT INTO class_assignment(class_id, assignment_id, time_created, time_updated) 
      VALUES ($1, $2, NOW(), NOW())
      RETURNING id;
    `,
    values: [classID, assignmentID],
  };

  const result = await client.query(query);
  return result.rows[0].id;
}

async function updateAssignment(
  client,
  assignmentID,
  { assignmentName, description, dueDate }
) {
  const query = {
    text: `
      UPDATE assignment 
      SET name = $2, description = $3, due_date = $4, time_updated = NOW()
      WHERE id = $1
    `,
    values: [assignmentID, assignmentName, description, dueDate],
  };
  await client.query(query);
}

async function updateClassAssignment(client, assignmentID, { classId }) {
  const query = {
    text: `
      UPDATE class_assignment 
      SET class_id = $2, time_updated = NOW()
      WHERE assignment_id = $1
    `,
    values: [assignmentID, classId],
  };
  await client.query(query);
}

async function deleteAssignment(client, assignmentID) {
  const query = {
    text: `
      DELETE FROM assignment WHERE id = $1
    `,
    values: [assignmentID],
  };
  await client.query(query);
}

async function deleteClassAssignment(client, assignmentID) {
  const query = {
    text: `
      DELETE FROM class_assignment WHERE assignment_id = $1
    `,
    values: [assignmentID],
  };
  await client.query(query);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const assignmentID = req.query.assignment_id;
  const client = await getDBClient();

  switch (req.method) {
    case "GET":
      try {
        const result = await getAssignment(client, assignmentID);
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
      }
      break;
    case "POST":
      try {
        const { name, description, dueDate, classId } = req.body;
        const assignmentID = await createAssignment(client, {
          name,
          description,
          dueDate,
        });
        await createClassAssignment(client, classId, assignmentID);
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
        const { assignmentName, description, dueDate, classId } = req.body;
        await updateAssignment(client, assignmentID, {
          assignmentName,
          description,
          dueDate,
        });
        await updateClassAssignment(client, assignmentID, {
          classId,
        });
        res.status(200).json({ message: "Success" });
      } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
      }
      break;
    case "DELETE":
      await deleteClassAssignment(client, assignmentID);
      await deleteAssignment(client, assignmentID);
      res.status(200).json({ message: "Success", id: assignmentID });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
