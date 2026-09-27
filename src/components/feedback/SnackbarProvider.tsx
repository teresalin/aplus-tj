"use client";

import Alert, { AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React from "react";

type Notify = (message: string, severity?: AlertColor) => void;

const SnackbarContext = React.createContext<Notify | null>(null);

/** App-wide success/error notifications shown in the top-right corner. */
export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState<AlertColor>("success");

  const notify = React.useCallback<Notify>(
    (nextMessage, nextSeverity = "success") => {
      setMessage(nextMessage);
      setSeverity(nextSeverity);
      setOpen(true);
    },
    [],
  );

  return (
    <SnackbarContext.Provider value={notify}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): Notify {
  const notify = React.useContext(SnackbarContext);
  if (!notify) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return notify;
}
