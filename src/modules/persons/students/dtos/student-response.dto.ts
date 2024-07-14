import { GradeDTO } from "../../../grades";

export interface StudentResponseDTO {
  studentId: number;
  name: string;
  gender: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  notes?: string;
  englishName: string;
  currentSchool: string;
  textbookPublisher: string;
  grade: GradeDTO;
  joinDate: Date;
  leaveDate?: Date;
}
