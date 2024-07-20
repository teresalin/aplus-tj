import { Assignment } from "../assignments";
import { ClassSummary } from "../classes";

export function mapRowToAssignment(row: any): Assignment {
  return {
    id: row.assignment_id,
    name: row.assignment_name,
    description: row.description,
    class: {
      id: row.class_id,
      name: row.class_name,
      teacherName: row.staff_name,
    } as ClassSummary,
    dueDate: row.due_date,
  };
}
