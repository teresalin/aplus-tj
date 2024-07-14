import { getDBClient } from "../../../lib/db-connector";
import { Grade } from "./types";

export async function findAllGrades(): Promise<Grade[]> {
  const client = await getDBClient();

  try {
    const selectGradesQuery = {
      text: `
        SELECT id, name FROM grade;
        `,
    };
    const result = await client.query(selectGradesQuery);

    const grades: Grade[] = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));
    return grades;
  } catch (error) {
    console.error("Error retrieving grades from database:", error);
    throw error;
  } finally {
    client.release();
  }
}
