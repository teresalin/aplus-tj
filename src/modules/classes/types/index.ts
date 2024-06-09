import { Assignment } from "../../assignments/types";
import { Grade } from "../../grades";
import { Schedule } from "../../schedules";
import { StaffSummary } from "../../persons/staffs/types";
import { Student, StudentSummary } from "../../persons/students/types";

export interface Class {
  id: number;
  name: string;
  teacher: StaffSummary;
  grade: Grade;
  capacity: number;
  schedules: Schedule[];
  students?: StudentSummary[];
  assignments?: Assignment[];
}

export interface ClassSummary {
  id: number;
  name: string;
  teacherName?: string;
}

export interface ClassStudent {
  id: number;
  classId: number;
  studentId: number;
  startDate: Date;
  endDate?: Date;
  active: boolean;
}
