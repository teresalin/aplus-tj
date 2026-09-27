"use client";

import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import type { ClassOption } from "@/modules/classes";
import SessionFormFields, {
  emptySessionFormValues,
  type SessionFormValues,
} from "./SessionFormFields";

export interface ICreateSessionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SessionFormValues, resetForm: () => void) => Promise<void>;
  classes: ClassOption[];
}

export default function CreateSessionDialog({
  open,
  onClose,
  onSubmit,
  classes,
}: ICreateSessionDialogProps) {
  const [newSession, setNewSession] = React.useState(emptySessionFormValues);
  const [hasError, setHasError] = React.useState(false);

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    if (!hasError) {
      await onSubmit(newSession, () => setNewSession(emptySessionFormValues));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New session</DialogTitle>
        <DialogContent>
          <SessionFormFields
            session={newSession}
            setFormData={setNewSession}
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
