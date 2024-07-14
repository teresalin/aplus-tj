import { Assignment } from "../assignments";
import { Class } from "./types";
import { Grade } from "../grades";
import { Schedule } from "../schedules";
import { StaffSummary } from "../persons/staffs";
import { StudentSummary } from "../persons/students";

export function mapRowToClass(row: any): Class {
  return {
    id: row.class_id,
    name: row.class_name,
    teacher: { staffId: row.staff_id, name: row.staff_name } as StaffSummary,
    grade: { id: row.grade_id, name: row.grade_name } as Grade,
    capacity: row.capacity,
    schedules: (row.schedules || []).map((schedule: any) => ({
      id: schedule.id,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    })) as Schedule[],
    students: (row.students || []).map((student: any) => ({
      studentId: student.studentId,
      name: student.name,
      englishName: student.englishName,
      dateOfBirth: student.dateOfBirth,
      currentSchool: student.currentSchool,
      notes: student.notes,
    })) as StudentSummary[],
    assignments: (row.assignments || []).map((assignment: any) => ({
      id: assignment.id,
      name: assignment.name,
      description: assignment.description,
      dueDate: assignment.dueDate,
      created: assignment.created,
    })) as Assignment[],
  };
}
