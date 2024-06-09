import { Assignment } from "../src/modules/assignments";
import { Billing } from "../src/modules/billing/types";
import { Class } from "../src/modules/classes";
import { Parent } from "../src/modules/persons/parents";
import { Person } from "../src/modules/persons/types";
import { Session, SessionDetail } from "../src/modules/sessions";
import { Staff } from "../src/modules/persons/staffs";
import { Student } from "../src/modules/persons/students";
import { Schedule } from "../src/modules/schedules";

export function parsePerson(row: any): Person {
  return {
    personId: row.id,
    name: row.name,
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    dateOfBirth: row.date_of_birth,
    notes: row.notes,
    active: row.active,
  };
}

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
    capacity: row.capacity,
    teacher: {
      staffId: row.staff_id,
      name: row.staff_name,
    },
    grade: {
      id: row.grade_id,
      name: row.grade_name,
    },
    schedules: row.schedules,
    students: row.active_students,
    assignments: row.assignments,
  };
}

export function parseSession(row: any): Session {
  return {
    id: row.id,
    classId: row.class_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    classSummary: {
      id: row.class_id,
      name: row.class_name,
      teacherName: row.staff_name,
    },
  };
}

export function parseSessionDetail(row: any): SessionDetail {
  return {
    id: row.id,
    classId: row.class_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    classSummary: {
      id: row.class_id,
      name: row.class_name,
      teacherName: row.staff_name,
    },
    present: row.present,
    absent: row.absent,
  };
}

export function parseSchedule(row: any): Schedule {
  return {
    id: row.id,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
  };
}

export function parseAssignment(row: any): Assignment {
  return {
    id: row.id,
    name: row.assignment_name,
    description: row.description,
    className: row.class_name,
    dueDate: row.due_date,
    created: row.created,
  };
}

export function parseBilling(row: any): Billing {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    billingDate: row.billing_date,
    description: row.description,
    amount: row.amount,
    paymentMethod: row.payment_method,
    invoiceNumber: row.invoice_number,
    paid: row.paid,
    created: row.created,
  };
}

export function parseParent(row: any): Parent {
  return {
    personId: row.id,
    parentId: row.parent_id,
    name: row.name,
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    dateOfBirth: row.date_of_birth,
    notes: row.notes,
    active: row.active,
  };
}
