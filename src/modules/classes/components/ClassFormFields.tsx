"use client";

import { TimePicker } from "@mui/x-date-pickers";
import Box from "@mui/material/Box";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs, { Dayjs } from "dayjs";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { daysOfWeek, type DayOfWeek } from "@/constants";
import type { Grade } from "@/modules/grades";
import type { StaffOption } from "@/modules/persons/staffs";
import type { ClassDetail, ScheduleInput } from "@/modules/classes";

dayjs.extend(customParseFormat);

const TIME_FORMAT = "HH:mm:ss";

export interface ClassFormValues {
  name: string;
  gradeId: string;
  teacherId: string;
  capacity: string;
  schedules: ScheduleInput[];
}

export const emptyClassFormValues: ClassFormValues = {
  name: "",
  gradeId: "",
  teacherId: "",
  capacity: "",
  schedules: [],
};

export function toClassFormValues(cls: ClassDetail): ClassFormValues {
  return {
    name: cls.name,
    gradeId: cls.grade.id,
    teacherId: cls.teacher.id,
    capacity: cls.capacity == null ? "" : String(cls.capacity),
    schedules: cls.schedules.map(({ dayOfWeek, startTime, endTime }) => ({
      dayOfWeek,
      startTime,
      endTime,
    })),
  };
}

function validateClassForm(values: ClassFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (values.capacity && isNaN(Number(values.capacity))) {
    errors.capacity = "Capacity must be a number";
  }

  // Custom validation since forms can't detect the built-in required field in TimePicker
  // https://github.com/mui/mui-x/issues/7633
  const hasEmptyTimes = values.schedules.some(
    (schedule) =>
      !schedule.startTime ||
      !schedule.endTime ||
      schedule.startTime === "Invalid Date" ||
      schedule.endTime === "Invalid Date",
  );
  if (hasEmptyTimes) {
    errors.schedules = "All schedule times must be filled";
  }

  return errors;
}

export function isClassFormValid(values: ClassFormValues): boolean {
  return Object.keys(validateClassForm(values)).length === 0;
}

export interface IClassFormFieldsProps {
  classData: ClassFormValues;
  setFormData: React.Dispatch<React.SetStateAction<ClassFormValues>>;
  grades: Grade[];
  teachers: StaffOption[];
}

const ClassFormFields = ({
  classData,
  setFormData,
  grades,
  teachers,
}: IClassFormFieldsProps) => {
  const { name, gradeId, teacherId, capacity, schedules } = classData;

  const errors = validateClassForm(classData);

  const handleInputChange = <K extends keyof ClassFormValues>(
    field: K,
    value: ClassFormValues[K],
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const findSchedule = (day: DayOfWeek) =>
    schedules.find((schedule) => schedule.dayOfWeek === day);

  const handleSwitchChange = (day: DayOfWeek) => {
    if (findSchedule(day)) {
      handleInputChange(
        "schedules",
        schedules.filter((schedule) => schedule.dayOfWeek !== day),
      );
    } else {
      handleInputChange("schedules", [
        ...schedules,
        { dayOfWeek: day, startTime: "", endTime: "" },
      ]);
    }
  };

  const handleTimeChange = (
    field: "startTime" | "endTime",
    day: DayOfWeek,
    newValue: Dayjs | null,
  ) => {
    handleInputChange(
      "schedules",
      schedules.map((schedule) =>
        schedule.dayOfWeek === day
          ? {
              ...schedule,
              [field]: newValue ? newValue.format(TIME_FORMAT) : "00:00:00",
            }
          : schedule,
      ),
    );
  };

  const toPickerTime = (time: string | undefined) =>
    time ? dayjs(time, TIME_FORMAT) : null;

  return (
    <>
      <Box>
        <Typography variant="body2" display="block" gutterBottom>
          Class Information
        </Typography>
        <TextField
          required
          margin="dense"
          id="name"
          name="name"
          label="Name"
          type="text"
          value={name}
          fullWidth
          variant="outlined"
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        <Box mt="16px">
          <FormControl fullWidth>
            <InputLabel id="grade-select-label">Select a grade</InputLabel>
            <Select
              fullWidth
              required
              variant="outlined"
              id="grade"
              name="grade"
              label={"Select a grade"}
              labelId="grade-select-label"
              margin="dense"
              value={gradeId}
              onChange={(e) => handleInputChange("gradeId", e.target.value)}
            >
              {grades.map((grade) => (
                <MenuItem key={grade.id} value={grade.id}>
                  {grade.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mt="20px">
          <FormControl fullWidth>
            <InputLabel id="teacher-select-label">Select a teacher</InputLabel>
            <Select
              fullWidth
              required
              variant="outlined"
              id="teacher"
              name="teacher"
              label={"Select a teacher"}
              labelId="teacher-select-label"
              margin="dense"
              value={teacherId}
              onChange={(e) => handleInputChange("teacherId", e.target.value)}
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mt="12px">
          <TextField
            required
            margin="dense"
            id="capacity"
            name="capacity"
            label="Student Capacity"
            // MUI: We do not recommend using type="number" with a Text Field due to potential usability issues:
            // it allows certain non-numeric characters ('e', '+', '-', '.') and silently discards others
            // the functionality of scrolling to increment/decrement the number can cause accidental and hard-to-notice changes
            // type="number"
            placeholder="Enter a number"
            fullWidth
            variant="outlined"
            value={capacity}
            onChange={(e) => handleInputChange("capacity", e.target.value)}
            error={!!errors.capacity}
            helperText={errors.capacity}
          />
        </Box>
      </Box>
      <Box mt="16px">
        <Typography variant="body2" display="block" gutterBottom>
          Class Schedule
        </Typography>
        {daysOfWeek.map((day) => {
          const schedule = findSchedule(day);
          return (
            <Box key={day} my={1}>
              <Grid container item spacing={1} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        required={schedules.length === 0}
                        checked={!!schedule}
                        onChange={() => handleSwitchChange(day)}
                      />
                    }
                    label={day}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TimePicker
                    label="Start Time"
                    slotProps={{
                      textField: {
                        size: "small",
                        required: !!schedule,
                      },
                    }}
                    value={toPickerTime(schedule?.startTime)}
                    onChange={(newValue) =>
                      handleTimeChange("startTime", day, newValue)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  {/* TODO store these times as timestamptz */}
                  <TimePicker
                    label="End Time"
                    slotProps={{
                      textField: {
                        size: "small",
                      },
                    }}
                    value={toPickerTime(schedule?.endTime)}
                    onChange={(newValue) =>
                      handleTimeChange("endTime", day, newValue)
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          );
        })}
        {errors.schedules && (
          <Typography
            color="error"
            // Note: probably want to remove this in the future since it is not good practice
            sx={{
              fontSize: "0.75em",
              letterSpacing: "0.03333em",
              fontWeight: "400",
            }}
          >
            {errors.schedules}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default ClassFormFields;
