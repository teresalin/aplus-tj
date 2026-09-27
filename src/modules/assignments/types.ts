import type { Prisma } from "@prisma/client";
import type { ClassOption } from "@/modules/classes";

// ========================================
// PRISMA INCLUDE CONFIGS
// ========================================
export const assignmentInclude = {
  // The app links each assignment to exactly one class.
  classAssignments: {
    select: { class: { select: { id: true, name: true } } },
    take: 1,
  },
} as const satisfies Prisma.AssignmentInclude;

export type AssignmentRecord = Prisma.AssignmentGetPayload<{
  include: typeof assignmentInclude;
}>;

// ========================================
// DOMAIN TYPES
// ========================================
export type Assignment = Omit<AssignmentRecord, "classAssignments"> & {
  class: ClassOption | null;
};
