import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody } from "@/lib/api/request";
import { CreateSessionSchema } from "@/modules/sessions";
import { sessionService } from "@/modules/sessions/session.service";

/**
 * POST /api/sessions
 * Schedules a new class session (admin only).
 */
export async function POST(req: NextRequest) {
  try {
    await authorize("admin");
    const data = await parseBody(req, CreateSessionSchema);
    const session = await sessionService.create(data);
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
