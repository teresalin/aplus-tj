import { ClassSummary } from "../../class/types";
import { StudentSummary } from "../../person/student/types";

export interface Session {
  id: number;
  classId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  classSummary?: ClassSummary;
}

export interface SessionDetail extends Session {
  present: StudentSummary[];
  absent: StudentSummary[];
}
