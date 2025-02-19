import { GradeDTO } from "../../../grades";

export interface StudentResponseDTO {
  studentId: number;
  name: string;
  preferredName?: string;
  gender: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  notes?: string;
  currentSchool: string;
  textbookPublisher: string;
  grade: GradeDTO;
  admissionDate: Date;
  departureDate?: Date;
}
