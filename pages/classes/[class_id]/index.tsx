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
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import { Class } from "../../api/classes";
import fetcher from "../../../utils/fetcher";
import UpdateClassDetailsDialog from "../../../src/components/class/UpdateClassDetailsDialog";
import UpdateClassStudentsDialog from "../../../src/components/class/UpdateClassStudentsDialog";

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

export default function ClassDetails() {
  const theme = useTheme();
  const classID = useRouter().query.class_id;
  const { data } = useSWR(classID ? `/api/classes/${classID}` : null, fetcher);
  const classData = data || [];

  return (
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
          {classData && <UpdateClassDetailsDialog classDetails={classData} />}
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
                <Typography>MWF</Typography>
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
                  {classData ? classData.teacherName : "No teacher assigned"}
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
        Upcoming Assignments
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        {classData && classData.upcomingAssignments ? (
          classData.upcomingAssignments
            .slice(0, 3)
            .map((detail, index, array) => (
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
                  <Typography>{detail.assignmentName}</Typography>
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
    </>
  );
}
