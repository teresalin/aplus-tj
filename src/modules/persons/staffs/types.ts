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

  /** Lightweight summary for lists/dropdowns */
  summary: {
    person: {
      select: {
        id: true,
        name: true,
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
export type StaffWithClasses = Prisma.StaffGetPayload<{
  include: typeof staffIncludes.withClasses;
}>;
