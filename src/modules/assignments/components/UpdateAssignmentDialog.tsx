import React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useSWR, { mutate } from "swr";

import { Assignment } from "../types";
import { assignmentToUpdateAssignmentDTO } from "../assignment.transformers";
import { Class } from "../../classes";
import { UpdateAssignmentDTO } from "../dtos";
import AssignmentFormFields from "./AssignmentFormFields";
import fetcher from "../../../../utils/fetcher";

export interface IUpdateAssignmentDialogProps {
  existingAssignment: Assignment | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateAssignmentDTO, resetForm: () => void) => Promise<void>;
}

export default function UpdateAssignmentDialog({
  existingAssignment,
  open,
  onClose,
  onSubmit,
}: IUpdateAssignmentDialogProps) {
  const initialAssignmentState = {} as UpdateAssignmentDTO;
  const [formData, setFormData] = React.useState(initialAssignmentState);

  const { data, error, isLoading } = useSWR<Class[]>("/api/classes", fetcher);
  const classes = data || [];

  React.useEffect(() => {
    if (open && existingAssignment) {
      mutate(`/api/assignments/${existingAssignment.id}`).then(() => {
        setFormData(assignmentToUpdateAssignmentDTO(existingAssignment));
      });
    }
  }, [open, existingAssignment]);

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    await onSubmit(formData as UpdateAssignmentDTO, () =>
      setFormData(initialAssignmentState)
    );
  };

  const handleClose = () => {
    onClose();
    setFormData(initialAssignmentState);
  };

  return (
    <Dialog disablePortal open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update Assignment</DialogTitle>
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
                  assignment={formData}
                  setFormData={setFormData}
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
