import { Assignment } from "./types";
import { AssignmentFilter } from "./constants";
import { CreateAssignmentDTO, UpdateAssignmentDTO } from "./dtos";
import { getDBClient } from "../../../lib/db-connector";
import { mapRowToAssignment } from "./assignment.mapper";

const BASE_ASSIGNMENT_SELECT = `
  SELECT
    a.id                 AS assignment_id,
    a.name               AS assignment_name,
    a.description,
    c.id                 AS class_id,
    c.name               AS class_name,
    a.due_date
  FROM assignment a
  INNER JOIN class_assignment ca ON ca.assignment_id = a.id
  INNER JOIN class            c  ON ca.class_id      = c.id
`;

export async function findAllAssignments(
  filter: AssignmentFilter = "all",
): Promise<Assignment[]> {
  const client = await getDBClient();
  try {
    let sql = BASE_ASSIGNMENT_SELECT;
    if (filter === "upcoming") {
      sql += ` WHERE a.due_date > NOW()`;
    } else if (filter === "past due") {
      sql += ` WHERE a.due_date <= NOW()`;
    }
    sql += ` ORDER BY a.due_date;`;

    const { rows } = await client.query(sql);
    return rows.map(mapRowToAssignment);
  } catch (error) {
    console.error("Error retrieving assignments:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function findAssignmentById(
  id: string,
): Promise<Assignment | null> {
  const client = await getDBClient();
  try {
    const { rows } = await client.query(
      `${BASE_ASSIGNMENT_SELECT} WHERE a.id = $1;`,
      [id],
    );
    return rows.length ? mapRowToAssignment(rows[0]) : null;
  } catch (error) {
    console.error("Error retrieving assignment:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function createAssignment(
  dto: CreateAssignmentDTO,
): Promise<Assignment> {
  const client = await getDBClient();
  try {
    await client.query("BEGIN");

    // 1) insert into assignment
    const {
      rows: [{ id: assignmentId }],
    } = await client.query<{ id: number }>(
      `
      INSERT INTO assignment
        (name, description, due_dat)
      VALUES ($1, $2 ,$3)
      RETURNING id;
      `,
      [dto.name, dto.description, dto.dueDate],
    );

    // 2) link to a class
    await client.query(
      `
      INSERT INTO class_assignment
        (class_id, assignment_id)
      VALUES ($1, $2);
      `,
      [dto.classId, assignmentId],
    );

    // 3) fetch and return the freshly-created assignment
    const { rows } = await client.query(
      `${BASE_ASSIGNMENT_SELECT} WHERE a.id = $1;`,
      [assignmentId],
    );

    await client.query("COMMIT");
    return mapRowToAssignment(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating assignment:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateAssignment(dto: UpdateAssignmentDTO) {
  const client = await getDBClient();
  try {
    await client.query("BEGIN");

    // 1) update assignment
    await client.query<{ id: string }>(
      `
      UPDATE assignment
         SET name        = $2,
             description = $3,
             due_date    = $4
       WHERE id = $1
      RETURNING id;
      `,
      [dto.id, dto.name, dto.description, dto.dueDate],
    );

    // 2) update class link
    await client.query(
      `
      UPDATE class_assignment
      SET class_id = $2
      WHERE assignment_id = $1
      RETURNING class_id;
      `,
      [dto.id, dto.classId],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating assignment:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteAssignment(id: string): Promise<void> {
  const client = await getDBClient();
  try {
    await client.query("BEGIN");

    // 1) remove link first
    await client.query(
      `DELETE FROM class_assignment WHERE assignment_id = $1;`,
      [id],
    );

    // 2) delete assignment
    await client.query<{ id: number }>(
      `DELETE FROM assignment WHERE id = $1 RETURNING id;`,
      [id],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting assignment:", error);
    throw error;
  } finally {
    client.release();
  }
}
