import { styled } from "@mui/material/styles";
import * as React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import fetcher from "../../utils/fetcher";
import { Class } from "../api/classes";

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  // "&:hover": {
  //   backgroundColor: "#ecf5fc",
  // },
  marginTop: "1em",
  marginBottom: "1em",
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: "24px", // mui defaults CardContent bottom-padding to 24px
}));

export default function Classes() {
  const { data } = useSWR("api/classes", fetcher);
  const classes = data as Class[];

  if (!classes) return <CircularProgress />;

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
          <Link href={`classes/${row.id}`} key={row.id}>
            <StyledCard key={row.id}>
              <StyledCardContent>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Grid container item alignContent="center" xs="auto">
                    <Typography>{row.className}</Typography>
                  </Grid>
                  <Grid container item alignContent="center" xs="auto">
                    <Grid item sx={{ paddingX: 1.5 }}>
                      <Tooltip title="Teacher">
                        <Button
                          startIcon={<SupportAgentIcon />}
                          sx={{
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          {row.teacherName}
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item sx={{ paddingX: 1.5 }}>
                      <Tooltip title="Students">
                        <Button
                          startIcon={<ChildCareIcon />}
                          sx={{
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          {row.studentCount}/{row.capacity}
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item sx={{ paddingX: 1.5 }}>
                      <Tooltip title="Assignments">
                        <Button
                          startIcon={<AssignmentIcon />}
                          sx={{
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          Assignments
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              </StyledCardContent>
            </StyledCard>
          </Link>
        ))}
      </Grid>
    </Grid>
  );
}
