import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

export interface IClassEnrollmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit;
  availableClasses;
  studentClasses;
}

export default function ManageEnrollmentDialog({
  open,
  onClose,
  onSubmit,
  availableClasses,
  studentClasses,
}: IClassEnrollmentDialogProps) {
  const [selectedClass, setSelectedClass] = useState("");
  const [enroll, setEnroll] = useState(true); // Assume true means enroll, false means remove

  const handleClassChange = (event) => setSelectedClass(event.target.value);
  const handleEnrollChange = (event) => setEnroll(event.target.checked);

  const handleSubmit = () => {
    onSubmit({ classId: selectedClass, action: enroll ? "add" : "remove" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Manage Enrollment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="class-select-label">Select Class</InputLabel>
            <Select
              labelId="class-select-label"
              value={selectedClass}
              onChange={handleClassChange}
            >
              {availableClasses.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox checked={enroll} onChange={handleEnrollChange} />
            }
            label="Enroll in this class"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button autoFocus type="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
