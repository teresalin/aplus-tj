import type { Prisma } from "@prisma/client";

export const ASSIGNMENT_FILTERS = ["all", "upcoming", "past due"] as const;

export type AssignmentFilter = (typeof ASSIGNMENT_FILTERS)[number];

/**
 * Normalize a raw query-param into a legit AssignmentFilter.
 * Defaults to "all" if nothing matches.
 */
export function parseAssignmentFilter(
  raw?: string | string[],
): AssignmentFilter {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  return ASSIGNMENT_FILTERS.includes(candidate as AssignmentFilter)
    ? (candidate as AssignmentFilter)
    : "all";
}

/** The due-date condition for a filter (`undefined` = no condition). */
export function dueDateFilter(
  filter: AssignmentFilter,
  now: Date = new Date(),
): Prisma.DateTimeNullableFilter | undefined {
  switch (filter) {
    case "upcoming":
      return { gt: now };
    case "past due":
      return { lte: now };
    case "all":
      return undefined;
  }
}
