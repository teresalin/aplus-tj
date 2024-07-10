import { getDBClient } from "../../../../lib/db-connector";
import { Role } from "./types";

export const findAllRoles = async (): Promise<Role[]> => {
  const client = await getDBClient();

  try {
    const selectRolesQuery = {
      text: `SELECT id, name FROM staff_role;`,
    };
    const result = await client.query(selectRolesQuery);

    const roles: Role[] = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
    }));
    return roles;
  } catch (error) {
    console.error("Error retrieving staff roles", error);
    throw error;
  } finally {
    client.release();
  }
};
