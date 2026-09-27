import type { Metadata } from "next";
import Button from "@mui/material/Button";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TodayIcon from "@mui/icons-material/Today";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { requirePageAccess } from "@/lib/authz";
import { classService } from "@/modules/classes/class.service";
import { CreateClassButton } from "@/modules/classes/components";
import { gradeService } from "@/modules/grades/grade.service";
import { staffService } from "@/modules/persons/staffs/staff.service";
import { formatScheduleDays } from "@/modules/schedules";

export const metadata: Metadata = { title: "Classes" };

const labelButtonSx = { "&:hover": { backgroundColor: "transparent" } };

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
                  <Tooltip title="Schedule">
                    <Button startIcon={<TodayIcon />} sx={labelButtonSx}>
                      {row.schedules.length
                        ? formatScheduleDays(row.schedules)
                        : "N/A"}
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item md={12} lg={5}>
                  <Tooltip title="Teacher">
                    <Button
                      startIcon={<SupportAgentIcon />}
                      sx={{
                        ...labelButtonSx,
                        whiteSpace: "nowrap",
                        minWidth: "maxContent",
                      }}
                    >
                      {row.teacher.person.name || "N/A"}
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item md={12} lg={3}>
                  <Tooltip title="Students/Capacity">
                    <Button startIcon={<ChildCareIcon />} sx={labelButtonSx}>
                      {row._count.classStudents}/{row.capacity}
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Link>
      ))}
    </>
  );
}
