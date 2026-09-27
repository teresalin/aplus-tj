import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import BackButton from "@/components/BackButton";
import { requirePageAccess } from "@/lib/authz";
import { isUuid } from "@/lib/ids";
import { classService } from "@/modules/classes/class.service";

export const metadata: Metadata = { title: "Billing" };

export default async function ClassBillingPage({
  params,
}: {
  params: { classId: string };
}) {
  await requirePageAccess();
  if (!isUuid(params.classId)) notFound();

  const classDetail = await classService.getById(params.classId);
  if (!classDetail) notFound();

  return (
    <>
      <BackButton href="/billing" />
      <Typography variant="h6" gutterBottom>
        Billing: {classDetail.name}
      </Typography>
      {/* TODO: billing records per class have not been implemented yet. */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        Billing records for this class are not available yet.
      </Paper>
    </>
  );
}
