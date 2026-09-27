import "server-only";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import { STAFF_ROLES, type AppRole } from "@/lib/auth/roles";
import { HttpError } from "@/lib/errors/custom-errors";

export function getSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

function hasRole(session: Session, allowed: readonly AppRole[]): boolean {
  return allowed.includes(session.user?.role ?? "user");
}

/**
 * For route handlers: resolves the session or throws an HttpError
 * (401 when signed out, 403 when the role is not allowed).
 */
export async function authorize(
  allowed: AppRole | readonly AppRole[] = STAFF_ROLES,
) {
  const session = await getSession();
  if (!session) throw new HttpError(401, "Unauthorized");
  if (!hasRole(session, typeof allowed === "string" ? [allowed] : allowed)) {
    throw new HttpError(403, "Forbidden");
  }
  return { session, role: session.user.role };
}

/**
 * For pages: resolves the session or redirects (to sign-in when signed out,
 * to /no-access when the role is not allowed). Middleware performs the same
 * check up front; this keeps each page safe on its own.
 */
export async function requirePageAccess(
  allowed: readonly AppRole[] = STAFF_ROLES,
): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/api/auth/signin");
  if (!hasRole(session, allowed)) redirect("/no-access");
  return session;
}
