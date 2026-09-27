import type { Prisma } from "@prisma/client";
import type { Schedule } from "@/modules/schedules";

// ========================================
// PRISMA QUERY CONFIGS
// ========================================
export const classOptionSelect = {
  id: true,
  name: true,
} as const satisfies Prisma.ClassSelect;

const classBaseInclude = {
  grade: { select: { id: true, name: true } },
  teacher: { select: { id: true, person: { select: { name: true } } } },
  schedules: { orderBy: { dayOfWeek: "asc" as const } },
} as const satisfies Prisma.ClassInclude;

/** Enrollments that have not ended as of `date`. */
export function activeEnrollmentWhere(
  date: Date,
): Prisma.ClassStudentWhereInput {
  return { OR: [{ endDate: null }, { endDate: { gte: date } }] };
}

export function classListInclude(today: Date) {
  return {
    ...classBaseInclude,
    _count: {
      select: { classStudents: { where: activeEnrollmentWhere(today) } },
    },
  } satisfies Prisma.ClassInclude;
}

export function classDetailInclude(today: Date) {
  return {
    ...classBaseInclude,
    classStudents: {
      where: activeEnrollmentWhere(today),
      orderBy: { startDate: "asc" as const },
      select: {
        id: true,
        startDate: true,
        student: {
          select: {
            id: true,
            currentSchool: true,
            textbookPublisher: true,
            person: { select: { name: true, preferredName: true } },
          },
        },
      },
    },
    classAssignments: {
      where: { assignment: { dueDate: { gte: today } } },
      orderBy: { assignment: { dueDate: "asc" as const } },
      take: 3,
      select: {
        assignment: {
          select: { id: true, name: true, description: true, dueDate: true },
        },
      },
    },
  } satisfies Prisma.ClassInclude;
}

// ========================================
// DOMAIN TYPES
// ========================================
/** Schedule times are exposed as "HH:mm:ss" strings rather than Prisma's TIME Dates. */
type WithScheduleTimes<T> = Omit<T, "schedules"> & { schedules: Schedule[] };

export type ClassOption = Prisma.ClassGetPayload<{
  select: typeof classOptionSelect;
}>;

export type ClassListItem = WithScheduleTimes<
  Prisma.ClassGetPayload<{ include: ReturnType<typeof classListInclude> }>
>;

export type ClassDetail = WithScheduleTimes<
  Prisma.ClassGetPayload<{ include: ReturnType<typeof classDetailInclude> }>
>;
