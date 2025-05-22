import { getDBClient } from "../../../lib/db-connector";
import { CreateGradeDTO } from "./dtos/create-grade.dto";
import { mapRowToGrade } from "./grade.mapper";
import { Grade } from "./types";

export async function findAllGrades(): Promise<Grade[]> {
  const client = await getDBClient();

  try {
    const { rows } = await client.query<{
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    }>(`
    SELECT
      id,
      name,
      created_at,
      updated_at
    FROM grade;
  `);

    return rows.map(mapRowToGrade);
  } catch (error) {
    console.error("Error retrieving grades:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function createGrade(dto: CreateGradeDTO): Promise<Grade> {
  const client = await getDBClient();
  try {
    await client.query("BEGIN");

    const insertQuery = {
      text: `
        INSERT INTO grade (name)
        VALUES ($1)
        RETURNING
          id,
          name,
          created_at
          updated_at;
      `,
      values: [dto.name],
    };

    const { rows } = await client.query<{
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    }>(insertQuery);

    await client.query("COMMIT");

    return mapRowToGrade(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating grade:", error);
    throw error;
  } finally {
    client.release();
  }
}
