import { Grade } from "../../../../pages/api/grades"; // TODO move up the level so its not nested too deep

export interface UpdateStudentDTO {
  personId?: number;
  studentId?: number;
  name?: string;
  gender?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: Date;
  notes?: string;
  active?: boolean;
  englishName?: string;
  currentSchool?: string;
  textbookPublisher?: string;
  grade?: Grade;
  joinDate?: Date;
  leaveDate?: Date;
}
