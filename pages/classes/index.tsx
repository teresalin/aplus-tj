import { Class } from "../api/classes";
import { styled } from "@mui/material/styles";
import * as React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import fetcher from "../../utils/fetcher";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

const FlexGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#ddd",
  },
  marginTop: "1em",
  marginBottom: "1em",
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: "24px", // mui defaults CardContent bottom-padding to 24px
}));

export default function Classes() {
  const { data } = useSWR("api/classes", fetcher);
  const classes = data || [];

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography>Today's Class</Typography>
        <StyledCard>
          <StyledCardContent></StyledCardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12}>
        <Typography>All Classes</Typography>
        {classes.map((row: Class) => (
          <Link href={`classes/${classes.id}`} key={classes.id}>
            <StyledCard key={row.id}>
              <StyledCardContent>
                <Grid container spacing={2}>
                  <Grid item xs={7}>
                    <Typography>{row.name}</Typography>
                  </Grid>
                  <FlexGrid item xs={5}>
                    <FlexGrid sx={{ paddingX: 1.5 }}>
                      <Tooltip title="Teacher">
                        <SupportAgentIcon />
                      </Tooltip>
                      <Typography>{row.teacherName}</Typography>
                    </FlexGrid>
                    <FlexGrid sx={{ paddingX: 1.5 }}>
                      <Tooltip title="Students">
                        <ChildCareIcon />
                      </Tooltip>
                      <Typography>
                        {row.studentCount}/{row.capacity}
                      </Typography>
                    </FlexGrid>
                    <FlexGrid sx={{ paddingX: 1.5 }}>
                      <Tooltip title="Assignments">
                        <AssignmentIcon />
                      </Tooltip>
                      <Typography>Assignments</Typography>
                    </FlexGrid>
                  </FlexGrid>
                </Grid>
              </StyledCardContent>
            </StyledCard>
          </Link>
        ))}
      </Grid>
    </Grid>
  );
}
