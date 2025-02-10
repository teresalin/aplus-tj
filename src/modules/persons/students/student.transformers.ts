import { UpdateStudentDTO } from "./dtos";
import { Student } from "./types";

export function studentToUpdateStudentDTO(student: Student): UpdateStudentDTO {
  return {
    id: student.id,
    personId: student.personId,
    name: student.name,
    englishName: student.englishName,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
    notes: student.notes,
    phone: student.phone,
    email: student.email,
    currentSchool: student.currentSchool,
    gradeId: student.grade.id,
    textbookPublisher: student.textbookPublisher,
    joinDate: student.joinDate,
    leaveDate: student.leaveDate,
    active: student.active,
  };
}
