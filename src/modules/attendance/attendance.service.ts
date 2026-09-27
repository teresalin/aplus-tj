import "server-only";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/dates";
import { activeEnrollmentWhere } from "@/modules/classes";
import type { AttendanceRow, WeeklyAttendance } from "./types";

dayjs.extend(utc);

export class AttendanceService {
  /**
   * Attendance for every student enrolled in the class during the week that
   * starts on `weekStart`, across that week's sessions.
   */
  async getWeek(
    classId: string,
    weekStart: Date,
  ): Promise<WeeklyAttendance | null> {
    const weekEnd = dayjs.utc(weekStart).add(7, "day").toDate();

    const cls = await prisma.class.findFirst({
      where: { id: classId, active: true },
      select: {
        id: true,
        name: true,
        classStudents: {
          where: {
            startDate: { lt: weekEnd },
            ...activeEnrollmentWhere(weekStart),
          },
          select: {
            student: {
              select: { id: true, person: { select: { name: true } } },
            },
          },
          orderBy: { student: { person: { name: "asc" } } },
        },
        sessions: {
          where: { startTime: { gte: weekStart, lt: weekEnd } },
          select: {
            startTime: true,
            attendances: { select: { studentId: true } },
          },
          orderBy: { startTime: "asc" },
        },
      },
    });
    if (!cls) return null;

    const rows = new Map<string, AttendanceRow>();
    for (const { student } of cls.classStudents) {
      if (rows.has(student.id)) continue;
      const attendance: AttendanceRow["attendance"] = {};
      for (const session of cls.sessions) {
        const attended = session.attendances.some(
          (a) => a.studentId === student.id,
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

    return {
      class: { id: cls.id, name: cls.name },
      dates: Array.from({ length: 7 }, (_, i) =>
        dayjs.utc(weekStart).add(i, "day").format("YYYY-MM-DD"),
      ),
      rows: Array.from(rows.values()),
    };
  }
}

export const attendanceService = new AttendanceService();
