export interface CreateStudentDTO {
  name: string;
  preferredName?: string;
  gender: string;
  dateOfBirth: Date;
  notes?: string;
  phone: string;
  email: string;
  currentSchool: string;
  gradeId: number;
  textbookPublisher: string;
  admissionDate: Date;
  departureDate?: Date;
}
