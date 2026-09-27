import type { Prisma } from "@prisma/client";

// ========================================
// PRISMA INCLUDE CONFIGS
// ========================================
export const parentIncludes = {
  /** Full parent with person data */
  full: {
    person: true,
  },

  /** Fields shown in the parents list */
  summary: {
    person: {
      select: {
        id: true,
        name: true,
        gender: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        active: true,
        createdAt: true,
      },
    },
  },
} as const satisfies Record<string, Prisma.ParentInclude>;

// ========================================
// DOMAIN TYPES
// ========================================
export type ParentSummary = Prisma.ParentGetPayload<{
  include: typeof parentIncludes.summary;
}>;
