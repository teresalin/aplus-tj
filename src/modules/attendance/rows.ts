import { formatDate } from "@/lib/dates";
import type { AttendanceRow } from "./types";

interface EnrolledStudent {
  id: string;
  person: { name: string };
}

interface WeekSession {
  startTime: Date;
  attendances: { studentId: string }[];
}

/**
 * One grid row per enrolled student, marking each of the week's sessions
 * (keyed by UTC date) as Present or Absent. A student enrolled more than once
 * appears once.
 */
export function buildAttendanceRows(
  students: EnrolledStudent[],
  sessions: WeekSession[],
): AttendanceRow[] {
  const rows = new Map<string, AttendanceRow>();

  for (const student of students) {
    if (rows.has(student.id)) continue;

    const attendance: AttendanceRow["attendance"] = {};
    for (const session of sessions) {
      const attended = session.attendances.some(
        (record) => record.studentId === student.id,
      );
      attendance[formatDate(session.startTime)] = attended
        ? "Present"
        : "Absent";
    }

    rows.set(student.id, {
      id: student.id,
      name: student.person.name,
      attendance,
    });
  }

  return Array.from(rows.values());
}
