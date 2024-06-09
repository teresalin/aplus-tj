import { getDBClient, releaseDBClient } from "../../../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { PoolClient } from "pg";
import {
  CreateAssignmentDTO,
  UpdateAssignmentDTO,
} from "../../../../modules/assignments";

async function createAssignmentAndClass(
  client: PoolClient,
  data: CreateAssignmentDTO
) {
  const { name, classId, description, dueDate } = data;

  try {
    await client.query("BEGIN");
    const insertAssignmentQuery = {
      text: `
        INSERT INTO assignment(name, description, due_date, created, updated) 
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING id;
      `,
      values: [name, description, dueDate],
    };

    const assignmentResult = await client.query(insertAssignmentQuery);
    const assignmentId = assignmentResult.rows[0].id;

    const insertClassQuery = {
      text: `
        INSERT INTO class_assignment(class_id, assignment_id, created, updated) 
        VALUES ($1, $2, NOW(), NOW())
        RETURNING id;
      `,
      values: [classId, assignmentId],
    };

    await client.query(insertClassQuery);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

async function updateAssignmentAndClass(
  client: PoolClient,
  data: UpdateAssignmentDTO
) {
  const { id, name, classId, description, dueDate } = data;

  try {
    await client.query("BEGIN");

    const updateAssignmentQuery = {
      text: `
        UPDATE assignment 
        SET name = $2, description = $3, due_date = $4, updated = NOW()
        WHERE id = $1
        RETURNING id;
      `,
      values: [id, name, description, dueDate],
    };
    await client.query(updateAssignmentQuery);

    const classUpdateQuery = {
      text: `
        UPDATE class_assignment 
        SET class_id = $2, updated = NOW()
        WHERE assignment_id = $1
        RETURNING class_id;
      `,
      values: [id, classId],
    };

    await client.query(classUpdateQuery);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

async function deleteAssignmentAndClass(
  client: PoolClient,
  assignmentID: string | string[] | undefined
) {
  try {
    await client.query("BEGIN");

    const assignmentDeleteQuery = {
      text: `
      DELETE FROM assignment WHERE id = $1;
    `,
      values: [assignmentID],
    };

    const assignmentResult = await client.query(assignmentDeleteQuery);

    const classDeleteQuery = {
      text: `
      DELETE FROM class_assignment WHERE assignment_id = $1;
    `,
      values: [assignmentID],
    };

    const classResult = await client.query(classDeleteQuery);
    const classId = classResult.rows[0].id;

    await client.query("COMMIT");
    return classId;
  } catch (err) {
    await client.query("ROLLBACK");
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
        const getResult = await client.query(query);
        res.status(200).json({
          status: "Success",
          result: getResult.rows[0],
          message: "Assignment retrieved successfully.",
        });
      } catch (err) {
        console.error("Error retrieving assignment", err);
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
        const data: CreateAssignmentDTO = req.body;
        const createResult = await createAssignmentAndClass(client, data);
        res.status(200).json({
          status: "Success",
          result: createResult,
          message: "Assignment created successfully.",
        });
      } catch (err) {
        console.error("Error creating assignment", err);
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
    case "PUT":
      try {
        const data: UpdateAssignmentDTO = req.body;
        const updateResult = await updateAssignmentAndClass(client, data);
        res.status(200).json({
          status: "Success",
          result: updateResult,
          message: "Class updated successfully.",
        });
      } catch (err) {
        console.error("Error updating assignment", err);
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
    case "DELETE":
      try {
        await deleteAssignmentAndClass(client, assignmentID);
        res.status(200).json({
          status: "Success",
          message: "Assignment deleted successfully.",
        });
      } catch (err) {
        console.error("Error deleting assignment", err);
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
