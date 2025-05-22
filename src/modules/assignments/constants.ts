export const ASSIGNMENT_FILTERS = ["all", "upcoming", "past due"] as const;

export type AssignmentFilter = (typeof ASSIGNMENT_FILTERS)[number];
