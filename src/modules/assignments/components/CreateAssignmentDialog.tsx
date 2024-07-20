import React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useSWR from "swr";

import { Class } from "../../classes";
import { CreateAssignmentDTO } from "../dtos";
import AssignmentFormFields from "./AssignmentFormFields";
import fetcher from "../../../../utils/fetcher";

export interface ICreateAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssignmentDTO, resetForm: () => void) => Promise<void>;
}

export default function CreateAssignmentDialog({
  open,
  onClose,
  onSubmit,
}: ICreateAssignmentDialogProps) {
  const initialAssignmentState = {} as CreateAssignmentDTO;
  const [newAssignment, setNewAssignment] = React.useState(
    {} as CreateAssignmentDTO
  );
  const { data, error, isLoading } = useSWR<Class[]>("/api/classes", fetcher);
  const classes = data || [];

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    await onSubmit(newAssignment, () =>
      setNewAssignment(initialAssignmentState)
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New assignment</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              {error && (
                <Alert severity="error">
                  Failed to load class data: {error.message}
                </Alert>
              )}
              {!error && (
                <AssignmentFormFields
                  assignment={newAssignment}
                  setFormData={setNewAssignment}
                  classes={classes}
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
