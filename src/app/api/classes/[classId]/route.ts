import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody, parseId } from "@/lib/api/request";
import { UpdateClassSchema } from "@/modules/classes";
import { classService } from "@/modules/classes/class.service";

type Params = { params: { classId: string } };

/**
 * PUT /api/classes/:classId
 * Replaces a class's details and weekly schedule (admin only).
 */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await authorize("admin");
    const classId = parseId(params.classId);
    const data = await parseBody(req, UpdateClassSchema);
    const updated = await classService.update(classId, data);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
