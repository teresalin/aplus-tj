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
import { TimePicker } from "@mui/x-date-pickers";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export interface INewSessionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit;
}

export default function NewSessionDialog({
  open,
  onClose,
  onSubmit,
}: INewSessionDialogProps) {
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
          <DialogTitle>New session</DialogTitle>
          <DialogContent>
            {/* TODO format date in yyyy-mm-dd format */}
            <TextField
              id="sessionDate"
              name="sessionDate"
              label="Session Date"
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
            <Stack mt={1} direction="row" spacing={1}>
              <TimePicker
                label="Start Time"
                slotProps={{ textField: { size: "small" } }}
              />
              <TimePicker
                label="End Time"
                slotProps={{ textField: { size: "small" } }}
              />
            </Stack>
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
