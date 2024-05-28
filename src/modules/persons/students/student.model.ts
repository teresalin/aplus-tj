import { Grade } from "../../../pages/api/grades";

export class Student {
  personId: number;
  studentId: number;
  name: string;
  gender: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  englishName?: string;
  currentSchool: string;
  textbookPublisher: string;
  grade: Grade;
  notes?: string;
  active: boolean;
  joinDate: Date;
  leaveDate?: Date;

  constructor(data: any) {
    this.personId = data.person_id;
    this.studentId = data.student_id;
    this.name = data.name;
    this.gender = data.gender;
    this.email = data.email;
    this.phone = data.phone;
    this.dateOfBirth = new Date(data.date_of_birth);
    this.englishName = data.english_name;
    this.currentSchool = data.current_school;
    this.textbookPublisher = data.textbook_publisher;
    this.grade = { id: data.grade_id, name: data.grade_name }; // Assuming you have a constructor for Grade
    this.notes = data.notes;
    this.active = data.active;
    this.joinDate = new Date(data.join_date);
    this.leaveDate = data.leave_date ? new Date(data.leave_date) : undefined;
  }

  // Instance method for business logic
  isCurrentlyEnrolled(): boolean {
    return !this.leaveDate;
  }

  // Static method for email validation
  static validateEmail(email: string): boolean {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  // Method to get full profile information
  getProfileInfo(): string {
    return `${this.englishName} (${this.grade.name}) studies at ${this.currentSchool}`;
  }
}
