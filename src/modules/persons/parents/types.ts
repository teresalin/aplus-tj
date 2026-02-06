import type { Prisma } from "@prisma/client";

// ========================================
// PRISMA INCLUDE CONFIGS
// ========================================
export const parentIncludes = {
  /** Full parent with person data */
  full: {
    person: true,
  },

  /** Lightweight summary for lists/dropdowns */
  summary: {
    person: {
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    },
  },
} as const satisfies Record<string, Prisma.ParentInclude>;
