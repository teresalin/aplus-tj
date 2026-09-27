import { startOfUtcDay } from "@/lib/dates";
import type { SessionStudent } from "./types";

interface RosterStudent {
  id: string;
  person: { name: string };
}

interface Enrollment {
  startDate: Date;
  endDate: Date | null;
  student: RosterStudent;
}

const toSessionStudent = (student: RosterStudent): SessionStudent => ({
  id: student.id,
  name: student.person.name,
});

/**
 * Splits a class roster for one session: students with an attendance record
 * are present; students enrolled on the session's date without one are absent.
 * Enrollment end dates are inclusive.
 */
export function splitRosterByAttendance(
  sessionStart: Date,
  enrollments: Enrollment[],
  attendees: RosterStudent[],
): { present: SessionStudent[]; absent: SessionStudent[] } {
  const present = attendees.map(toSessionStudent);
  const presentIds = new Set(present.map((student) => student.id));
  const sessionDay = startOfUtcDay(sessionStart);

  const absent = enrollments
    .filter(
      (enrollment) =>
        enrollment.startDate <= sessionStart &&
        (!enrollment.endDate || enrollment.endDate >= sessionDay) &&
        !presentIds.has(enrollment.student.id),
    )
    .map((enrollment) => toSessionStudent(enrollment.student));

  return { present, absent };
}
