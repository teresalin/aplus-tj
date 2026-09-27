import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Paper from "@mui/material/Paper";

import { requirePageAccess } from "@/lib/authz";
import { isUuid } from "@/lib/ids";
import { PersonHeader } from "@/modules/persons/components/PersonDetails";
import { studentService } from "@/modules/persons/students/student.service";

export const metadata: Metadata = { title: "Student billing" };

export default async function StudentBillingPage({
  params,
}: {
  params: { studentId: string };
}) {
  await requirePageAccess();
  if (!isUuid(params.studentId)) notFound();

  const student = await studentService.getById(params.studentId);
  if (!student) notFound();

  return (
    <>
      <PersonHeader
        person={student.person}
        subtitle={student.person.preferredName}
      />
      {/* TODO: show the student's billing records once billing is implemented. */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        Billing records for this student are not available yet.
      </Paper>
    </>
  );
}
