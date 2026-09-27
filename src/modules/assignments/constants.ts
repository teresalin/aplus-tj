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
