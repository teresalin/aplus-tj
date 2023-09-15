import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface IDeleteAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit;
}

export default function DeleteAssignmentDialog({
  open,
  onClose,
  onSubmit,
}: IDeleteAssignmentDialogProps) {
  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Assignment"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Permanently delete this assignment and remove it from its
            corresponding class? You cannot undo this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button autoFocus onClick={handleSubmit}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
