"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

import type { Grade } from "@/modules/grades";
import type { StaffOption } from "@/modules/persons/staffs";
import ClassFormFields, {
  emptyClassFormValues,
  type ClassFormValues,
} from "./ClassFormFields";

export interface ICreateClassDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormValues, resetForm: () => void) => Promise<void>;
  grades: Grade[];
  teachers: StaffOption[];
}

export default function CreateClassDialog({
  open,
  onClose,
  onSubmit,
  grades,
  teachers,
}: ICreateClassDialogProps) {
  const [newClass, setNewClass] = React.useState(emptyClassFormValues);
  const [hasError, setHasError] = React.useState(false);

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    if (!hasError) {
      await onSubmit(newClass, () => setNewClass(emptyClassFormValues));
    }
  };

  return (
    <Dialog disablePortal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New Class</DialogTitle>
        <DialogContent>
          <ClassFormFields
            classData={newClass}
            setFormData={setNewClass}
            grades={grades}
            teachers={teachers}
            setHasError={setHasError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          {/* calling onSubmit at the <form> level instead of the button level ensures that
            the form can be submitted not only when the submit button is clicked but also
            when the user presses the Enter key while focusing on any input within the form.
            This is more ideal because it works with keyboard actions and ensures accessibility */}
          <Button autoFocus type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
