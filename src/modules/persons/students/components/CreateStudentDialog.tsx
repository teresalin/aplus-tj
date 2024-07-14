import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import useSWR from "swr";

import { CreateStudentDTO } from "../dtos/create-student.dto";
import { Grade } from "../../../grades";
import fetcher from "../../../../../utils/fetcher";
import StudentFormFields from "./StudentFormFields";

export interface ICreateStudentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentDTO, resetForm: () => void) => Promise<void>;
}

export default function CreateStudentDialog({
  open,
  onClose,
  onSubmit,
}: ICreateStudentDialogProps) {
  const initialStudentState = {} as CreateStudentDTO;
  const [newStudent, setNewStudent] = React.useState(initialStudentState);

  const { data, error, isLoading } = useSWR<Grade[]>("/api/grades", fetcher);
  const grades = data || [];

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault(); // Prevent default form submission behavior
    await onSubmit(newStudent, () => setNewStudent(initialStudentState));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New Student</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              {error && (
                <Alert severity="error">
                  Failed to load grade data: {error.message}
                </Alert>
              )}
              {!error && (
                <StudentFormFields
                  student={newStudent}
                  setFormData={setNewStudent}
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
  );
}
