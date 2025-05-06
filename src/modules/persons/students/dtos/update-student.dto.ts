export interface UpdateStudentDTO {
  id: string;
  studentId?: string;
  name?: string;
  preferredName?: string;
  gender?: string;
  dateOfBirth?: Date;
  notes?: string;
  phone?: string;
  email?: string;
  currentSchool?: string;
  gradeId?: string;
  textbookPublisher?: string;
  admissionDate?: Date;
  departureDate?: Date;
  active?: boolean;
}
