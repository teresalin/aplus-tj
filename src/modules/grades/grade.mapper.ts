import { Grade } from "./types";

export function mapRowToGrade(row: any): Grade {
  return {
    id: row.assignment_id,
    name: row.assignment_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
