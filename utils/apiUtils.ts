import { Assignment } from "../pages/api/assignments";
import { Billing } from "../pages/api/billing";
import { Class } from "../pages/api/classes";
import { Parent } from "../pages/api/persons/parents";
import { Person } from "../pages/api/persons";
import { Schedule } from "../pages/api/classes/[class_id]/schedules";
import { Staff } from "../pages/api/persons/staffs";
import { Student } from "../pages/api/persons/students";

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
    classInfo: {
      id: row.class_id,
      name: row.class_name,
    },
    name: row.assignment_name,
    description: row.description,
    dueDate: row.due_date,
    created: row.time_created,
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
    created: row.time_created,
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
