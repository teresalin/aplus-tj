export interface UpdateStudentDTO {
  id: number;
  studentId?: number;
  name?: string;
  englishName?: string;
  gender?: string;
  dateOfBirth?: Date;
  notes?: string;
  phone?: string;
  email?: string;
  currentSchool?: string;
  gradeId?: number;
  textbookPublisher?: string;
  joinDate?: Date;
  leaveDate?: Date;
  active?: boolean;
}
