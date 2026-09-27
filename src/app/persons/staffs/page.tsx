import type { Metadata } from "next";

import { requirePageAccess } from "@/lib/authz";
import { StaffsDashboard } from "@/modules/persons/staffs/components";
import { staffService } from "@/modules/persons/staffs/staff.service";
import { roleService } from "@/modules/roles/role.service";

export const metadata: Metadata = { title: "Staff" };

export default async function StaffsPage() {
  await requirePageAccess();
  const [staffs, roles] = await Promise.all([
    staffService.getAll(),
    roleService.getAll(),
  ]);

  return <StaffsDashboard staffs={staffs} roles={roles} />;
}
