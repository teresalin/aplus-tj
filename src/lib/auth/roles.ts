export const ROLES = ["admin", "teacher", "user"] as const;
export type AppRole = (typeof ROLES)[number];

/** Roles that may use the staff-facing application at all. */
export const STAFF_ROLES: readonly AppRole[] = ["admin", "teacher"];

function parseAllowlist(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowed(email: string, allowlist: string[]): boolean {
  return allowlist.some((entry) =>
    entry.startsWith("@") ? email.endsWith(entry) : email === entry,
  );
}

/**
 * Roles come from deployment configuration rather than code:
 * `AUTH_ADMIN_EMAILS` and `AUTH_TEACHER_EMAILS` are comma-separated lists of
 * emails, or `@domain` entries that match a whole domain. Anyone else who signs
 * in gets the "user" role, which has no access to the application.
 */
export function resolveRole(email: string | null | undefined): AppRole {
  if (!email) return "user";
  const normalized = email.toLowerCase();
  if (isAllowed(normalized, parseAllowlist(process.env.AUTH_ADMIN_EMAILS))) {
    return "admin";
  }
  if (isAllowed(normalized, parseAllowlist(process.env.AUTH_TEACHER_EMAILS))) {
    return "teacher";
  }
  return "user";
}
