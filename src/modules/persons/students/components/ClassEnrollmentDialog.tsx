import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
import useSWR from "swr";

import { Class, ClassStudent } from "../../../classes/types";
import fetcher from "../../../../../utils/fetcher";

export interface IClassEnrollmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit;
  studentClasses;
}

export default function ManageEnrollmentDialog({
  open,
  onClose,
  onSubmit,
  studentClasses,
}: IClassEnrollmentDialogProps) {
  const [newClassStudent, setNewClassStudent] = useState({} as ClassStudent);

  const { data } = useSWR("/api/classes", fetcher);
  // TODO take current classes out of the dropdown
  const classes = (data as Class[]) || [];

  const handleInputChange = (field, value) => {
    setNewClassStudent((prevData) => ({
      ...prevData,
      [field]: field === "classId" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit();
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
              value={
                newClassStudent.classId
                  ? newClassStudent.classId.toString()
                  : ""
              }
              onChange={(e) => handleInputChange("classId", e.target.value)}
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
              value={newClassStudent.startDate || null}
              onChange={(date) => handleInputChange("startDate", date)}
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
