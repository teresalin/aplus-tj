import { Dayjs } from "dayjs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import useSWR, { mutate } from "swr";

import { Grade } from "../../../grades";

import { Student } from "../types";
import { studentToUpdateStudentDTO } from "../student.transformers";
import { UpdateStudentDTO } from "../dtos";
import fetcher from "../../../../../utils/fetcher";
import StudentFormFields from "./StudentFormFields";

export interface IUpdateStudentDialogProps {
  existingStudent: Student | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateStudentDTO, resetForm: () => void) => Promise<void>;
}

export default function UpdateStudentDialog({
  existingStudent,
  open,
  onClose,
  onSubmit,
}: IUpdateStudentDialogProps) {
  const initialStudentState = {} as UpdateStudentDTO;
  const [formData, setFormData] = React.useState(initialStudentState);
  const { data } = useSWR("/api/grades", fetcher);
  const grades = (data as Grade[]) || [];

  // Initialize form data when the dialog opens with the latest student data
  React.useEffect(() => {
    if (open && existingStudent) {
      mutate(`/api/persons/students/${existingStudent.studentId}`).then(() => {
        setFormData(studentToUpdateStudentDTO(existingStudent));
      });
    }
  }, [open, existingStudent]);

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    await onSubmit(formData as UpdateStudentDTO, () =>
      setFormData(initialStudentState)
    );
  };

  const handleClose = () => {
    onClose();
    setFormData(initialStudentState); // Clear form data on close
  };

  return (
    formData && (
      <>
        <Dialog disablePortal open={open} onClose={handleClose}>
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
      </>
    )
  );
}
