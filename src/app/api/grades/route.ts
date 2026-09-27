import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody } from "@/lib/api/request";
import { CreateGradeSchema } from "@/modules/grades";
import { gradeService } from "@/modules/grades/grade.service";

/**
 * POST /api/grades
 * Creates a new grade (admin only).
 */
export async function POST(req: NextRequest) {
  try {
    await authorize("admin");
    const data = await parseBody(req, CreateGradeSchema);
    const grade = await gradeService.create(data);
    return NextResponse.json(grade, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
