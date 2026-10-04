import type { Metadata } from "next";

import { requirePageAccess } from "@/lib/authz";
import { classService } from "@/modules/classes/class.service";
import { staffService } from "@/modules/persons/staffs/staff.service";
import { parseSessionRange } from "@/modules/sessions";
import { SessionsDashboard } from "@/modules/sessions/components";
import { sessionService } from "@/modules/sessions/session.service";

export const metadata: Metadata = { title: "Sessions" };

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: { range?: string | string[] };
}) {
  await requirePageAccess();
  const range = parseSessionRange(searchParams.range);
  const [sessions, classes, teachers] = await Promise.all([
    sessionService.getAll(range),
    classService.getOptions(),
    staffService.getOptions(),
  ]);

  return (
    <SessionsDashboard
      sessions={sessions}
      classes={classes}
      teachers={teachers}
      range={range}
    />
  );
}
