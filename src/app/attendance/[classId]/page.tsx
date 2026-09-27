import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import BackButton from "@/components/BackButton";
import { requirePageAccess } from "@/lib/authz";
import { isUuid } from "@/lib/ids";
import { parseWeekParam } from "@/modules/attendance";
import { attendanceService } from "@/modules/attendance/attendance.service";
import WeeklyAttendanceGrid from "@/modules/attendance/components/WeeklyAttendanceGrid";

export const metadata: Metadata = { title: "Attendance" };

export default async function ClassAttendancePage({
  params,
  searchParams,
}: {
  params: { classId: string };
  searchParams: { week?: string | string[] };
}) {
  await requirePageAccess();
  if (!isUuid(params.classId)) notFound();

  const attendance = await attendanceService.getWeek(
    params.classId,
    parseWeekParam(searchParams.week),
  );
  if (!attendance) notFound();

  return (
    <>
      <BackButton href="/attendance" />
      {/* Use Grid here for margin and padding consistency with other pages */}
      <Grid container>
        <Typography variant="h6" gutterBottom>
          Attendance: {attendance.class.name}
        </Typography>
      </Grid>
      <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
        <WeeklyAttendanceGrid
          classId={attendance.class.id}
          dates={attendance.dates}
          rows={attendance.rows}
        />
      </Box>
    </>
  );
}
