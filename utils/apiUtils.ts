import { Assignment } from "../src/components/assignment/types";
import { Billing } from "../src/components/billing/types";
import { Class, ClassDetail } from "../src/components/class/types";
import { Parent } from "../pages/api/persons/parents";
import { Person } from "../pages/api/persons";
import { Schedule } from "../pages/api/classes/[class_id]/schedules";
import { Session, SessionDetail } from "../src/components/session/types";
import { Staff } from "../src/components/person/staff/types";
import { Student } from "../src/components/person/student/types";

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
    id: row.id,
    name: row.name,
    teacherId: row.teacher_id,
    gradeId: row.grade_id,
    capacity: row.capacity,
    active: row.active,
  };
}

export function parseClassDetail(row: any): ClassDetail {
  return {
    id: row.class_id,
    name: row.class_name,
    teacherId: row.teacher_id,
    gradeId: row.grade_id,
    capacity: row.capacity,
    active: row.active,
    teacher: {
      staffId: row.staff_id,
      name: row.staff_name,
    },
    grade: {
      id: row.grade_id,
      name: row.grade_name,
    },
    schedules: row.schedules,
    studentCount: row.student_count,
    activeStudents: row.active_students,
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
    classInfo: {
      id: row.class_id,
      name: row.class_name,
    },
    name: row.assignment_name,
    description: row.description,
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
