import type { ClassOption } from "@/modules/classes";

export type AttendanceStatus = "Present" | "Absent";

export interface AttendanceRow {
  /** Student id */
  id: string;
  name: string;
  /** Keyed by session date ("YYYY-MM-DD"); days without a session are absent from the map. */
  attendance: Record<string, AttendanceStatus>;
}

export interface WeeklyAttendance {
  class: ClassOption;
  /** The seven days of the week (Sunday first), as "YYYY-MM-DD". */
  dates: string[];
  rows: AttendanceRow[];
}
