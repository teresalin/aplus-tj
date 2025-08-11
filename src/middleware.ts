import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const isApi = pathname.startsWith("/api");

  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 1) Must be logged in
  if (!token) {
    return isApi
      ? NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", req.url));
  }

  // 2) Coarse RBAC by path (example)
  // Align these with your real roles & paths
  if (pathname.startsWith("/api/admin") && token.role !== "admin") {
    return isApi
      ? NextResponse.json({ message: "Forbidden" }, { status: 403 })
      : NextResponse.redirect(new URL("/no-access", req.url));
  }

  if (
    pathname.startsWith("/api/teacher") &&
    !["admin", "teacher"].includes(String(token.role))
  ) {
    return isApi
      ? NextResponse.json({ message: "Forbidden" }, { status: 403 })
      : NextResponse.redirect(new URL("/no-access", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*", // protect all API routes
    "/admin/:path*", // protect admin pages
    "/edit/:path*", // protect editor pages (if you keep this)
  ],
};
