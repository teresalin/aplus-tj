import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody, parseId } from "@/lib/api/request";
import { UpdateSessionSchema } from "@/modules/sessions";
import { sessionService } from "@/modules/sessions/session.service";

type Params = { params: { sessionId: string } };

/**
 * PUT /api/sessions/:sessionId
 * Replaces a session's teacher, times, and status (admin only). Time changes
 * are recorded in the session's history under the signed-in user's email.
 */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { session: auth } = await authorize("admin");
    const sessionId = parseId(params.sessionId);
    const data = await parseBody(req, UpdateSessionSchema);
    const session = await sessionService.update(
      sessionId,
      data,
      auth.user.email ?? null,
    );
    return NextResponse.json(session);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/sessions/:sessionId
 * Permanently deletes a session without attendance (admin only). A session
 * with attendance returns 409 and must be cancelled instead.
 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await authorize("admin");
    const sessionId = parseId(params.sessionId);
    await sessionService.delete(sessionId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
