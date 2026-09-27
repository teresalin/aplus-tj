import type { Metadata } from "next";

import { requirePageAccess } from "@/lib/authz";
import ScheduleCalendar from "@/modules/schedules/components/ScheduleCalendar";

export const metadata: Metadata = { title: "Schedule" };

export default async function SchedulesPage() {
  await requirePageAccess();
  return <ScheduleCalendar />;
}
