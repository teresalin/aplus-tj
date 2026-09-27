import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody } from "@/lib/api/request";
import { CreateStaffSchema } from "@/modules/persons/staffs";
import { staffService } from "@/modules/persons/staffs/staff.service";

/**
 * POST /api/persons/staffs
 * Creates a new staff member (admin only).
 */
export async function POST(req: NextRequest) {
  try {
    await authorize("admin");
    const data = await parseBody(req, CreateStaffSchema);
    const staff = await staffService.create(data);
    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
