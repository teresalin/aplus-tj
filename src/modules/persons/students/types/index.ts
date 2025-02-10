import { Grade } from "../../../grades";
import { Person } from "../../types";

export interface Student extends Person {
  id: number;
  englishName?: string;
  currentSchool: string;
  textbookPublisher: string;
  grade: Grade;
  joinDate: Date;
  leaveDate?: Date;
}

export interface StudentSummary {
  studentId: number;
  name: string;
  dateOfBirth: Date;
  englishName?: string;
  currentSchool: string;
  notes?: string;
}
