import type { Metadata } from "next";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { requirePageAccess } from "@/lib/authz";
import { classService } from "@/modules/classes/class.service";

export const metadata: Metadata = { title: "Attendance" };

export default async function AttendancePage() {
  await requirePageAccess();
  const classes = await classService.getOptions();

  return (
    <>
      {/* Use Grid here for margin and padding consistency with other pages */}
      <Grid container>
        <Typography variant="h6" gutterBottom>
          Attendance
        </Typography>
      </Grid>

      {classes.length === 0 ? (
        <Card variant="outlined" sx={{ mt: 2, p: 2 }}>
          No student attendance records.
        </Card>
      ) : (
        classes.map((row) => (
          <Link href={`/attendance/${row.id}`} key={row.id}>
            <Paper sx={{ my: 2, p: 2 }}>
              <Typography>{row.name}</Typography>
            </Paper>
          </Link>
        ))
      )}
    </>
  );
}
