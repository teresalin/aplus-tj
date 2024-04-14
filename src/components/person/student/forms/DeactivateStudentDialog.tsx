import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface IDeactivateStudentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit;
}

export default function DeactivateStudentDialog({
  open,
  onClose,
  onSubmit,
}: IDeactivateStudentDialogProps) {
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
        <DialogTitle id="alert-dialog-title">
          {"Deactivate Student"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deactivate this student and remove him/her from class? You can
            always reactivate later.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button autoFocus onClick={handleSubmit}>
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
