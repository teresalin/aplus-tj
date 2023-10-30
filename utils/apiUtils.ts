import { Class } from "../pages/api/classes";
import { Staff } from "../pages/api/persons/staffs";
import { Student } from "../pages/api/persons/students";

export function parseStudent(row: any): Student {
  return {
    id: row.id,
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
    id: row.id,
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
      id: row.id,
      name: row.name,
      gender: row.gender,
      phone: row.phone,
      email: row.email,
      dateOfBirth: row.date_of_birth,
      notes: row.notes,
      active: row.active,
      staffId: row.teacher_id,
      role: {
        id: row.staff_role_id,
        name: row.staff_role_name,
      },
      joinDate: row.join_date,
      leaveDate: row.leave_date,
    },
    grade: {
      id: row.grade_id,
      name: row.grade_name,
    },
    schedules: row.schedules,
    capacity: row.capacity,
    studentCount: row.student_count,
  };
}
