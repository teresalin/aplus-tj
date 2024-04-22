import React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import { Schedule } from "../api/classes/[class_id]/schedules";
import fetcher from "../../utils/fetcher";
import { Class } from "../../src/components/classes/types";

function AddIconButton({ onClick }) {
  return (
    <Button
      variant="text"
      color="primary"
      startIcon={<AddBoxIcon />}
      onClick={onClick}
    >
      New Cost Entry
    </Button>
  );
}

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

export default function Classes() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { data } = useSWR("api/classes", fetcher);
  const classes = data || [];

  const handleAddButtonClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCreateClass = async (data) => {
    const response = await fetch(`/api/classes/index`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
    } else {
      console.error("Error creating/updating class:", response.statusText);
    }
  };

  // Settings, class color, calander
  if (!classes) return <CircularProgress />;

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Billing
        </Typography>
        {/* <Button
          variant="text"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleOpenDialog}
        >
          Add
        </Button> */}
        <AddIconButton onClick={handleAddButtonClick} />
      </Grid>
      {classes.map((row: Class) => (
        <Link href={`billing/${row.id}`} key={row.id}>
          <Paper key={row.id} sx={{ my: 2, p: 2 }}>
            <Grid
              container
              spacing={2}
              direction="row"
              alignContent="center"
              justifyContent="space-between"
            >
              <Grid container item alignContent="center" xs={12} md="auto">
                <Typography>{row.name}</Typography>
              </Grid>
              {/* <Grid container item justifyContent="flex-end" xs={12} md={5}>
                <Grid item md={12} lg={3}>
                  <Tooltip title="Schedule">
                    <Button
                      startIcon={<TodayIcon />}
                      sx={{
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      {row.schedules ? formatDaysOfWeek(row.schedules) : "N/A"}
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item md={12} lg={5}>
                  <Tooltip title="Teacher">
                    <Button
                      startIcon={<SupportAgentIcon />}
                      sx={{
                        whiteSpace: "nowrap",
                        minWidth: "maxContent",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      {row.teacher.name ? row.teacher.name : "N/A"}
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item md={12} lg={3}>
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
              </Grid> */}
            </Grid>
          </Paper>
        </Link>
      ))}
      {/* <CreateClassDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleCreateClass}
      /> */}
    </>
  );
}
