export interface CreateStudentDTO {
  name: string;
  preferredName?: string;
  gender: string;
  dateOfBirth: Date;
  notes?: string;
  phone: string;
  email: string;
  currentSchool: string;
  gradeId: string;
  textbookPublisher: string;
  admissionDate: Date;
  departureDate?: Date;
}
