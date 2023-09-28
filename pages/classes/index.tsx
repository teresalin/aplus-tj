import * as React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Button from "@mui/material/Button";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TodayIcon from "@mui/icons-material/Today";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import fetcher from "../../utils/fetcher";
import { Class } from "../api/classes";
import Paper from "@mui/material/Paper";
import { Schedule } from "../api/classes/[class_id]/schedules";

export default function Classes() {
  const { data } = useSWR("api/classes", fetcher);
  const classes = data as Class[];

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

    // Join the abbreviations with no space between them (e.g., "MWF")
    return abbreviations.join("");
  }

  if (!classes) return <CircularProgress />;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography>Today's Class</Typography>
        <Paper sx={{ my: 2, p: 2 }}></Paper>
      </Grid>
      <Grid item xs={12}>
        <Typography>All Classes</Typography>
        {classes.map((row: Class) => (
          <Link href={`classes/${row.id}`} key={row.id}>
            <Paper key={row.id} sx={{ my: 2, p: 2 }}>
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
                <Grid container item justifyContent="flex-end" xs={4}>
                  <Grid item xs={3}>
                    <Tooltip title="Schedule">
                      <Button
                        startIcon={<TodayIcon />}
                        sx={{
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        {row.schedules
                          ? formatDaysOfWeek(row.schedules)
                          : "N/A"}
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={5}>
                    <Tooltip title="Teacher">
                      <Button
                        startIcon={<SupportAgentIcon />}
                        sx={{
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        {row.teacherName ? row.teacherName : "N/A"}
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={3}>
                    <Tooltip title="Students/Capacity">
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
                </Grid>
              </Grid>
            </Paper>
          </Link>
        ))}
      </Grid>
    </Grid>
  );
}
