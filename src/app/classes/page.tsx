import AddBoxIcon from "@mui/icons-material/AddBox";
import Alert, { AlertColor } from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TodayIcon from "@mui/icons-material/Today";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useSWR, { mutate } from "swr";

import { Class, CreateClassDialog } from "../../modules/classes";
import { Schedule } from "../../modules/schedules";
import { daysOfWeek } from "../../constants";
import fetcher from "@/lib/api/fetcher";

// TODO allow user to select a color for each class in admin settings

function AddIconButton({ onClick }) {
  return (
    <Button
      variant="text"
      color="primary"
      startIcon={<AddBoxIcon />}
      onClick={onClick}
    >
      Add Class
    </Button>
  );
}

function formatDaysOfWeek(schedules: Schedule[]): string {
  const selectedDays = schedules.map((schedule) => schedule.dayOfWeek);

  // Create an array of abbreviations for selected days
  const abbreviations = daysOfWeek
    .filter((day) => selectedDays.includes(day))
    .map((day) => day.substring(0, 1));

  return abbreviations.join("");
}

export default function Classes() {
  const [isCreateClassDialogOpen, setIsCreateClassDialogOpen] =
    React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    React.useState<AlertColor>("error");

  const { data, isLoading, error } = useSWR<Class[]>("api/classes", fetcher);
  const classes = data || [];

  const handleAddButtonClick = () => {
    setIsCreateClassDialogOpen(true);
  };

  const handleCloseCreateClassDialog = () => {
    setIsCreateClassDialogOpen(false);
  };

  const handleCreateClass = async (data, resetForm: () => void) => {
    try {
      const response = await fetch(`/api/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        handleCloseCreateClassDialog();
        mutate("/api/classes");
        setSnackbarMessage("Class created successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        resetForm();
      } else {
        console.error("Error creating class:", responseData);
        setSnackbarMessage(responseData.error.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setSnackbarMessage("An unexpected error occurred");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          All Classes
        </Typography>
        <AddIconButton onClick={handleAddButtonClick} />
      </Grid>

      {/* Display LinearProgress inside the layout if still loading */}
      {isLoading && <LinearProgress />}

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
              <Grid container item alignContent="center" xs={12} md="auto">
                <Typography>{row.name}</Typography>
              </Grid>
              <Grid container item justifyContent="flex-end" xs={12} md={5}>
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
                      0/{row.capacity}
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Link>
      ))}
      <CreateClassDialog
        open={isCreateClassDialogOpen}
        onClose={handleCloseCreateClassDialog}
        onSubmit={handleCreateClass}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
