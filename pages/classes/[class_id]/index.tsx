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
  const details = data as Class | null;

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
          {details && <UpdateClassDetailsDialog classDetails={details} />}
        </Grid>
        <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                Schedule
              </Typography>
              <Typography>MWF</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                Teacher
              </Typography>
              <Typography>
                {details ? details.teacherName : "No teacher assigned"}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                Grade
              </Typography>
              <Typography>{details && details.grade}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Typography variant="h6" gutterBottom>
        Upcoming Assignments
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        {details &&
          details.upcomingAssignments.slice(0, 3).map((detail) => (
            <Card
              style={{
                display: "flex",
                backgroundColor: "#f8f6fc",
                marginBottom: "1em",
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
              {/* </AssignmentStyledCardContent> */}
            </Card>
          ))}
      </Paper>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Students
        </Typography>
        {details && <UpdateClassStudentsDialog classDetails={details} />}
      </Grid>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box sx={{ width: "100%" }}>
          {details && (
            <DataGrid
              rows={details.activeStudents}
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
          )}
        </Box>
      </Paper>
    </>
  );
}
