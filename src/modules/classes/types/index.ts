import { Assignment } from "../../assignments/types";
import { Grade } from "../../grades";
import { Schedule } from "../../../pages/api/classes/[class_id]/schedules";
import { StaffSummary } from "../../persons/staffs/types";
import { Student } from "../../persons/students/types";

export interface Class {
  id: number;
  name: string;
  teacherId: number;
  gradeId: number;
  capacity: number;
  active: boolean;
}

export interface ClassDetail extends Class {
  teacher: StaffSummary;
  grade: Grade;
  schedules: Schedule[];
  studentCount?: number;
  activeStudents?: Student[];
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
