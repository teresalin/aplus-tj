import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Prisma } from "@prisma/client";

dayjs.extend(utc);

export const SESSION_RANGES = [
  "last7Days",
  "thisMonth",
  "yearToDate",
  "all",
] as const;

export type SessionRange = (typeof SESSION_RANGES)[number];

export const DEFAULT_SESSION_RANGE: SessionRange = "thisMonth";

/** Normalizes a raw `?range=` search param, falling back to the default. */
export function parseSessionRange(raw?: string | string[]): SessionRange {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  return SESSION_RANGES.includes(candidate as SessionRange)
    ? (candidate as SessionRange)
    : DEFAULT_SESSION_RANGE;
}

/** The session start-time window for a range, in UTC (`undefined` = no limit). */
export function sessionStartTimeFilter(
  range: SessionRange,
  now: Date = new Date(),
): Prisma.DateTimeFilter | undefined {
  const today = dayjs.utc(now);
  switch (range) {
    case "last7Days":
      return { gte: today.subtract(7, "day").toDate(), lt: now };
    case "thisMonth":
      return {
        gte: today.startOf("month").toDate(),
        lt: today.startOf("month").add(1, "month").toDate(),
      };
    case "yearToDate":
      return { gte: today.startOf("year").toDate() };
    case "all":
      return undefined;
  }
}
