import { getDBClient } from "../../../lib/db-connector";
import { CreateGradeDTO } from "./dtos/create-grade.dto";
import { Grade } from "./types";

export async function findAllGrades(): Promise<Grade[]> {
  const client = await getDBClient();

  try {
    const result = await client.query<{
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    }>(`
      SELECT
        id,
        name,
        created_at  AS "createdAt",
        updated_at  AS "updatedAt"
      FROM grade;
    `);

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
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
          created_at  AS "createdAt",
          updated_at  AS "updatedAt"
      `,
      values: [dto.name],
    };

    const result = await client.query<{
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    }>(insertQuery);

    await client.query("COMMIT");

    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      createdAt: result.rows[0].createdAt,
      updatedAt: result.rows[0].updatedAt,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating grade:", error);
    throw error;
  } finally {
    client.release();
  }
}
