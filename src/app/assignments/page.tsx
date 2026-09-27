import type { Metadata } from "next";

import { requirePageAccess } from "@/lib/authz";
import { parseAssignmentFilter } from "@/modules/assignments";
import { assignmentService } from "@/modules/assignments/assignment.service";
import { AssignmentsDashboard } from "@/modules/assignments/components";
import { classService } from "@/modules/classes/class.service";

export const metadata: Metadata = { title: "Assignments" };

export default async function AssignmentsPage({
  searchParams,
}: {
  searchParams: { filter?: string | string[] };
}) {
  await requirePageAccess();
  const filter = parseAssignmentFilter(searchParams.filter);
  const [assignments, classes] = await Promise.all([
    assignmentService.getAll(filter),
    classService.getOptions(),
  ]);

  return (
    <AssignmentsDashboard
      assignments={assignments}
      classes={classes}
      filter={filter}
    />
  );
}
