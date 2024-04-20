import { Assignment } from "../../assignment/types";
import { Grade } from "../../../../pages/api/grades";
import { Person } from "../../../../pages/api/persons";
import { Schedule } from "../../../../pages/api/classes/[class_id]/schedules";
import { StaffSummary } from "../../person/staff/types";

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
  activeStudents?: Person[];
  assignments?: Assignment[];
}

export interface ClassSummary {
  id: number;
  name: string;
  teacherName: string;
}
