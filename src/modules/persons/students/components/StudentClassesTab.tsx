"use client";

import { useState } from "react";
import useSWR from "swr";
// ← drop this if you don’t need it:
// import { useSearchParams } from 'next/navigation';

import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";

import StudentLayout from "@/modules/persons/students/components/StudentLayout";
import ClassEnrollmentDialog from "@/modules/persons/students/components/ClassEnrollmentDialog";
import fetcher from "@/lib/fetcher";

interface Props {
  studentID: string;
  initialData: Array<{ name: string; startDate: string; endDate: string }>;
}

export default function StudentClassesTab({ studentID, initialData }: Props) {
  const theme = useTheme();

  // If you still want to re-read the URL, guard it:
  // const params = useSearchParams();
  // const idFromUrl = params?.get('id') ?? studentID;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isLoading, error } = useSWR(
    `/api/persons/students/${studentID}/classes`,
    fetcher,
    { fallbackData: initialData },
  );
  const classes = data!; // safe because you have fallbackData

  if (error) return <div>Error fetching data</div>;

  return (
    <>
      <StudentLayout currentTab="classes">
        <Box sx={{ display: "flex", justifyContent: "flex-end" }} m={1}>
          <Button
            startIcon={<AddBoxIcon />}
            onClick={() => setIsDialogOpen(true)}
          >
            Enroll in New Class
          </Button>
        </Box>

        {isLoading && <LinearProgress />}

        {classes.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 2 }}>
            This student is not currently enrolled in any classes.
          </Paper>
        ) : (
          classes.map((c) => (
            <Paper key={c.name} variant="outlined" sx={{ p: 2, my: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">{c.name}</Typography>
                <Button
                  startIcon={<DoDisturbOnIcon />}
                  onClick={() => {
                    /* unenroll */
                  }}
                >
                  Unenroll
                </Button>
              </Stack>
              <Grid container spacing={2} mt={1}>
                {[
                  ["Started On", c.startDate],
                  ["Ended On", c.endDate],
                ].map(([label, val]) => (
                  <Grid item xs={12} md={4} key={label}>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color={theme.palette.primary.main}
                    >
                      {label}
                    </Typography>
                    <Typography variant="body2">{val}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          ))
        )}
      </StudentLayout>

      <ClassEnrollmentDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={() => {
          /* ... */
        }}
        studentClasses={classes}
      />
    </>
  );
}
