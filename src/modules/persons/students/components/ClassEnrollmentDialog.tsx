"use client";

import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";
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
  Box,
} from "@mui/material";

import type { ClassOption } from "@/modules/classes";

export interface ClassEnrollmentValues {
  classId: string;
  startDate: Dayjs | null;
}

const emptyEnrollment: ClassEnrollmentValues = { classId: "", startDate: null };

export interface IClassEnrollmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClassEnrollmentValues) => void;
  classes: ClassOption[];
}

export default function ClassEnrollmentDialog({
  open,
  onClose,
  onSubmit,
  classes,
}: IClassEnrollmentDialogProps) {
  const [newEnrollment, setNewEnrollment] = React.useState(emptyEnrollment);

  // TODO take current classes out of the dropdown
  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    onSubmit(newEnrollment);
    setNewEnrollment(emptyEnrollment);
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Manage Enrollment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="class-select-label">Select Class</InputLabel>
            <Select
              fullWidth
              required
              id="classId"
              name="classId"
              labelId="class-select-label"
              label="Select Class"
              margin="dense"
              value={newEnrollment.classId}
              onChange={(e) =>
                setNewEnrollment((prev) => ({
                  ...prev,
                  classId: e.target.value,
                }))
              }
            >
              {classes.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={0.5}>
            <DatePicker
              label="Start Date"
              format="YYYY-MM-DD"
              value={newEnrollment.startDate}
              onChange={(date) =>
                setNewEnrollment((prev) => ({ ...prev, startDate: date }))
              }
              sx={{ marginTop: "8px", marginBottom: "4px", width: "100%" }}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />
          </Box>
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
