"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

import type { ClassDetail } from "@/modules/classes";
import type { Grade } from "@/modules/grades";
import type { StaffOption } from "@/modules/persons/staffs";
import ClassFormFields, {
  emptyClassFormValues,
  toClassFormValues,
  type ClassFormValues,
} from "./ClassFormFields";

export interface IUpdateClassDetailsDialogProps {
  existingClass: ClassDetail;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormValues) => Promise<void>;
  grades: Grade[];
  teachers: StaffOption[];
}

export default function UpdateClassDetailsDialog({
  existingClass,
  open,
  onClose,
  onSubmit,
  grades,
  teachers,
}: IUpdateClassDetailsDialogProps) {
  const [formData, setFormData] = React.useState(emptyClassFormValues);
  const [hasError, setHasError] = React.useState(false);

  // Start from the latest class data each time the dialog opens.
  React.useEffect(() => {
    if (open) {
      setFormData(toClassFormValues(existingClass));
    }
  }, [open, existingClass]);

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    if (!hasError) {
      await onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update Class Details</DialogTitle>
        <DialogContent>
          <ClassFormFields
            classData={formData}
            setFormData={setFormData}
            grades={grades}
            teachers={teachers}
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
