import { Class } from "../pages/api/classes";
import { Staff } from "../pages/api/persons/staffs";
import { Student } from "../pages/api/persons/students";

export function parseStudent(row: any): Student {
  return {
    personId: row.person_id,
    studentId: row.student_id,
    name: row.name,
    englishName: row.english_name,
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    dateOfBirth: row.date_of_birth,
    currentSchool: row.current_school,
    textbookPublisher: row.textbook_publisher,
    grade: {
      id: row.grade_id,
      name: row.grade_name,
    },
    joinDate: row.join_date,
    leaveDate: row.leave_date,
    notes: row.notes,
    active: row.active,
  };
}

export function parseStaff(row: any): Staff {
  return {
    personId: row.person_id,
    staffId: row.staff_id,
    name: row.name,
    role: {
      id: row.grade_id,
      name: row.grade_name,
    },
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    dateOfBirth: row.date_of_birth,
    joinDate: row.join_date,
    leaveDate: row.leaveDate,
    notes: row.notes,
    active: row.active,
  };
}

export function parseClass(row: any): Class {
  return {
    id: row.class_id,
    name: row.class_name,
    teacher: {
      staffId: row.staff_id,
      name: row.name,
      role: undefined,
      joinDate: undefined,
      leaveDate: undefined,
      id: 0,
      gender: "",
      phone: "",
      email: "",
      dateOfBirth: undefined,
      notes: "",
      active: false,
    },
    grade: {
      id: row.grade_id,
      name: row.grade_name,
    },
    schedules: row.schedules,
    capacity: row.capacity,
    studentCount: row.student_count,
    activeStudents: row.active_students,
    assignments: row.assignments,
  };
}
