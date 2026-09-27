import type { Prisma } from "@prisma/client";

export const gradeSelect = {
  id: true,
  name: true,
} as const satisfies Prisma.GradeSelect;

export type Grade = Prisma.GradeGetPayload<{ select: typeof gradeSelect }>;
