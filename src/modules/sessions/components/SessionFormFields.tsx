import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import React from "react";
import Box from "@mui/material/Box";
import dayjs, { Dayjs } from "dayjs";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import utc from "dayjs/plugin/utc";

import { Class } from "../../classes";
import { CreateSessionDTO, UpdateSessionDTO } from "../dtos";
import Typography from "@mui/material/Typography";

dayjs.extend(utc);

export interface ISessionFormFieldsProps {
  session: CreateSessionDTO | UpdateSessionDTO;
  setFormData: React.Dispatch<
    React.SetStateAction<CreateSessionDTO | UpdateSessionDTO>
  >;
  classes: Class[];
  setHasError: (hasError: boolean) => void;
}

const SessionFormFields = ({
  session,
  setFormData,
  classes,
  setHasError,
}: ISessionFormFieldsProps) => {
  const { classId, date, startTime, endTime, studentIds } = session;

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    validateForm();
  }, [session]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (hasEmptyOrInvalidTimeValues()) {
      newErrors.startTimeEndTime = "Start Time and End Time must be filled";
    }

    setErrors(newErrors);
    setHasError(Object.keys(newErrors).length > 0);
  };

  function hasEmptyOrInvalidTimeValues() {
    return (
      !startTime ||
      !endTime ||
      startTime === "Invalid Date" ||
      endTime === "Invalid Date"
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleClassChange = (event: SelectChangeEvent<number>) => {
    const value = parseInt(event.target.value as string, 10);
    handleInputChange("classId", value || 0);
  };

  return (
    <>
      {/* <DatePicker
        label="Session Date"
        format="YYYY-MM-DD"
        value={date ? dayjs(date).local() : null}
        onChange={handleDateChange}
        sx={{ marginTop: "6px", width: "100%" }}
        slotProps={{
          textField: {
            required: true,
          },
        }}
      /> */}
      <Box mt="6px">
        <FormControl fullWidth>
          <InputLabel id="select-label">Assign to a class</InputLabel>
          <Select
            fullWidth
            required
            variant="outlined"
            id="class"
            name="class"
            label={"Assign to a class"}
            labelId="class-select-label"
            margin="dense"
            value={classId || ""}
            onChange={handleClassChange}
          >
            {classes &&
              classes.map((item: Class) => (
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
            value={startTime ? dayjs(startTime).local() : null}
            onChange={(dateTime) => handleInputChange("startTime", dateTime)}
          />
          <DateTimePicker
            label="End Time"
            slotProps={{
              textField: {
                required: true,
              },
            }}
            value={endTime ? dayjs(endTime).local() : null}
            onChange={(dateTime) => handleInputChange("endTime", dateTime)}
          />
        </Stack>
        {errors.startTimeEndTime && (
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
            {errors.startTimeEndTime}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default SessionFormFields;
