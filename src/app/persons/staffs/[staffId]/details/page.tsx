import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { requirePageAccess } from "@/lib/authz";
import { isUuid } from "@/lib/ids";
import { formatDate } from "@/lib/dates";
import {
  DetailItem,
  PersonHeader,
} from "@/modules/persons/components/PersonDetails";
import { EditStaffButton } from "@/modules/persons/staffs/components";
import { staffService } from "@/modules/persons/staffs/staff.service";
import { roleService } from "@/modules/roles/role.service";

export const metadata: Metadata = { title: "Staff" };

export default async function StaffDetailsPage({
  params,
}: {
  params: { staffId: string };
}) {
  await requirePageAccess();
  if (!isUuid(params.staffId)) notFound();

  const [staff, roles] = await Promise.all([
    staffService.getById(params.staffId),
    roleService.getAll(),
  ]);
  if (!staff) notFound();

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row-reverse" }} m={1}>
        <EditStaffButton staff={staff} roles={roles} />
      </Box>

      <PersonHeader person={staff.person} subtitle={staff.role.name} />
      <Typography variant="h6" gutterBottom>
        A Plus Enrollment
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={4}>
            <DetailItem label="Join Date">
              {formatDate(staff.hireDate)}
            </DetailItem>
          </Grid>
          <Grid item sm={12} md={4}>
            <DetailItem label="Leave Date">
              {formatDate(staff.leaveDate)}
            </DetailItem>
          </Grid>
          <Grid item sm={12} md={4}>
            <DetailItem label="Status">
              {staff.person.active ? "Active" : "Inactive"}
            </DetailItem>
          </Grid>
        </Grid>
      </Paper>
      <Typography variant="h6" gutterBottom>
        Other
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <DetailItem label="Notes">{staff.person.notes || "N/A"}</DetailItem>
      </Paper>
    </>
  );
}
