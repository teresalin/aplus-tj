"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

import type { Grade } from "@/modules/grades";
import type { Student } from "@/modules/persons/students";
import StudentFormFields, {
  emptyStudentFormValues,
  toStudentFormValues,
  type StudentFormValues,
} from "./StudentFormFields";

export interface IUpdateStudentDialogProps {
  existingStudent: Student;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormValues) => Promise<void>;
  grades: Grade[];
}

export default function UpdateStudentDialog({
  existingStudent,
  open,
  onClose,
  onSubmit,
  grades,
}: IUpdateStudentDialogProps) {
  const [formData, setFormData] = React.useState(emptyStudentFormValues);

  // Start from the latest student data each time the dialog opens.
  React.useEffect(() => {
    if (open) {
      setFormData(toStudentFormValues(existingStudent));
    }
  }, [open, existingStudent]);

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Dialog disablePortal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update Student</DialogTitle>
        <DialogContent>
          <StudentFormFields
            student={formData}
            setFormData={setFormData}
            grades={grades}
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
