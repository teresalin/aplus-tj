import { Class } from "../../api/classes";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import fetcher from "../../../utils/fetcher";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import UpdateClassDetailsDialog from "../../../src/components/UpdateClassDetailsDialog";
import useSWR from "swr";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import UpdateClassStudentsDialog from "../../../src/components/UpdateClassStudentsDialog";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { generateColumns } from "../../../utils/data-grid/generateColumns";

// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";

const FlexGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  marginTop: "0.7em",
  marginBottom: "0.7em",
  border: "2px solid",
  borderColor: "#f3f2f0",
  borderRadius: 7,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: "24px", // mui defaults CardContent bottom-padding to 24px
}));

// const columns: GridColDef[] = [
//   {
//     field: "name",
//     headerName: "姓名",
//     minWidth: 100,
//     flex: 1,
//   },
//   {
//     field: "englishName",
//     headerName: "英文名",
//     minWidth: 100,
//     flex: 1,
//   },
//   {
//     field: "startDate",
//     headerName: "開始日期",
//     minWidth: 120,
//     flex: 1,
//   },
//   {
//     field: "currentSchool",
//     headerName: "現讀學校",
//     minWidth: 300,
//     flex: 1,
//   },
//   {
//     field: "textbookPublisher",
//     headerName: "課本",
//     minWidth: 100,
//     flex: 1,
//   },
// ];

export default function ClassDetails() {
  const classID = useRouter().query.class_id;
  const { data } = useSWR(classID ? `/api/classes/${classID}` : null, fetcher);
  const details = data as Class | null;

  return (
    <Grid container>
      <Grid item xs={12}>
        <StyledCard>
          <StyledCardContent>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              {details && <UpdateClassDetailsDialog classDetails={details} />}
            </Grid>
            <Grid
              container
              rowSpacing={0}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} md={4}>
                <StyledCard variant="outlined">
                  <StyledCardContent>
                    <Typography variant="subtitle1">Schedule</Typography>
                    <Typography>MWF</Typography>
                  </StyledCardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledCard variant="outlined">
                  <StyledCardContent>
                    <Typography variant="subtitle1">Teacher</Typography>
                    <Typography>
                      {details ? details.teacherName : "No teacher assigned"}
                    </Typography>
                  </StyledCardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledCard variant="outlined">
                  <StyledCardContent>
                    <Typography variant="subtitle1">Grade</Typography>
                    <Typography>{details && details.grade}</Typography>
                  </StyledCardContent>
                </StyledCard>
              </Grid>
            </Grid>
          </StyledCardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6" gutterBottom>
              Assignments
            </Typography>
            {details &&
              details.upcomingAssignments.map((detail) => (
                <Card
                  style={{
                    display: "flex",
                    backgroundColor: "#f8f6fc",
                    marginBottom: "1em",
                    boxShadow: "none",
                  }}
                >
                  <Button
                    style={{
                      backgroundColor: "#59addd",
                      color: "#fff",
                      margin: 10,
                    }}
                  >
                    {dayjs(detail.dueDate).format("MMM DD")}
                  </Button>
                  <StyledCardContent>{detail.assignmentName}</StyledCardContent>
                </Card>
              ))}
          </StyledCardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12}>
        <StyledCard>
          <StyledCardContent>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Students
              </Typography>
              {details && <UpdateClassStudentsDialog classDetails={details} />}
            </Grid>
            <Box sx={{ width: "100%" }}>
              {details && (
                <DataGrid
                  rows={details.activeStudents}
                  columns={generateColumns(details.activeStudents)}
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
          </StyledCardContent>
        </StyledCard>
      </Grid>
    </Grid>
  );
}
