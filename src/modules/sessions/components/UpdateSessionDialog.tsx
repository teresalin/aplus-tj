"use client";

import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import type { ClassOption } from "@/modules/classes";
import type { Session } from "@/modules/sessions";
import SessionFormFields, {
  emptySessionFormValues,
  toSessionFormValues,
  type SessionFormValues,
} from "./SessionFormFields";

export interface IUpdateSessionDialogProps {
  existingSession: Session | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SessionFormValues) => Promise<void>;
  classes: ClassOption[];
}

export default function UpdateSessionDialog({
  existingSession,
  open,
  onClose,
  onSubmit,
  classes,
}: IUpdateSessionDialogProps) {
  const [formData, setFormData] = React.useState(emptySessionFormValues);
  const [hasError, setHasError] = React.useState(false);

  // Start from the selected session each time the dialog opens.
  React.useEffect(() => {
    if (open && existingSession) {
      setFormData(toSessionFormValues(existingSession));
    }
  }, [open, existingSession]);

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    if (!hasError) {
      await onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update session</DialogTitle>
        <DialogContent>
          <SessionFormFields
            session={formData}
            setFormData={setFormData}
            classes={classes}
            setHasError={setHasError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button autoFocus type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
