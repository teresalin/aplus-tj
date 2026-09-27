"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

import type { Grade } from "@/modules/grades";
import StudentFormFields, {
  emptyStudentFormValues,
  type StudentFormValues,
} from "./StudentFormFields";

export interface ICreateStudentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormValues, resetForm: () => void) => Promise<void>;
  grades: Grade[];
}

export default function CreateStudentDialog({
  open,
  onClose,
  onSubmit,
  grades,
}: ICreateStudentDialogProps) {
  const [newStudent, setNewStudent] = React.useState(emptyStudentFormValues);

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    await onSubmit(newStudent, () => setNewStudent(emptyStudentFormValues));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New Student</DialogTitle>
        <DialogContent>
          <StudentFormFields
            student={newStudent}
            setFormData={setNewStudent}
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
