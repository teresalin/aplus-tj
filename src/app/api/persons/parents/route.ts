import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody } from "@/lib/api/request";
import { CreateParentSchema } from "@/modules/persons/parents";
import { parentService } from "@/modules/persons/parents/parent.service";

/**
 * POST /api/persons/parents
 * Creates a new parent (admin only).
 */
export async function POST(req: NextRequest) {
  try {
    await authorize("admin");
    const data = await parseBody(req, CreateParentSchema);
    const parent = await parentService.create(data);
    return NextResponse.json(parent, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
