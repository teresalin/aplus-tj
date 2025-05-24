import { Grade } from "../../grades";
import { Student } from "./types";

export function mapRowToStudent(row: any): Student {
  return {
    id: row.id,
    studentId: row.student_id ?? undefined,
    name: row.name,
    preferredName: row.preferred_name ?? undefined,
    gender: row.gender,
    email: row.email,
    phone: row.phone,
    dateOfBirth: new Date(row.date_of_birth),
    currentSchool: row.current_school ?? undefined,
    textbookPublisher: row.textbook_publisher ?? undefined,
    grade: { id: row.grade_id, name: row.grade_name } as Grade,
    notes: row.notes ?? undefined,
    active: row.active,
    admissionDate: new Date(row.admission_date),
    // In TypeScript, optional properties are typically represented by `undefined`
    // rather than `null`. This aligned with the way TypeScript defines optional
    // parameters in function signatures and object types.
    departureDate: row.departure_date
      ? new Date(row.departure_date)
      : undefined,
  };
}
