// src/lib/withRole.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export function withRole<
  H extends (
    req: NextRequest,
    session: NonNullable<Awaited<ReturnType<typeof getServerSession>>>,
  ) => Promise<NextResponse>,
>(
  requiredRole: "ADMIN" | "STAFF",
  handler: H,
): (req: NextRequest) => Promise<NextResponse> {
  return async (req) => {
    // 1. auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { status: "Error", message: "Not authenticated" },
        { status: 401 },
      );
    }

    // 2. role check
    if (requiredRole && session.user?.role !== requiredRole) {
      return NextResponse.json(
        { status: "Error", message: "Forbidden" },
        { status: 403 },
      );
    }

    // 3. delegate—let any errors bubble up to your centralized handler
    return handler(req, session);
  };
}
