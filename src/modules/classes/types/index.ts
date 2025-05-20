import { Assignment } from "../../assignments/types";
import { Grade } from "../../grades";
import { Schedule } from "../../schedules";
import { StaffSummary } from "../../persons/staffs/types";
import { StudentSummary } from "../../persons/students/types";

export interface Class {
  id: string;
  name: string;
  teacher: StaffSummary;
  grade: Grade;
  capacity: number;
  schedules: Schedule[];
  students?: StudentSummary[];
  assignments?: Assignment[];
}

export interface ClassSummary {
  id: string;
  name: string;
}

export interface ClassStudent {
  id: string;
  classId: string;
  studentId: string;
  startDate: Date;
  endDate?: Date;
  active: boolean;
}
