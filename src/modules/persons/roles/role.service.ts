import { getDBClient } from "../../../../lib/db-connector";
import { CreateRoleDTO } from "./dtos/create-role.dto";
import { mapRowToRole } from "./role.mapper";
import { Role } from "./types";

export const findAllRoles = async (): Promise<Role[]> => {
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
    FROM staff_role;
  `);

    return rows.map(mapRowToRole);
  } catch (error) {
    console.error("Error retrieving staff roles", error);
    throw error;
  } finally {
    client.release();
  }
};

export async function createRole(dto: CreateRoleDTO): Promise<Role> {
  const client = await getDBClient();
  try {
    await client.query("BEGIN");

    const insertQuery = {
      text: `
        INSERT INTO staff_role (name)
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

    return mapRowToRole(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating role:", error);
    throw error;
  } finally {
    client.release();
  }
}
