import { GradeDTO } from "../../../grades";

export interface CreateStudentDTO {
  name: string;
  englishName?: string;
  gender: string;
  dateOfBirth: Date;
  notes?: string;
  phone: string;
  email: string;
  currentSchool: string;
  gradeId: number;
  textbookPublisher: string;
  joinDate: Date;
  leaveDate?: Date;
}
