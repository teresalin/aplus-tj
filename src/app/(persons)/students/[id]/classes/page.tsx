import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import ClassEnrollmentDialog from "../../../../../modules/persons/students/components/ClassEnrollmentDialog";
import StudentLayout from "../../../../../modules/persons/students/components/StudentLayout";
import fetcher from "@/lib/api/fetcher";

export default function ClassesTab() {
  const theme = useTheme();
  const studentID = useRouter().query.student_id;

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { data, isLoading, error } = useSWR(
    studentID ? `/api/persons/students/${studentID}/classes` : null,
    fetcher,
  );
  const classes = data || [];

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = (data) => {
    // TODO implement submit
  };

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
      <StudentLayout currentTab="classes">
        <Box sx={{ display: "flex", flexDirection: "row-reverse" }} m={1}>
          <Button
            variant="text"
            color="primary"
            startIcon={<AddBoxIcon />}
            onClick={handleEditClick}
          >
            Enroll in New Class
          </Button>
        </Box>

        {/* Display LinearProgress inside the layout if still loading */}
        {isLoading && <LinearProgress />}

        {data && classes.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 2 }}>
            This student is not currently enrolled in any classes.
          </Paper>
        ) : (
          classes.map((classData) => (
            <Paper variant="outlined" sx={{ p: 2, my: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">{classData.name}</Typography>
                <Button
                  variant="text"
                  color="warning"
                  startIcon={<DoDisturbOnIcon />}
                  onClick={handleEditClick}
                >
                  Unenroll
                </Button>
              </Stack>
              <Box mt={1}>
                <Grid container spacing={3}>
                  <Grid item sm={12} md={4}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      Started On
                    </Typography>
                    <Typography variant="body2">
                      {classData.startDate}
                    </Typography>
                  </Grid>
                  <Grid item sm={12} md={4}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      Ended On
                    </Typography>
                    <Typography variant="body2">{classData.endDate}</Typography>
                  </Grid>
                  <Grid item sm={12} md={4}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      Recent Attendance
                    </Typography>
                    {/* {classData.sessionDates.map((index, date) => (
                  <Typography key={index} variant="body2">
                    {date}
                  </Typography>
                ))} */}
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          ))
        )}
      </StudentLayout>
      <ClassEnrollmentDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        studentClasses={classes}
      />
    </>
  );
}
