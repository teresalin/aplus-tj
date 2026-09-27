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
