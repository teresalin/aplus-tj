import type { Prisma } from "@prisma/client";

// ========================================
// PRISMA INCLUDE CONFIGS
// ========================================
export const studentIncludes = {
  /** Full student with person and grade */
  full: {
    person: true,
    grade: { select: { id: true, name: true } },
  },

  /** Lightweight summary for lists/dropdowns */
  summary: {
    person: {
      select: {
        id: true,
        name: true,
        preferredName: true,
        notes: true,
      },
    },
  },

  /** Student with enrollment and attendance data */
  withEnrollment: {
    person: true,
    grade: { select: { id: true, name: true } },
    attendances: {
      include: {
        session: {
          include: {
            class: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc" as const,
      },
      take: 50, // Limit for performance
    },
    classStudents: {
      include: {
        class: {
          select: {
            id: true,
            name: true,
            teacher: {
              include: {
                person: { select: { name: true } },
              },
            },
          },
        },
      },
      where: {
        endDate: null, // Only active enrollments
      },
    },
  },
} as const satisfies Record<string, Prisma.StudentInclude>;

// ========================================
// DOMAIN TYPES (Generated from Prisma)
// ========================================
export type Student = Prisma.StudentGetPayload<{
  include: typeof studentIncludes.full;
}>;

export type StudentSummary = Prisma.StudentGetPayload<{
  include: typeof studentIncludes.summary;
}>;

export type StudentWithEnrollment = Prisma.StudentGetPayload<{
  include: typeof studentIncludes.withEnrollment;
}>;
