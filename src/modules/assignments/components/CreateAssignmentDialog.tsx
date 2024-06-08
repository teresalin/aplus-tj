import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useSWR from "swr";

import { Assignment } from "../types";
import { Dayjs } from "dayjs";
import AssignmentFormFields from "./AssignmentFormFields";
import fetcher from "../../../../utils/fetcher";

export interface ICreateAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Assignment) => Promise<void>;
}

export default function CreateAssignmentDialog({
  open,
  onClose,
  onSubmit,
}: ICreateAssignmentDialogProps) {
  const [newAssignment, setNewAssignment] = React.useState({} as Assignment);
  const { data } = useSWR("/api/classes", fetcher);
  const classes = data || [];

  const handleInputChange = (
    field: string,
    value: string | Date | Dayjs | null
  ) => {
    setNewAssignment((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(newAssignment);
  };

  return (
    <>
      <Dialog disablePortal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New assignment</DialogTitle>
          <DialogContent>
            <AssignmentFormFields
              assignment={newAssignment}
              onChange={handleInputChange}
              classes={classes}
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
  );
}
