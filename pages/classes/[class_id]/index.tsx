import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useSWR, { mutate } from "swr";

import { Class } from "../../api/classes";
import fetcher from "../../../utils/fetcher";
import UpdateClassDetailsDialog from "../../../src/components/class/UpdateClassDetailsDialog";
import UpdateClassStudentsDialog from "../../../src/components/class/UpdateClassStudentsDialog";
import CircularProgress from "@mui/material/CircularProgress";
import { Schedule } from "../../api/classes/[class_id]/schedules";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "姓名",
    minWidth: 100,
    flex: 1,
  },
  {
    field: "englishName",
    headerName: "英文名",
    minWidth: 100,
    flex: 1,
  },
  {
    field: "startDate",
    headerName: "開始日期",
    minWidth: 50,
    flex: 1,
  },
  {
    field: "currentSchool",
    headerName: "現讀學校",
    minWidth: 300,
    flex: 1,
  },
  {
    field: "textbookPublisher",
    headerName: "課本",
    minWidth: 100,
    flex: 1,
  },
];

function formatDaysOfWeek(schedules: Schedule[]): string {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const selectedDays = schedules.map((schedule) => schedule.dayOfWeek);

  // Create an array of abbreviations for selected days
  const abbreviations = daysOfWeek
    .filter((day) => selectedDays.includes(day))
    .map((day) => day.substring(0, 1));

  return abbreviations.join("");
}

export default function ClassDetails() {
  const theme = useTheme();
  const classID = useRouter().query.class_id;
  const [isEditDetailsDialogOpen, setIsEditDetailsDialogOpen] =
    React.useState(false);
  const { data } = useSWR(classID ? `/api/classes/${classID}` : null, fetcher);
  const classData = data as Class;

  const handleEditDetailsClick = () => {
    setIsEditDetailsDialogOpen(true);
  };

  const handleCloseEditDetailsDialog = () => {
    setIsEditDetailsDialogOpen(false);
  };

  // TODO function and mutate not working
  const handleUpdateDetails = async (data) => {
    const response = await fetch(`/api/classes/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setIsEditDetailsDialogOpen(false);
      mutate(`/api/classes/${data.id}`);
    } else {
      console.error("Error updating class details:", response.statusText);
    }
  };

  if (!classData) return <CircularProgress />;

  return (
    classData && (
      <>
        <Box mt={-1} mb={2}>
          <Button
            component={Link}
            href="/classes"
            startIcon={<ArrowBackIosIcon />}
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            Back
          </Button>
        </Box>
        <Box mb={2}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            <Button
              variant="text"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEditDetailsClick}
            >
              Edit
            </Button>
          </Grid>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid
              container
              rowSpacing={0}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                  >
                    Schedule
                  </Typography>
                  <Typography>
                    {classData.schedules
                      ? formatDaysOfWeek(classData.schedules)
                      : "N/A"}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                  >
                    Teacher
                  </Typography>
                  <Typography>
                    {classData ? classData.teacher.name : "No teacher assigned"}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                  >
                    Grade
                  </Typography>
                  <Typography>{classData && classData.grade.name}</Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        <Typography variant="h6" gutterBottom>
          Assignments
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          {classData && classData.assignments ? (
            classData.assignments.slice(0, 3).map((detail, index, array) => (
              <Card
                style={{
                  display: "flex",
                  backgroundColor: "#f8f6fc",
                  marginBottom: index < array.length - 1 ? "1em" : "0",
                  boxShadow: "none",
                  height: "4.4em",
                  padding: "0.8em",
                }}
              >
                <Button
                  sx={{
                    backgroundColor: "#59addd",
                    color: "#fff",
                    // margin: 10,
                    mr: 2,
                  }}
                >
                  {dayjs(detail.dueDate).format("MMM DD")}
                </Button>
                {/* <AssignmentStyledCardContent> */}
                <Stack direction="column" justifyContent="center">
                  <Typography>{detail.name}</Typography>
                  {detail.description && (
                    <Typography variant="subtitle2" sx={{ color: "#808080" }}>
                      {detail.description}
                    </Typography>
                  )}
                </Stack>
              </Card>
            ))
          ) : (
            <p>No upcoming assignments</p>
          )}
        </Paper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Students
          </Typography>
          {classData && <UpdateClassStudentsDialog classDetails={classData} />}
        </Grid>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ width: "100%" }}>
            {classData && classData.activeStudents ? (
              <DataGrid
                rows={classData.activeStudents}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                autoHeight={true}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                density="compact"
              />
            ) : (
              <p>No active students data available</p>
            )}
          </Box>
        </Paper>
        <UpdateClassDetailsDialog
          existingData={classData}
          open={isEditDetailsDialogOpen}
          onClose={handleCloseEditDetailsDialog}
          onSubmit={handleUpdateDetails}
        />
      </>
    )
  );
}
