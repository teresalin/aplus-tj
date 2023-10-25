import * as React from "react";
import { FormEvent, FormEventHandler } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import useSWR from "swr";

import fetcher from "../../../utils/fetcher";
import { Class } from "../../../pages/api/classes";

export interface INewAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit;
}

export default function NewAssignmentDialog({
  open,
  onClose,
  onSubmit,
}: INewAssignmentDialogProps) {
  const [editedData, setEditedData] = React.useState({
    assignmentName: "",
    dueDate: "",
    classId: 0,
    description: "",
  });
  const { data } = useSWR("/api/classes", fetcher);
  const classes = data || [];

  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(editedData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Dialog disablePortal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New assignment</DialogTitle>
          <DialogContent>
            <TextField
              id="assignmentName"
              name="assignmentName"
              label="Assignment Name"
              type="text"
              variant="outlined"
              margin="dense"
              required
              fullWidth
              value={editedData.assignmentName}
              onChange={handleInputChange}
            />
            {/* TODO format date in yyyy-mm-dd format */}
            <TextField
              id="dueDate"
              name="dueDate"
              label="Due Date"
              type="date"
              variant="outlined"
              margin="dense"
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={editedData.dueDate}
              onChange={handleInputChange}
            />
            <TextField
              id="classId"
              name="classId"
              label="Assign to a class"
              margin="dense"
              required
              select
              fullWidth
              value={editedData.classId || ""}
              onChange={handleInputChange}
            >
              {classes.map((item: Class) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.className}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="description"
              name="description"
              label="Description"
              type="text"
              variant="outlined"
              margin="dense"
              multiline
              fullWidth
              maxRows={3}
              value={editedData.description}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button autoFocus type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
