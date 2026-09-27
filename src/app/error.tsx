"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import React from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={reset}>
          Try again
        </Button>
      }
    >
      Something went wrong while loading this page.
    </Alert>
  );
}
