"use client";

import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import type { ClassOption } from "@/modules/classes";
import AssignmentFormFields, {
  emptyAssignmentFormValues,
  type AssignmentFormValues,
} from "./AssignmentFormFields";

export interface ICreateAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: AssignmentFormValues,
    resetForm: () => void,
  ) => Promise<void>;
  classes: ClassOption[];
}

export default function CreateAssignmentDialog({
  open,
  onClose,
  onSubmit,
  classes,
}: ICreateAssignmentDialogProps) {
  const [newAssignment, setNewAssignment] = React.useState(
    emptyAssignmentFormValues,
  );

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    await onSubmit(newAssignment, () =>
      setNewAssignment(emptyAssignmentFormValues),
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New assignment</DialogTitle>
        <DialogContent>
          <AssignmentFormFields
            assignment={newAssignment}
            setFormData={setNewAssignment}
            classes={classes}
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
