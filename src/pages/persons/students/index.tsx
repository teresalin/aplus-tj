import Alert, { AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box";
import React from "react";
import Snackbar from "@mui/material/Snackbar";

import StudentsDashboard from "../../../modules/persons/students/components/StudentsDashboard";

export default function StudentsPage() {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    React.useState<AlertColor>("error");

  const handleSnackbar = (
    message: string,
    severity: AlertColor = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <>
      <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
        <StudentsDashboard onSnackbar={handleSnackbar} />
      </Box>
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
