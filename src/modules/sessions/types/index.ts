import { ClassSummary } from "../../classes/types";
import { StudentSummary } from "../../persons/students/types";

export interface Session {
  id: number;
  class: ClassSummary;
  startTime: string;
  endTime: string;
}

export interface SessionDetail extends Session {
  present: StudentSummary[];
  absent: StudentSummary[];
}
