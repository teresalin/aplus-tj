import { Grade } from "../../../grades";
import { Person } from "../../types";

export interface Student extends Person {
  studentId?: string;
  currentSchool?: string;
  textbookPublisher?: string;
  grade: Grade;
  admissionDate: Date;
  departureDate?: Date;
}

export interface StudentSummary {
  id: string;
  name: string;
  preferredName?: string;
  dateOfBirth: Date;
  currentSchool?: string;
  notes?: string;
}
