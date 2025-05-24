import { Role } from "./types";

export function mapRowToRole(row: any): Role {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
