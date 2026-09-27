"use client";

import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import type { Assignment } from "@/modules/assignments";
import type { ClassOption } from "@/modules/classes";
import AssignmentFormFields, {
  emptyAssignmentFormValues,
  toAssignmentFormValues,
  type AssignmentFormValues,
} from "./AssignmentFormFields";

export interface IUpdateAssignmentDialogProps {
  existingAssignment: Assignment | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AssignmentFormValues) => Promise<void>;
  classes: ClassOption[];
}

export default function UpdateAssignmentDialog({
  existingAssignment,
  open,
  onClose,
  onSubmit,
  classes,
}: IUpdateAssignmentDialogProps) {
  const [formData, setFormData] = React.useState(emptyAssignmentFormValues);

  // Start from the selected assignment each time the dialog opens.
  React.useEffect(() => {
    if (open && existingAssignment) {
      setFormData(toAssignmentFormValues(existingAssignment));
    }
  }, [open, existingAssignment]);

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Dialog disablePortal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update Assignment</DialogTitle>
        <DialogContent>
          <AssignmentFormFields
            assignment={formData}
            setFormData={setFormData}
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
