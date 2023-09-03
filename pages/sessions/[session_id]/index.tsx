import { GridColDef } from "@mui/x-data-grid";
import { SessionDetail } from "../../api/sessions/[session_id]";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ClassIcon from "@mui/icons-material/Class";
import EventIcon from "@mui/icons-material/Event";
import fetcher from "../../../utils/fetcher";
import Grid from "@mui/material/Grid";
import HailIcon from "@mui/icons-material/Hail";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

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
    minWidth: 120,
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

export default function SessionDetails() {
  const sessionID = useRouter().query.session_id;
  const { data } = useSWR(
    sessionID ? `/api/sessions/${sessionID}` : null,
    fetcher
  );
  const details = data as SessionDetail | null;

  return (
    <Grid container>
      <Grid item xs={12}>
        <StyledCard>
          <StyledCardContent>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
            </Grid>
            <Grid
              container
              rowSpacing={0}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} md={3}>
                <StyledCard variant="outlined">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <EventIcon sx={{ fontSize: "2em" }} />
                    <StyledCardContent>
                      <Box>
                        <Typography variant="subtitle1">Date</Typography>
                        <Typography>Aug 22</Typography>
                        <Typography variant="caption">18:00 - 20:00</Typography>
                      </Box>
                    </StyledCardContent>
                  </Box>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={3}>
                <StyledCard variant="outlined">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ClassIcon sx={{ fontSize: "2em" }} />
                    <StyledCardContent>
                      <Box>
                        <Typography variant="subtitle1">Class</Typography>
                        <Typography>{details?.className}</Typography>
                        <Typography variant="caption">
                          {details?.teacher}
                        </Typography>
                      </Box>
                    </StyledCardContent>
                  </Box>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={3}>
                <StyledCard variant="outlined">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <HailIcon sx={{ fontSize: "2em" }} />
                    <StyledCardContent>
                      <Box>
                        <Typography variant="subtitle1">Attended</Typography>
                        <Typography>
                          {details
                            ? details.attended.length
                            : "Info not available"}
                        </Typography>
                      </Box>
                    </StyledCardContent>
                  </Box>
                </StyledCard>
              </Grid>

              <Grid item xs={12} md={3}>
                <StyledCard variant="outlined">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <HelpCenterIcon sx={{ fontSize: "2em" }} />
                    <StyledCardContent>
                      <Box>
                        <Typography variant="subtitle1">Absent</Typography>
                        <Typography>
                          {details
                            ? details.absent.length
                            : "Info not available"}
                        </Typography>
                      </Box>
                    </StyledCardContent>
                  </Box>
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
            {/* {details &&
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
              ))} */}
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
            </Grid>
            <Box sx={{ width: "100%" }}>
              {/* {details && (
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
              )} */}
            </Box>
          </StyledCardContent>
        </StyledCard>
      </Grid>
    </Grid>
  );
}
