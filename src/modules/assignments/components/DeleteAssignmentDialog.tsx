"use client";

import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import type { Assignment } from "@/modules/assignments";

export interface IDeleteAssignmentDialogProps {
  assignment: Assignment | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Assignment) => Promise<void>;
}

export default function DeleteAssignmentDialog({
  assignment,
  open,
  onClose,
  onSubmit,
}: IDeleteAssignmentDialogProps) {
  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    if (assignment) {
      await onSubmit(assignment);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="alert-dialog-title">{"Delete Assignment"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Permanently delete this assignment and remove it from its
            corresponding class? You cannot undo this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button autoFocus type="submit">
            Delete
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
