import "server-only";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { startOfUtcDay } from "@/lib/dates";
import { rethrowUniqueViolation } from "@/lib/errors/prisma-errors";
import { DEFAULT_SESSION_RANGE, type SessionRange } from "./constants";
import {
  sessionInclude,
  type SessionDetail,
  type SessionStudent,
} from "./types";
import type { CreateSessionDTO, UpdateSessionDTO } from "./schema";

dayjs.extend(utc);

const DUPLICATE_SESSION = "This class already has a session at that time.";

function startTimeFilter(
  range: SessionRange,
  now = new Date(),
): Prisma.DateTimeFilter | undefined {
  const today = dayjs.utc(now);
  switch (range) {
    case "last7Days":
      return { gte: today.subtract(7, "day").toDate(), lt: now };
    case "thisMonth":
      return {
        gte: today.startOf("month").toDate(),
        lt: today.startOf("month").add(1, "month").toDate(),
      };
    case "yearToDate":
      return { gte: today.startOf("year").toDate() };
    case "all":
      return undefined;
  }
}

function toSessionStudent(student: {
  id: string;
  person: { name: string };
}): SessionStudent {
  return { id: student.id, name: student.person.name };
}

export class SessionService {
  async getAll(range: SessionRange = DEFAULT_SESSION_RANGE) {
    return await prisma.session.findMany({
      where: { class: { active: true }, startTime: startTimeFilter(range) },
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

    const present = session.attendances.map((a) => toSessionStudent(a.student));
    const presentIds = new Set(present.map((student) => student.id));
    const sessionDay = startOfUtcDay(session.startTime);
    const absent = session.class.classStudents
      .filter(
        (enrollment) =>
          enrollment.startDate <= session.startTime &&
          (!enrollment.endDate || enrollment.endDate >= sessionDay) &&
          !presentIds.has(enrollment.student.id),
      )
      .map((enrollment) => toSessionStudent(enrollment.student));

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
