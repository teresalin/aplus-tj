import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody, parseId } from "@/lib/api/request";
import { NotFoundError } from "@/lib/errors/custom-errors";
import { UpdateStaffSchema } from "@/modules/persons/staffs";
import { staffService } from "@/modules/persons/staffs/staff.service";

type Params = { params: { staffId: string } };

/**
 * PATCH /api/persons/staffs/:staffId
 * Partially updates a staff member (admin only).
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authorize("admin");
    const staffId = parseId(params.staffId);
    const data = await parseBody(req, UpdateStaffSchema);
    const staff = await staffService.update(staffId, data);
    if (!staff) throw new NotFoundError("Staff not found");
    return NextResponse.json(staff);
  } catch (error) {
    return handleApiError(error);
  }
}
