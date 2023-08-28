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
                      backgroundColor: "#4741e0",
                      color: "#fff",
                      margin: 10,
                    }}
                  >
                    {dayjs(detail.dueDate).format("MMM DD")}
                  </Button>
                  <StyledCardContent>{detail.name}</StyledCardContent>
                </Card>
              ))}
          </StyledCardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6" gutterBottom>
              Students
            </Typography>
            {details &&
              details.activeStudents.map((student) => (
                <Card
                  style={{
                    display: "flex",
                    backgroundColor: "#f8f6fc",
                    marginBottom: "1em",
                    boxShadow: "none",
                  }}
                >
                  <StyledCardContent>{student.name}</StyledCardContent>
                </Card>
              ))}
          </StyledCardContent>
        </StyledCard>
      </Grid>
    </Grid>
  );
}
