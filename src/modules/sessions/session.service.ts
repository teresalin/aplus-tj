import "server-only";
import prisma from "@/lib/prisma";
import { rethrowUniqueViolation } from "@/lib/errors/prisma-errors";
import {
  DEFAULT_SESSION_RANGE,
  sessionStartTimeFilter,
  type SessionRange,
} from "./constants";
import { splitRosterByAttendance } from "./roster";
import { sessionInclude, type SessionDetail } from "./types";
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

  /** The session plus its class roster, split into present and absent students. */
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
            teacher: { select: { person: { select: { name: true } } } },
            classStudents: {
              select: {
                startDate: true,
                endDate: true,
                student: studentSelect,
              },
            },
          },
        },
        attendances: { select: { student: studentSelect } },
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
      class: {
        id: session.class.id,
        name: session.class.name,
        teacherName: session.class.teacher.person.name,
      },
      present,
      absent,
    };
  }

  async create(data: CreateSessionDTO) {
    try {
      return await prisma.session.create({
        data: {
          classId: data.classId,
          startTime: data.startTime,
          endTime: data.endTime,
        },
        include: sessionInclude,
      });
    } catch (error) {
      rethrowUniqueViolation(error, DUPLICATE_SESSION);
    }
  }

  async update(id: string, data: UpdateSessionDTO) {
    try {
      return await prisma.session.update({
        where: { id },
        data: {
          classId: data.classId,
          startTime: data.startTime,
          endTime: data.endTime,
        },
        include: sessionInclude,
      });
    } catch (error) {
      rethrowUniqueViolation(error, DUPLICATE_SESSION);
    }
  }

  /** Permanently deletes the session together with its attendance and reschedule history. */
  async delete(id: string): Promise<void> {
    await prisma.$transaction([
      prisma.attendance.deleteMany({ where: { sessionId: id } }),
      prisma.sessionDateHistory.deleteMany({ where: { sessionId: id } }),
      prisma.session.delete({ where: { id } }),
    ]);
  }
}

export const sessionService = new SessionService();
