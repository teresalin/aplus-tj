import type { Prisma, Status } from "@prisma/client";

// ========================================
// PRISMA INCLUDE CONFIGS
// ========================================
export const sessionInclude = {
  class: { select: { id: true, name: true } },
} as const satisfies Prisma.SessionInclude;

// ========================================
// DOMAIN TYPES
// ========================================
export type Session = Prisma.SessionGetPayload<{
  include: typeof sessionInclude;
}>;

export interface SessionStudent {
  id: string;
  name: string;
}

/** A session with the class roster split by attendance. */
export interface SessionDetail {
  id: string;
  startTime: Date;
  endTime: Date;
  status: Status;
  class: { id: string; name: string; teacherName: string };
  present: SessionStudent[];
  absent: SessionStudent[];
}
