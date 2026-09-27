import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { requirePageAccess } from "@/lib/authz";
import { isUuid } from "@/lib/ids";
import { staffService } from "@/modules/persons/staffs/staff.service";

export const metadata: Metadata = { title: "Staff classes" };

export default async function StaffClassesPage({
  params,
}: {
  params: { staffId: string };
}) {
  await requirePageAccess();
  if (!isUuid(params.staffId)) notFound();

  const staff = await staffService.getWithClasses(params.staffId);
  if (!staff) notFound();

  const classes = staff.classes.filter((cls) => cls.active);

  return classes.length === 0 ? (
    <Paper variant="outlined" sx={{ p: 2, my: 1 }}>
      This staff member is not currently teaching any classes.
    </Paper>
  ) : (
    <>
      {classes.map((cls) => (
        <Link key={cls.id} href={`/classes/${cls.id}`}>
          <Paper variant="outlined" sx={{ p: 2, my: 1 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">{cls.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {cls.grade.name}
              </Typography>
            </Stack>
          </Paper>
        </Link>
      ))}
    </>
  );
}
