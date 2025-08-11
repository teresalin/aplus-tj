import "server-only";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export const ROLES = ["admin", "teacher", "user"] as const;
export type AppRole = (typeof ROLES)[number];

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function requireSession(): Promise<Session> {
  const session = await getServerSession(authOptions);
  if (!session) throw new HttpError(401, "Unauthorized");
  return session;
}

export function getRole(session: Session): AppRole {
  return ((session.user as any)?.role ?? "user") as AppRole;
}

export function hasRole(
  session: Session,
  allowed: AppRole | AppRole[],
): boolean {
  const allow = Array.isArray(allowed) ? allowed : [allowed];
  return allow.includes(getRole(session));
}

export function requireRole(session: Session, allowed: AppRole | AppRole[]) {
  if (!hasRole(session, allowed)) throw new HttpError(403, "Forbidden");
}

/** One-call helper used in handlers: */
export async function authorize(allowed?: AppRole | AppRole[]) {
  const session = await requireSession();
  if (allowed) requireRole(session, allowed);
  return { session, role: getRole(session) };
}
