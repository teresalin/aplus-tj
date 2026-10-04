import "server-only";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import prisma from "@/lib/prisma";
import { activeEnrollmentWhere } from "@/modules/classes";
import { buildAttendanceRows } from "./rows";
import type { WeeklyAttendance } from "./types";
import { weekDates } from "./week";

dayjs.extend(utc);

export class AttendanceService {
  /**
   * Attendance for every student enrolled in the class during the week that
   * starts on `weekStart`, across that week's sessions. Cancelled sessions
   * are left out, so nobody shows as absent from them.
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
          where: {
            startTime: { gte: weekStart, lt: weekEnd },
            status: "Scheduled",
          },
          select: {
            startTime: true,
            attendances: { select: { studentId: true } },
          },
          orderBy: { startTime: "asc" },
        },
      },
    });
    if (!cls) return null;

    return {
      class: { id: cls.id, name: cls.name },
      dates: weekDates(weekStart),
      rows: buildAttendanceRows(
        cls.classStudents.map(({ student }) => student),
        cls.sessions,
      ),
    };
  }
}

export const attendanceService = new AttendanceService();
