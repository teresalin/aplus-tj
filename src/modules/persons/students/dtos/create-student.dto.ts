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
  grade: GradeDTO;
  textbookPublisher: string;
  joinDate: Date;
  leaveDate?: Date;
}
