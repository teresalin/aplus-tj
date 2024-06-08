import { FormEvent, FormEventHandler } from "react";
import { Dayjs } from "dayjs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import useSWR from "swr";

import { Assignment } from "../types";
import AssignmentFormFields from "./AssignmentFormFields";
import fetcher from "../../../../utils/fetcher";

export interface IUpdateAssignmentDialogProps {
  assignment: Assignment | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Assignment) => Promise<void>;
}

export default function UpdateAssignmentDialog({
  assignment,
  open,
  onClose,
  onSubmit,
}: IUpdateAssignmentDialogProps) {
  const [formData, setFormData] = React.useState({} as Assignment);
  const { data } = useSWR(open ? "/api/classes" : null, fetcher);
  const classes = data || [];

  React.useEffect(() => {
    if (open && assignment) {
      setFormData(assignment);
    }
  }, [assignment]);

  const handleInputChange = (
    field: string,
    value: string | Date | Dayjs | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog disablePortal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update Assignment</DialogTitle>
        <DialogContent>
          <AssignmentFormFields
            assignment={formData}
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
  );
}
