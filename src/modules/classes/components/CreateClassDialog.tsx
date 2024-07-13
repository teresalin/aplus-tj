import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import useSWR from "swr";

import { CreateClassDTO } from "../dtos";
import { Grade } from "../../grades";
import { Staff } from "../../persons/staffs";
import ClassFormFields from "./ClassFormFields";
import fetcher from "../../../../utils/fetcher";

export interface ICreateClassDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClassDTO, resetForm: () => void) => Promise<void>;
}

export default function CreateClassDialog({
  open,
  onClose,
  onSubmit,
}: ICreateClassDialogProps) {
  const initialClassState = {} as CreateClassDTO;
  const [newClass, setNewClass] = React.useState(initialClassState);
  const [hasError, setHasError] = React.useState(false);

  const {
    data: staffsData,
    error: staffsError,
    isLoading: staffsLoading,
  } = useSWR<Staff[]>("/api/persons/staffs", fetcher);
  const {
    data: gradesData,
    error: gradesError,
    isLoading: gradesLoading,
  } = useSWR<Grade[]>("/api/grades", fetcher);

  const teachers = staffsData || [];
  const grades = gradesData || [];

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    if (!hasError) {
      await onSubmit(newClass as CreateClassDTO, () =>
        setNewClass(initialClassState)
      );
    }
  };

  return (
    <Dialog disablePortal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New Class</DialogTitle>
        <DialogContent>
          {staffsLoading || gradesLoading ? (
            <CircularProgress />
          ) : (
            <>
              {staffsError && (
                <Alert severity="error">
                  Failed to load staff data: {staffsError.message}
                </Alert>
              )}
              {gradesError && (
                <Alert severity="error">
                  Failed to load grades data: {gradesError.message}
                </Alert>
              )}
              {!staffsError && !gradesError && (
                <ClassFormFields
                  classData={newClass}
                  setFormData={setNewClass}
                  grades={grades}
                  teachers={teachers}
                  setHasError={setHasError}
                />
              )}
            </>
          )}
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
