import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { STAFF_ROLES } from "@/lib/auth/roles";

/**
 * Coarse gate for the whole app: every matched route requires a signed-in
 * staff member. Route handlers and pages still check roles themselves.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const signInUrl = new URL("/api/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  if (!STAFF_ROLES.includes(token.role ?? "user")) {
    return isApi
      ? NextResponse.json({ error: "Forbidden" }, { status: 403 })
      : NextResponse.redirect(new URL("/no-access", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Everything except the public landing page ("/"), NextAuth's own endpoints,
  // the no-access page, and static assets.
  matcher: [
    "/((?!api/auth|no-access|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|ico)$).+)",
  ],
};
