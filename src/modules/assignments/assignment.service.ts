import { Assignment } from "./types";
import { CreateAssignmentDTO, UpdateAssignmentDTO } from "./dtos";
import { getDBClient } from "../../../lib/db-connector";
import { mapRowToAssignment } from "./assignment.mapper";

export async function findAllAssignments(
  filter: string | string[] | undefined
): Promise<Assignment[]> {
  const client = await getDBClient();

  try {
    const { rows } = await client.query(
      `
        SELECT
            assignment.id AS assignment_id,
            assignment.name AS assignment_name,
            assignment.description,
            class.id AS class_id,
            class.name AS class_name,
            assignment.due_date
        FROM
            assignment
        INNER JOIN class_assignment ON assignment.id = class_assignment.assignment_id
        INNER JOIN class ON class_assignment.class_id = class.id
        WHERE
        CASE
            WHEN $1 = 'upcoming' THEN assignment.due_date > NOW()
            WHEN $1 = 'past due' THEN assignment.due_date <= NOW()
            ELSE TRUE -- For 'all' or any other value, no filter is applied
        END
        ORDER BY
            due_date;
        `,
      [filter]
    );
    return rows.map(mapRowToAssignment);
  } catch (error) {
    console.error("Error fetching assignments from database:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function findAssignmentById(
  assignmentId: number
): Promise<Assignment | null> {
  const client = await getDBClient();

  try {
    const { rows } = await client.query(
      `
        SELECT 
            assignment.id, 
            assignment.name, 
            assignment.description, 
            assignment.due_date
        FROM assignment
        WHERE assignment.id = $1;
        `,
      [assignmentId]
    );
    return rows.length ? mapRowToAssignment(rows[0]) : null;
  } catch (error) {
    console.error("Error retrieving assignment from database:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function createAssignment(dto: CreateAssignmentDTO) {
  const client = await getDBClient();

  try {
    await client.query("BEGIN");

    const insertAssignmentQuery = {
      text: `
          INSERT INTO assignment(name, description, due_date, created, updated) 
          VALUES ($1, $2, $3, NOW(), NOW())
          RETURNING id;
        `,
      values: [dto.name, dto.description, dto.dueDate],
    };
    const result = await client.query(insertAssignmentQuery);
    const assignmentId = result.rows[0].id;

    const insertClassQuery = {
      text: `
          INSERT INTO class_assignment(class_id, assignment_id, created, updated) 
          VALUES ($1, $2, NOW(), NOW())
          RETURNING id;
        `,
      values: [dto.classId, assignmentId],
    };
    await client.query(insertClassQuery);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating assignment in the database:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateAssignment(dto: UpdateAssignmentDTO) {
  const client = await getDBClient();

  try {
    await client.query("BEGIN");

    const updateAssignmentQuery = {
      text: `
          UPDATE assignment 
          SET name = $2, description = $3, due_date = $4, updated = NOW()
          WHERE id = $1
          RETURNING id;
        `,
      values: [dto.id, dto.name, dto.description, dto.dueDate],
    };
    await client.query(updateAssignmentQuery);

    const updateClassQuery = {
      text: `
          UPDATE class_assignment 
          SET class_id = $2, updated = NOW()
          WHERE assignment_id = $1
          RETURNING class_id;
        `,
      values: [dto.id, dto.classId],
    };
    await client.query(updateClassQuery);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating assignment in the database:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteAssignment(id: string) {
  const client = await getDBClient();

  try {
    await client.query("BEGIN");

    const deleteClassQuery = {
      text: `
        DELETE FROM class_assignment WHERE assignment_id = $1;
      `,
      values: [id],
    };
    await client.query(deleteClassQuery);

    const deleteAssignmentQuery = {
      text: `
         DELETE FROM assignment WHERE id = $1;
      `,
      values: [id],
    };
    await client.query(deleteAssignmentQuery);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting assignment in the database:", error);
    throw error;
  } finally {
    client.release();
  }
}
