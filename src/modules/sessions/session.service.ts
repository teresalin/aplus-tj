import "server-only";
import prisma from "@/lib/prisma";
import { HttpError, NotFoundError } from "@/lib/errors/custom-errors";
import { rethrowUniqueViolation } from "@/lib/errors/prisma-errors";
import {
  DEFAULT_SESSION_RANGE,
  sessionStartTimeFilter,
  type SessionRange,
} from "./constants";
import { sessionTimeChange } from "./time-change";
import { splitRosterByAttendance } from "./roster";
import { sessionInclude, timeChangeSelect, type SessionDetail } from "./types";
import type { CreateSessionDTO, UpdateSessionDTO } from "./schema";

const DUPLICATE_SESSION = "This class already has a session at that time.";

export class SessionService {
  async getAll(range: SessionRange = DEFAULT_SESSION_RANGE) {
    return await prisma.session.findMany({
      where: {
        class: { active: true },
        startTime: sessionStartTimeFilter(range),
      },
      include: sessionInclude,
      orderBy: { startTime: "desc" },
    });
  }

  /**
   * The session plus its class roster, split into present and absent
   * students, and its time changes. Nobody is absent from a cancelled session.
   */
  async getDetail(id: string): Promise<SessionDetail | null> {
    const studentSelect = {
      select: { id: true, person: { select: { name: true } } },
    } as const;

    const session = await prisma.session.findFirst({
      where: { id, class: { active: true } },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            classStudents: {
              select: {
                startDate: true,
                endDate: true,
                student: studentSelect,
              },
            },
          },
        },
        teacher: { select: { id: true, person: { select: { name: true } } } },
        attendances: { select: { student: studentSelect } },
        timeChanges: {
          select: timeChangeSelect,
          orderBy: { changedAt: "desc" },
        },
      },
    });
    if (!session) return null;

    const { present, absent } = splitRosterByAttendance(
      session.startTime,
      session.class.classStudents,
      session.attendances.map((attendance) => attendance.student),
    );

    return {
      id: session.id,
      startTime: session.startTime,
      endTime: session.endTime,
      status: session.status,
      cancellationReason: session.cancellationReason,
      class: { id: session.class.id, name: session.class.name },
      teacher: { id: session.teacher.id, name: session.teacher.person.name },
      present,
      absent: session.status === "Cancelled" ? [] : absent,
      timeChanges: session.timeChanges,
    };
  }

  /** Schedules a session, taught by the class's teacher unless another teacher is given. */
  async create(data: CreateSessionDTO) {
    let teacherId = data.teacherId;
    if (!teacherId) {
      const cls = await prisma.class.findUnique({
        where: { id: data.classId },
        select: { teacherId: true },
      });
      if (!cls) throw new NotFoundError("Class not found");
      teacherId = cls.teacherId;
    }

    try {
      return await prisma.session.create({
        data: {
          classId: data.classId,
          teacherId,
          startTime: data.startTime,
          endTime: data.endTime,
        },
        include: sessionInclude,
      });
    } catch (error) {
      rethrowUniqueViolation(error, DUPLICATE_SESSION);
    }
  }

  /**
   * Replaces the session's teacher, times, and status. A change of time is
   * recorded in the session's history, by `changedBy`, in the same transaction.
   */
  async update(id: string, data: UpdateSessionDTO, changedBy: string | null) {
    try {
      return await prisma.$transaction(async (tx) => {
        const current = await tx.session.findUnique({
          where: { id },
          select: { startTime: true, endTime: true },
        });
        if (!current) throw new NotFoundError("Session not found");

        const timeChange = sessionTimeChange(current, data);
        return await tx.session.update({
          where: { id },
          data: {
            teacherId: data.teacherId,
            startTime: data.startTime,
            endTime: data.endTime,
            status: data.status,
            cancellationReason:
              data.status === "Cancelled"
                ? (data.cancellationReason ?? null)
                : null,
            ...(timeChange && {
              timeChanges: {
                create: { ...timeChange, reason: data.changeReason, changedBy },
              },
            }),
          },
          include: sessionInclude,
        });
      });
    } catch (error) {
      rethrowUniqueViolation(error, DUPLICATE_SESSION);
    }
  }

  /**
   * Permanently deletes a session created by mistake, together with its time
   * changes. A session with attendance is kept: cancel it instead.
   */
  async delete(id: string): Promise<void> {
    const attendanceCount = await prisma.attendance.count({
      where: { sessionId: id },
    });
    if (attendanceCount > 0) {
      throw new HttpError(
        409,
        "This session has attendance records, so it can't be deleted. Cancel it instead.",
      );
    }

    await prisma.$transaction([
      prisma.sessionTimeChange.deleteMany({ where: { sessionId: id } }),
      prisma.session.delete({ where: { id } }),
    ]);
  }
}

export const sessionService = new SessionService();
