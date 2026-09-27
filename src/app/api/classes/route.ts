import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody } from "@/lib/api/request";
import { CreateClassSchema } from "@/modules/classes";
import { classService } from "@/modules/classes/class.service";

/**
 * POST /api/classes
 * Creates a class with its weekly schedule (admin only).
 */
export async function POST(req: NextRequest) {
  try {
    await authorize("admin");
    const data = await parseBody(req, CreateClassSchema);
    const created = await classService.create(data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
