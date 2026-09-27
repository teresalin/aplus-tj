import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody } from "@/lib/api/request";
import { CreateAssignmentSchema } from "@/modules/assignments";
import { assignmentService } from "@/modules/assignments/assignment.service";

/**
 * POST /api/assignments
 * Creates an assignment for a class (admin only).
 */
export async function POST(req: NextRequest) {
  try {
    await authorize("admin");
    const data = await parseBody(req, CreateAssignmentSchema);
    const assignment = await assignmentService.create(data);
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
