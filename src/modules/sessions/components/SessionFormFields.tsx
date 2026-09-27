"use client";

import { DateTimePicker } from "@mui/x-date-pickers";
import React from "react";
import Box from "@mui/material/Box";
import dayjs, { type Dayjs } from "dayjs";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ClassOption } from "@/modules/classes";
import type { Session } from "@/modules/sessions";

export interface SessionFormValues {
  classId: string;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
}

export const emptySessionFormValues: SessionFormValues = {
  classId: "",
  startTime: null,
  endTime: null,
};

export function toSessionFormValues(session: Session): SessionFormValues {
  return {
    classId: session.class.id,
    startTime: dayjs(session.startTime),
    endTime: dayjs(session.endTime),
  };
}

/** Request body for creating or updating a session. */
export function toSessionPayload(values: SessionFormValues) {
  return {
    classId: values.classId,
    startTime: values.startTime?.toISOString(),
    endTime: values.endTime?.toISOString(),
  };
}

export interface ISessionFormFieldsProps {
  session: SessionFormValues;
  setFormData: React.Dispatch<React.SetStateAction<SessionFormValues>>;
  classes: ClassOption[];
  setHasError: (hasError: boolean) => void;
}

const SessionFormFields = ({
  session,
  setFormData,
  classes,
  setHasError,
}: ISessionFormFieldsProps) => {
  const { classId, startTime, endTime } = session;

  const hasEmptyOrInvalidTimes = !startTime?.isValid() || !endTime?.isValid();

  React.useEffect(() => {
    setHasError(hasEmptyOrInvalidTimes);
  }, [hasEmptyOrInvalidTimes, setHasError]);

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
        <FormControl fullWidth>
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
        {hasEmptyOrInvalidTimes && (
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
    </>
  );
};

export default SessionFormFields;
