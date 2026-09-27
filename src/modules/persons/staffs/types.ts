import type { Prisma } from "@prisma/client";

// ========================================
// PRISMA INCLUDE CONFIGS
// ========================================
export const staffIncludes = {
  /** Full staff with person and role */
  full: {
    person: true,
    role: true,
  },

  /** Fields shown in the staff list */
  summary: {
    person: {
      select: {
        id: true,
        name: true,
        gender: true,
        phone: true,
        email: true,
        dateOfBirth: true,
        active: true,
        createdAt: true,
      },
    },
  },

  /** Staff with classes they teach */
  withClasses: {
    person: true,
    role: true,
    classes: {
      include: {
        grade: {
          select: { id: true, name: true },
        },
      },
    },
  },
} as const satisfies Record<string, Prisma.StaffInclude>;

// ========================================
// DOMAIN TYPES (Only export if used in multiple places)
// ========================================
export type Staff = Prisma.StaffGetPayload<{
  include: typeof staffIncludes.full;
}>;

export type StaffSummary = Prisma.StaffGetPayload<{
  include: typeof staffIncludes.summary;
}>;

export type StaffWithClasses = Prisma.StaffGetPayload<{
  include: typeof staffIncludes.withClasses;
}>;

/** Id/name pair for staff dropdowns (e.g. choosing a class teacher). */
export interface StaffOption {
  id: string;
  name: string;
}
