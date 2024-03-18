import { DatePicker } from "@mui/x-date-pickers";
import { FormEvent, FormEventHandler } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import useSWR from "swr";

import { Assignment } from "../../../pages/api/assignments";
import { Class } from "../../../pages/api/classes";
import fetcher from "../../../utils/fetcher";

export interface IUpdateCreateAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit;
}

export default function UpdateCreateAssignmentDialog({
  open,
  onClose,
  onSubmit,
}: IUpdateCreateAssignmentDialogProps) {
  // TODO create two functions, one for update and one for create and make the form components reusable
  const [newAssignment, setNewAssignment] = React.useState({} as Assignment);
  const { data } = useSWR("/api/classes", fetcher);
  const classes = data || [];

  const handleInputChange = (field, value) => {
    setNewAssignment((prevData) => ({
      ...prevData,
      [field]: field === "classId" ? Number(value) : value,
    }));
  };

  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(newAssignment);
  };

  return (
    <>
      <Dialog disablePortal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New assignment</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              required
              id="name"
              name="name"
              label="Assignment Name"
              type="text"
              variant="outlined"
              margin="dense"
              value={newAssignment.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <DatePicker
              label="Due Date"
              format="YYYY-MM-DD"
              value={newAssignment.dueDate}
              onChange={(date) => handleInputChange("dueDate", date)}
              sx={{ marginTop: "8px", marginBottom: "4px", width: "100%" }}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />
            <Select
              fullWidth
              required
              id="classId"
              name="classId"
              label="Assign to a class"
              margin="dense"
              value={
                newAssignment.classInfo?.id
                  ? newAssignment.classInfo.id.toString()
                  : ""
              }
              onChange={(e) => handleInputChange("classId", e.target.value)}
            >
              {classes &&
                classes.map((item: Class) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              type="text"
              variant="outlined"
              margin="dense"
              value={newAssignment.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              multiline
              maxRows={3}
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
