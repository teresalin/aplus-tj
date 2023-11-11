import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";
import { PoolClient } from "pg";
import { Assignment } from "..";

async function createAssignmentAndClass(client: PoolClient, data: Assignment) {
  const { id, name, classInfo, description, dueDate } = data;

  try {
    await client.query("BEGIN"); // Start a transaction
    const assignmentInsertQuery = {
      text: `
      INSERT INTO assignment(name, description, due_date, time_created, time_updated) 
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id;
    `,
      values: [name, description, dueDate],
    };

    const assignmentResult = await client.query(assignmentInsertQuery);

    const classInsertQuery = {
      text: `
      INSERT INTO class_assignment(class_id, assignment_id, time_created, time_updated) 
      VALUES ($1, $2, NOW(), NOW())
      RETURNING id;
    `,
      values: [classInfo.id, id],
    };

    const classResult = await client.query(classInsertQuery);
    await client.query("COMMIT"); // Commit the transaction
    return classResult.rows[0].id;
  } catch (err) {
    await client.query("ROLLBACK"); // Roll back the transaction on error
    throw err;
  }
}

async function updateAssignmentAndClass(client: PoolClient, data: Assignment) {
  const { id, name, classInfo, description, dueDate } = data;

  try {
    await client.query("BEGIN"); // Start a transaction

    const assignmentUpdateQuery = {
      text: `
      UPDATE assignment 
      SET name = $2, description = $3, due_date = $4, time_updated = NOW()
      WHERE id = $1
    `,
      values: [id, name, description, dueDate],
    };

    const assignmentResult = await client.query(assignmentUpdateQuery);

    const classUpdateQuery = {
      text: `
      UPDATE class_assignment 
      SET class_id = $2, time_updated = NOW()
      WHERE assignment_id = $1
    `,
      values: [id, classInfo.id],
    };

    const classResult = await client.query(classUpdateQuery);

    await client.query("COMMIT"); // Commit the transaction
    return classResult.rows[0].id;
  } catch (err) {
    await client.query("ROLLBACK"); // Roll back the transaction on error
    throw err;
  }
}

async function deleteAssignmentAndClass(
  client: PoolClient,
  assignmentID: string | string[] | undefined
) {
  try {
    await client.query("BEGIN"); // Start a transaction

    const assignmentDeleteQuery = {
      text: `
      DELETE FROM assignment WHERE id = $1
    `,
      values: [assignmentID],
    };

    const assignmentResult = await client.query(assignmentDeleteQuery);

    const classDeleteQuery = {
      text: `
      DELETE FROM class_assignment WHERE assignment_id = $1
    `,
      values: [assignmentID],
    };

    const classResult = await client.query(classDeleteQuery);

    await client.query("COMMIT"); // Commit the transaction
    return classResult.rows[0].id;
  } catch (err) {
    await client.query("ROLLBACK"); // Roll back the transaction on error
    throw err;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const assignmentID = req.query.assignment_id;
  const client = await getDBClient();

  switch (req.method) {
    case "GET":
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
        res.status(200).json(result.rows[0]);
      } catch (err) {
        console.error("Error retrieving assignment", err);
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    case "POST":
      try {
        const data: Assignment = req.body;
        await createAssignmentAndClass(client, data);
        res.status(200).json({ message: "Success" });
      } catch (err) {
        console.error("Error creating assignment", err);
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    case "PUT":
      try {
        const data: Assignment = req.body;
        updateAssignmentAndClass(client, data);
        res.status(200).json({ message: "Success" });
      } catch (err) {
        console.error("Error updating assignment", err);
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    case "DELETE":
      try {
        deleteAssignmentAndClass(client, assignmentID);
        res.status(200).json({ message: "Success" });
      } catch (err) {
        console.error("Error deleting assignment", err);
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
