"use client";

import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface IDeleteSessionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

export default function DeleteSessionDialog({
  open,
  onClose,
  onSubmit,
}: IDeleteSessionDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Delete session"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Permanently delete this session and remove it from its corresponding
          class? You cannot undo this action.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button autoFocus onClick={onSubmit}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
