"use client";

import { useState } from "react";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";

import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { formatDate } from "@/lib/dates";
import type { ClassOption } from "@/modules/classes";
import type { StudentEnrollment } from "@/modules/persons/students";
import ClassEnrollmentDialog from "./ClassEnrollmentDialog";

interface Props {
  enrollments: StudentEnrollment[];
  classes: ClassOption[];
}

export default function StudentClassesView({ enrollments, classes }: Props) {
  const notify = useSnackbar();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // TODO implement enrolling in and unenrolling from classes
  const notImplemented = () =>
    notify("Changing class enrollment is not available yet.", "info");

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }} m={1}>
        <Button
          startIcon={<AddBoxIcon />}
          onClick={() => setIsDialogOpen(true)}
        >
          Enroll in New Class
        </Button>
      </Box>

      {enrollments.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          This student is not currently enrolled in any classes.
        </Paper>
      ) : (
        enrollments.map((enrollment) => (
          <Paper key={enrollment.id} variant="outlined" sx={{ p: 2, my: 1 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">{enrollment.class.name}</Typography>
              <Button
                color="warning"
                startIcon={<DoDisturbOnIcon />}
                onClick={notImplemented}
              >
                Unenroll
              </Button>
            </Stack>
            <Grid container spacing={2} mt={1}>
              {[
                ["Started On", formatDate(enrollment.startDate)],
                ["Ended On", formatDate(enrollment.endDate)],
              ].map(([label, value]) => (
                <Grid item xs={12} md={4} key={label}>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {label}
                  </Typography>
                  <Typography variant="body2">{value}</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))
      )}

      <ClassEnrollmentDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={notImplemented}
        classes={classes}
      />
    </>
  );
}
