import { UpdateStudentDTO } from "./dtos";
import { Student } from "./types";

export function studentToUpdateStudentDTO(student: Student): UpdateStudentDTO {
  return {
    id: student.id,
    studentId: student.studentId,
    name: student.name,
    preferredName: student.preferredName,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
    notes: student.notes,
    phone: student.phone,
    email: student.email,
    currentSchool: student.currentSchool,
    gradeId: student.grade.id,
    textbookPublisher: student.textbookPublisher,
    admissionDate: student.admissionDate,
    departureDate: student.departureDate,
    active: student.active,
  };
}
