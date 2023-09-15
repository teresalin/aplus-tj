import { formatDate } from "../../../utils/formatDate";
import { FormEvent, FormEventHandler, useState } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import useSWR from "swr";

import fetcher from "../../../utils/fetcher";
import { Class } from "../../../pages/api/classes";

export interface IEditAssignmentDialogProps {
  existingData;
  open: boolean;
  onClose: () => void;
  onSave;
}

export default function EditAssignmentDialog({
  existingData,
  open,
  onClose,
  onSave,
}: IEditAssignmentDialogProps) {
  const [editedData, setEditedData] = useState(existingData);
  const { data } = useSWR("/api/classes", fetcher);
  const classes = data || ([] as Class[]);

  React.useEffect(() => {
    setEditedData(existingData);
  }, [existingData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(`name: ${name}`);
    console.log(`value: ${value}`);
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    onSave(editedData);
  };

  return (
    <>
      {editedData && (
        <Dialog disablePortal open={open} onClose={onClose}>
          <form onSubmit={handleSubmit}>
            <DialogTitle>New assignment</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                required
                id="assignmentName"
                name="assignmentName"
                label="Assignment Name"
                type="text"
                variant="outlined"
                margin="dense"
                value={editedData.assignmentName}
                onChange={handleInputChange}
              />
              {/* TODO format date in yyyy-mm-dd format */}
              <TextField
                fullWidth
                required
                id="dueDate"
                name="dueDate"
                label="Due Date"
                type="date"
                variant="outlined"
                margin="dense"
                InputLabelProps={{ shrink: true }}
                value={dayjs(editedData.dueDate).format("YYYY-MM-DD")}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                required
                id="classId"
                name="classId"
                label="Assign to a class"
                margin="dense"
                value={editedData.classId}
                select
                onChange={handleInputChange}
              >
                {classes.map((item: Class) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.className}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                required
                id="description"
                name="description"
                label="Description"
                type="text"
                variant="outlined"
                margin="dense"
                value={editedData.description}
                onChange={handleInputChange}
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
      )}
    </>
  );
}
