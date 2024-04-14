import { Grade } from "../../../../../pages/api/grades";
import { Person } from "../../../../../pages/api/persons";

export interface Student extends Person {
  studentId: number;
  englishName: string;
  currentSchool: string;
  textbookPublisher: string;
  grade: Grade;
  joinDate: Date;
  leaveDate: Date;
}
