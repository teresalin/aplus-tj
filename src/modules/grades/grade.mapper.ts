import { Grade } from "./schema";

export function mapRowToGrade(row: any): Grade {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
