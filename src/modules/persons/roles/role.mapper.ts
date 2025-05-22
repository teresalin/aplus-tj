import { Role } from "./types";

export function mapRowToRole(row: any): Role {
  return {
    id: row.assignment_id,
    name: row.assignment_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
