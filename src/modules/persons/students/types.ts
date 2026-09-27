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

  /** Fields shown in the students list */
  summary: {
    person: {
      select: {
        id: true,
        name: true,
        preferredName: true,
        gender: true,
        phone: true,
        email: true,
        dateOfBirth: true,
        active: true,
        notes: true,
        createdAt: true,
      },
    },
  },
} as const satisfies Record<string, Prisma.StudentInclude>;

export const enrollmentInclude = {
  class: { select: { id: true, name: true } },
} as const satisfies Prisma.ClassStudentInclude;

// ========================================
// DOMAIN TYPES (Generated from Prisma)
// ========================================
export type Student = Prisma.StudentGetPayload<{
  include: typeof studentIncludes.full;
}>;

export type StudentSummary = Prisma.StudentGetPayload<{
  include: typeof studentIncludes.summary;
}>;

/** A student's enrollment in a class, past or current. */
export type StudentEnrollment = Prisma.ClassStudentGetPayload<{
  include: typeof enrollmentInclude;
}>;
