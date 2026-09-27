import type { Metadata } from "next";

import { requirePageAccess } from "@/lib/authz";
import DashboardOverview from "@/modules/dashboard/components/DashboardOverview";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  await requirePageAccess();
  return <DashboardOverview />;
}
