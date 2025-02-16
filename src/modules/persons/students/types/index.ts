import { Grade } from "../../../grades";
import { Person } from "../../types";

export interface Student extends Person {
  studentId?: number;
  englishName?: string;
  currentSchool?: string;
  textbookPublisher?: string;
  grade: Grade;
  admissionDate: Date;
  departureDate?: Date;
}

export interface StudentSummary {
  id: number;
  studentId?: number;
  name: string;
  dateOfBirth: Date;
  englishName?: string;
  currentSchool?: string;
  notes?: string;
}
