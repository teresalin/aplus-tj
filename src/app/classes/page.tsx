import type { Metadata } from "next";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TodayIcon from "@mui/icons-material/Today";
import Typography from "@mui/material/Typography";

import IconLabel from "@/components/IconLabel";
import { requirePageAccess } from "@/lib/authz";
import { classService } from "@/modules/classes/class.service";
import { CreateClassButton } from "@/modules/classes/components";
import { gradeService } from "@/modules/grades/grade.service";
import { staffService } from "@/modules/persons/staffs/staff.service";
import { formatScheduleDays } from "@/modules/schedules";

export const metadata: Metadata = { title: "Classes" };

export default async function ClassesPage() {
  await requirePageAccess();
  const [classes, grades, teachers] = await Promise.all([
    classService.getAll(),
    gradeService.getAll(),
    staffService.getOptions(),
  ]);

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          All Classes
        </Typography>
        <CreateClassButton grades={grades} teachers={teachers} />
      </Grid>

      {classes.length === 0 && (
        <Paper variant="outlined" sx={{ my: 2, p: 2 }}>
          No classes yet.
        </Paper>
      )}

      {classes.map((row) => (
        <Link href={`/classes/${row.id}`} key={row.id}>
          <Paper sx={{ my: 2, p: 2 }}>
            <Grid
              container
              spacing={2}
              direction="row"
              alignContent="center"
              justifyContent="space-between"
            >
              <Grid container item alignContent="center" xs={12} md="auto">
                <Typography>{row.name}</Typography>
              </Grid>
              <Grid container item justifyContent="flex-end" xs={12} md={5}>
                <Grid item md={12} lg={3}>
                  <IconLabel icon={TodayIcon} label="Schedule">
                    {row.schedules.length
                      ? formatScheduleDays(row.schedules)
                      : "N/A"}
                  </IconLabel>
                </Grid>
                <Grid item md={12} lg={5}>
                  <IconLabel icon={SupportAgentIcon} label="Teacher">
                    {row.teacher.person.name || "N/A"}
                  </IconLabel>
                </Grid>
                <Grid item md={12} lg={3}>
                  <IconLabel icon={ChildCareIcon} label="Students/Capacity">
                    {row._count.classStudents}/{row.capacity}
                  </IconLabel>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Link>
      ))}
    </>
  );
}
