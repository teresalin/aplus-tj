import { Assignment } from "./types";
import { getDBClient } from "../../../lib/db-connector";
import { mapRowToAssignment } from "./assignment.mapper";

export async function findAllAssignments(
  filter: string
): Promise<Assignment[]> {
  const client = await getDBClient();

  try {
    const { rows } = await client.query(
      `
        SELECT
            assignment.assignment_id,
            assignment.name AS assignment_name,
            assignment.description,
            class.id AS class_id,
            class.name AS class_name,
            assignment.due_date,
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
