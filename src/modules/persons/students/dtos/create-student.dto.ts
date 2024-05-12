import { Grade } from "../../../../pages/api/grades";

export interface CreateStudentDTO {
  personId: number;
  name: string;
  gender: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  notes?: string;
  active?: boolean;
  studentId: number;
  englishName?: string;
  currentSchool: string;
  textbookPublisher: string;
  grade: Grade;
  joinDate: Date;
  leaveDate?: Date;
}
