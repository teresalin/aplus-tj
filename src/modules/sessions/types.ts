import type { Prisma, SessionStatus } from "@prisma/client";

// ========================================
// PRISMA INCLUDE CONFIGS
// ========================================
export const sessionInclude = {
  class: { select: { id: true, name: true } },
  teacher: { select: { id: true, person: { select: { name: true } } } },
} as const satisfies Prisma.SessionInclude;

/** The fields of a time change shown on the session page. */
export const timeChangeSelect = {
  previousStartTime: true,
  previousEndTime: true,
  newStartTime: true,
  newEndTime: true,
  reason: true,
  changedBy: true,
  changedAt: true,
} as const satisfies Prisma.SessionTimeChangeSelect;

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
export type SessionTimeChangeItem = Prisma.SessionTimeChangeGetPayload<{
  select: typeof timeChangeSelect;
}>;

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
  timeChanges: SessionTimeChangeItem[];
}
