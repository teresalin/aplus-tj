import { Grade } from "../../../../pages/api/grades"; // TODO move up the level so its not nested too deep

export interface UpdateStudentDTO {
  personId?: number;
  studentId?: number;
  name?: string;
  englishName?: string;
  gender?: string;
  dateOfBirth?: Date;
  notes?: string;
  phone?: string;
  email?: string;
  currentSchool?: string;
  grade?: Grade;
  textbookPublisher?: string;
  joinDate?: Date;
  leaveDate?: Date;
  active?: boolean;
}
