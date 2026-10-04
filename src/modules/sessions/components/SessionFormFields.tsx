"use client";

import type { SessionStatus } from "@prisma/client";
import { DateTimePicker } from "@mui/x-date-pickers";
import React from "react";
import Box from "@mui/material/Box";
import dayjs, { type Dayjs } from "dayjs";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { ClassOption } from "@/modules/classes";
import type { StaffOption } from "@/modules/persons/staffs";
import { SESSION_STATUSES, type Session } from "@/modules/sessions";

export interface SessionFormValues {
  classId: string;
  /** Blank when creating means the class's teacher. */
  teacherId: string;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
  status: SessionStatus;
  cancellationReason: string;
  changeReason: string;
}

export const emptySessionFormValues: SessionFormValues = {
  classId: "",
  teacherId: "",
  startTime: null,
  endTime: null,
  status: "Scheduled",
  cancellationReason: "",
  changeReason: "",
};

export function toSessionFormValues(session: Session): SessionFormValues {
  return {
    classId: session.class.id,
    teacherId: session.teacher.id,
    startTime: dayjs(session.startTime),
    endTime: dayjs(session.endTime),
    status: session.status,
    cancellationReason: session.cancellationReason ?? "",
    changeReason: "",
  };
}

/** Request body for creating a session; a blank teacher means the class's teacher. */
export function toCreateSessionPayload(values: SessionFormValues) {
  return {
    classId: values.classId,
    teacherId: values.teacherId || undefined,
    startTime: values.startTime?.toISOString(),
    endTime: values.endTime?.toISOString(),
  };
}

/** Request body for updating a session; a session's class can't change. */
export function toUpdateSessionPayload(values: SessionFormValues) {
  return {
    teacherId: values.teacherId,
    startTime: values.startTime?.toISOString(),
    endTime: values.endTime?.toISOString(),
    status: values.status,
    cancellationReason: values.cancellationReason,
    changeReason: values.changeReason,
  };
}

/** Pickers can hold partial input, so completeness is checked explicitly. */
export function hasSessionTimes(values: SessionFormValues): boolean {
  return Boolean(values.startTime?.isValid() && values.endTime?.isValid());
}

export interface ISessionFormFieldsProps {
  mode: "create" | "edit";
  session: SessionFormValues;
  setFormData: React.Dispatch<React.SetStateAction<SessionFormValues>>;
  classes: ClassOption[];
  teachers: StaffOption[];
}

const SessionFormFields = ({
  mode,
  session,
  setFormData,
  classes,
  teachers,
}: ISessionFormFieldsProps) => {
  const {
    classId,
    teacherId,
    startTime,
    endTime,
    status,
    cancellationReason,
    changeReason,
  } = session;
  const editing = mode === "edit";

  const handleInputChange = <K extends keyof SessionFormValues>(
    field: K,
    value: SessionFormValues[K],
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
      <Box mt="6px">
        <FormControl fullWidth disabled={editing}>
          <InputLabel id="class-select-label">Assign to a class</InputLabel>
          <Select
            fullWidth
            required
            variant="outlined"
            id="class"
            name="class"
            label={"Assign to a class"}
            labelId="class-select-label"
            margin="dense"
            value={classId}
            onChange={(e) => handleInputChange("classId", e.target.value)}
          >
            {classes.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          {editing && (
            <FormHelperText>
              A session&apos;s class can&apos;t change, since its attendance
              belongs to that class.
            </FormHelperText>
          )}
        </FormControl>
      </Box>
      <Box mt="20px">
        <FormControl fullWidth>
          <InputLabel id="teacher-select-label">Teacher</InputLabel>
          <Select
            fullWidth
            required={editing}
            variant="outlined"
            id="teacher"
            name="teacher"
            label="Teacher"
            labelId="teacher-select-label"
            value={teacherId}
            onChange={(e) => handleInputChange("teacherId", e.target.value)}
          >
            {!editing && (
              <MenuItem value="">
                <em>Class&apos;s teacher</em>
              </MenuItem>
            )}
            {teachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {editing
              ? "Choose another teacher to record a substitute."
              : "Leave blank to use the class's teacher."}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box mt="20px">
        <Stack direction="row" spacing={1}>
          <DateTimePicker
            label="Start Time"
            slotProps={{
              textField: {
                required: true,
              },
            }}
            value={startTime}
            onChange={(dateTime) => handleInputChange("startTime", dateTime)}
          />
          <DateTimePicker
            label="End Time"
            slotProps={{
              textField: {
                required: true,
              },
            }}
            value={endTime}
            onChange={(dateTime) => handleInputChange("endTime", dateTime)}
          />
        </Stack>
        {!hasSessionTimes(session) && (
          <Typography
            color="error"
            // Note: probably want to remove this in the future since it is not good practice
            sx={{
              fontSize: "0.75em",
              letterSpacing: "0.03333em",
              fontWeight: "400",
              marginTop: 1,
            }}
          >
            Start Time and End Time must be filled
          </Typography>
        )}
      </Box>
      {editing && (
        <>
          <TextField
            fullWidth
            id="changeReason"
            name="changeReason"
            label="Reason for time change"
            margin="normal"
            helperText="Saved to the session's history if you change its time."
            value={changeReason}
            onChange={(e) => handleInputChange("changeReason", e.target.value)}
          />
          <Box mt="8px">
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                fullWidth
                required
                variant="outlined"
                id="status"
                name="status"
                label="Status"
                labelId="status-select-label"
                value={status}
                onChange={(e) =>
                  handleInputChange("status", e.target.value as SessionStatus)
                }
              >
                {SESSION_STATUSES.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {status === "Cancelled" && (
            <TextField
              fullWidth
              id="cancellationReason"
              name="cancellationReason"
              label="Cancellation reason"
              margin="normal"
              value={cancellationReason}
              onChange={(e) =>
                handleInputChange("cancellationReason", e.target.value)
              }
            />
          )}
        </>
      )}
    </>
  );
};

export default SessionFormFields;
