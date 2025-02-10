import { Grade } from "../../grades";
import { Student } from "./types";

export function mapRowToStudent(row: any): Student {
  return {
    id: row.student_id,
    personId: row.person_id,
    name: row.name,
    gender: row.gender,
    email: row.email,
    phone: row.phone,
    dateOfBirth: new Date(row.date_of_birth),
    englishName: row.english_name,
    currentSchool: row.current_school,
    textbookPublisher: row.textbook_publisher,
    grade: { id: row.grade_id, name: row.grade_name } as Grade,
    notes: row.notes,
    active: row.active,
    joinDate: new Date(row.join_date),
    // In TypeScript, optional properties are typically represented by `undefined`
    // rather than `null`. This aligned with the way TypeScript defines optional
    // parameters in function signatures and object types.
    leaveDate: row.leave_date ? new Date(row.leave_date) : undefined,
  };
}
