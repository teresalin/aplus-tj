import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
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
  const [formData, setFormData] =
    React.useState<UpdateStudentDTO>(initialStudentState);

  const { data, error, isLoading } = useSWR<Grade[]>("/api/grades", fetcher);
  const grades = data || [];

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
    setFormData(initialStudentState);
  };

  return (
    formData && (
      <Dialog disablePortal open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Update Student</DialogTitle>
          <DialogContent>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <>
                {error && (
                  <Alert severity="error">
                    Failed to load role data: {error.message}
                  </Alert>
                )}
                {!error && (
                  <StudentFormFields
                    student={formData}
                    setFormData={setFormData}
                    grades={grades}
                  />
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button autoFocus type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  );
}
