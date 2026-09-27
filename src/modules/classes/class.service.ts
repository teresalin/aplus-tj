import "server-only";
import type { Schedule as ScheduleRecord } from "@prisma/client";
import prisma from "@/lib/prisma";
import { dateToTimeOfDay, startOfUtcDay, timeOfDayToDate } from "@/lib/dates";
import { rethrowUniqueViolation } from "@/lib/errors/prisma-errors";
import type { Schedule } from "@/modules/schedules";
import {
  classDetailInclude,
  classListInclude,
  classOptionSelect,
  type ClassDetail,
  type ClassListItem,
} from "./types";
import type { CreateClassDTO, ScheduleInput, UpdateClassDTO } from "./schema";

const DUPLICATE_NAME = "A class with that name already exists.";

function withScheduleTimes<T extends { schedules: ScheduleRecord[] }>(
  record: T,
): Omit<T, "schedules"> & { schedules: Schedule[] } {
  return {
    ...record,
    schedules: record.schedules.map((schedule) => ({
      id: schedule.id,
      dayOfWeek: schedule.dayOfWeek,
      startTime: dateToTimeOfDay(schedule.startTime),
      endTime: dateToTimeOfDay(schedule.endTime),
    })),
  };
}

function toScheduleRows(schedules: ScheduleInput[]) {
  return schedules.map((schedule) => ({
    dayOfWeek: schedule.dayOfWeek,
    startTime: timeOfDayToDate(schedule.startTime),
    endTime: timeOfDayToDate(schedule.endTime),
  }));
}

export class ClassService {
  async getAll(): Promise<ClassListItem[]> {
    const classes = await prisma.class.findMany({
      where: { active: true },
      include: classListInclude(startOfUtcDay()),
      orderBy: { name: "asc" },
    });
    return classes.map(withScheduleTimes);
  }

  /** Lightweight id/name list for dropdowns and link lists. */
  async getOptions() {
    return await prisma.class.findMany({
      where: { active: true },
      select: classOptionSelect,
      orderBy: { name: "asc" },
    });
  }

  async getById(id: string): Promise<ClassDetail | null> {
    const record = await prisma.class.findFirst({
      where: { id, active: true },
      include: classDetailInclude(startOfUtcDay()),
    });
    return record ? withScheduleTimes(record) : null;
  }

  async create(data: CreateClassDTO): Promise<ClassListItem> {
    try {
      const record = await prisma.class.create({
        data: {
          name: data.name,
          gradeId: data.gradeId,
          teacherId: data.teacherId,
          capacity: data.capacity,
          schedules: { create: toScheduleRows(data.schedules) },
        },
        include: classListInclude(startOfUtcDay()),
      });
      return withScheduleTimes(record);
    } catch (error) {
      rethrowUniqueViolation(error, DUPLICATE_NAME);
    }
  }

  /** Replaces the class details and its weekly schedule in one atomic write. */
  async update(id: string, data: UpdateClassDTO): Promise<ClassListItem> {
    try {
      const record = await prisma.class.update({
        where: { id },
        data: {
          name: data.name,
          gradeId: data.gradeId,
          teacherId: data.teacherId,
          capacity: data.capacity,
          schedules: {
            deleteMany: {},
            create: toScheduleRows(data.schedules),
          },
        },
        include: classListInclude(startOfUtcDay()),
      });
      return withScheduleTimes(record);
    } catch (error) {
      rethrowUniqueViolation(error, DUPLICATE_NAME);
    }
  }
}

export const classService = new ClassService();
