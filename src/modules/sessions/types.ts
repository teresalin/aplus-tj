import type { Prisma, SessionStatus } from "@prisma/client";

// ========================================
// PRISMA INCLUDE CONFIGS
// ========================================
export const sessionInclude = {
  class: { select: { id: true, name: true } },
  teacher: { select: { id: true, person: { select: { name: true } } } },
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

/** One recorded change to a session's time. */
export interface SessionTimeChange {
  previousStartTime: Date;
  previousEndTime: Date;
  newStartTime: Date;
  newEndTime: Date;
  reason: string | null;
  changedBy: string | null;
  changedAt: Date;
}

/** A session with the class roster split by attendance, and its time changes (newest first). */
export interface SessionDetail {
  id: string;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  cancellationReason: string | null;
  class: { id: string; name: string };
  teacher: { id: string; name: string };
  present: SessionStudent[];
  absent: SessionStudent[];
  timeChanges: SessionTimeChange[];
}
