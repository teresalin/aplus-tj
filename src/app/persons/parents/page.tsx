import type { Metadata } from "next";

import { requirePageAccess } from "@/lib/authz";
import { ParentsDashboard } from "@/modules/persons/parents/components";
import { parentService } from "@/modules/persons/parents/parent.service";

export const metadata: Metadata = { title: "Parents" };

export default async function ParentsPage() {
  await requirePageAccess();
  const parents = await parentService.getAll();

  return <ParentsDashboard parents={parents} />;
}
