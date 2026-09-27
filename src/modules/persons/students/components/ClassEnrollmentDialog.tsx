"use client";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

import FormDialog from "@/components/FormDialog";
import type { ClassOption } from "@/modules/classes";

export interface ClassEnrollmentValues {
  classId: string;
  startDate: Dayjs | null;
}

const emptyEnrollment: ClassEnrollmentValues = { classId: "", startDate: null };

export interface IClassEnrollmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ClassEnrollmentValues) => Promise<void>;
  classes: ClassOption[];
}

export default function ClassEnrollmentDialog({
  open,
  onClose,
  onSubmit,
  classes,
}: IClassEnrollmentDialogProps) {
  // TODO take current classes out of the dropdown
  return (
    <FormDialog
      open={open}
      title="Manage Enrollment"
      initialValues={emptyEnrollment}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      {(values, setValues) => (
        <>
          <FormControl fullWidth margin="dense">
            <InputLabel id="class-select-label">Select Class</InputLabel>
            <Select
              fullWidth
              required
              id="classId"
              name="classId"
              labelId="class-select-label"
              label="Select Class"
              value={values.classId}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, classId: e.target.value }))
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
              value={values.startDate}
              onChange={(date) =>
                setValues((prev) => ({ ...prev, startDate: date }))
              }
              sx={{ marginTop: "8px", marginBottom: "4px", width: "100%" }}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />
          </Box>
        </>
      )}
    </FormDialog>
  );
}
