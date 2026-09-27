import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody } from "@/lib/api/request";
import { CreateRoleSchema } from "@/modules/roles";
import { roleService } from "@/modules/roles/role.service";

/**
 * POST /api/persons/roles
 * Creates a new staff role (admin only).
 */
export async function POST(req: NextRequest) {
  try {
    await authorize("admin");
    const data = await parseBody(req, CreateRoleSchema);
    const role = await roleService.create(data);
    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
