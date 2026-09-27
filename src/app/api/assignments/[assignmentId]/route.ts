import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody, parseId } from "@/lib/api/request";
import { UpdateAssignmentSchema } from "@/modules/assignments";
import { assignmentService } from "@/modules/assignments/assignment.service";

type Params = { params: { assignmentId: string } };

/**
 * PUT /api/assignments/:assignmentId
 * Replaces an assignment's details and class (admin only).
 */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await authorize("admin");
    const assignmentId = parseId(params.assignmentId);
    const data = await parseBody(req, UpdateAssignmentSchema);
    const assignment = await assignmentService.update(assignmentId, data);
    return NextResponse.json(assignment);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/assignments/:assignmentId
 * Permanently deletes an assignment (admin only).
 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await authorize("admin");
    const assignmentId = parseId(params.assignmentId);
    await assignmentService.delete(assignmentId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
