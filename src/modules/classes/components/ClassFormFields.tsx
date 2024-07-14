import { TimePicker } from "@mui/x-date-pickers";
import { Grade } from "../../grades";
import Box from "@mui/material/Box";
import dayjs, { Dayjs } from "dayjs";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { CreateClassDTO, UpdateClassDTO } from "../dtos";
import { daysOfWeek } from "../../../constants";
import { Schedule } from "../../schedules";
import { Staff } from "../../persons/staffs";

export interface IClassFormFieldsProps {
  classData: CreateClassDTO | UpdateClassDTO;
  setFormData: React.Dispatch<
    React.SetStateAction<CreateClassDTO | UpdateClassDTO>
  >;
  grades: Grade[];
  teachers: Staff[];
  setHasError: (hasError: boolean) => void;
}

type FieldName = "gradeId" | "teacherId";

const ClassFormFields = ({
  classData,
  setFormData,
  grades,
  teachers,
  setHasError,
}: IClassFormFieldsProps) => {
  const { name, gradeId, teacherId, capacity, schedules } = classData;

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    validateForm();
  }, [classData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (capacity && isNaN(Number(capacity))) {
      newErrors.capacity = "Capacity must be a number";
    }

    if (hasEmptyOrInvalidTimeValues()) {
      newErrors.schedules = "All schedule times must be filled";
    }

    setErrors(newErrors);
    setHasError(Object.keys(newErrors).length > 0);
  };

  // Implemented custom validation since frm is unable to detect the built-in required field in TimePicker
  // https://github.com/mui/mui-x/issues/7633
  function hasEmptyOrInvalidTimeValues() {
    return classData.schedules?.some(
      (schedule) =>
        !schedule.startTime ||
        !schedule.endTime ||
        schedule.startTime === "Invalid Date" ||
        schedule.endTime === "Invalid Date"
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSelectChange =
    (field: FieldName) => (event: SelectChangeEvent<number>) => {
      const value = parseInt(event.target.value as string, 10);
      handleInputChange(field, value || 0);
    };

  const handleSwitchChange = (day: string) => {
    const existingSchedule = schedules?.find(
      (schedule) => schedule.dayOfWeek === day
    );
    if (existingSchedule) {
      handleInputChange(
        "schedules",
        schedules?.filter((schedule) => schedule.dayOfWeek !== day)
      );
    } else {
      handleInputChange("schedules", [
        ...(schedules || []),
        { dayOfWeek: day, startTime: "", endTime: "" },
      ] as Schedule[]);
    }
  };

  const handleTimeChange = (
    field: string,
    day: string,
    newValue: Dayjs | null
  ) => {
    handleInputChange(
      "schedules",
      schedules?.map((schedule) => {
        if (schedule.dayOfWeek === day) {
          return {
            ...schedule,
            [field]: newValue ? newValue.format("HH:mm:ss") : "00:00:00",
          };
        }
        return schedule;
      })
    );
  };

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
          value={name || ""}
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
              value={gradeId || ""}
              onChange={handleSelectChange("gradeId")}
            >
              {grades &&
                grades.map((grade: Grade) => (
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
              value={teacherId || ""}
              onChange={handleSelectChange("teacherId")}
            >
              {teachers &&
                teachers.map((teacher: Staff) => (
                  <MenuItem key={teacher.staffId} value={teacher.staffId}>
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
            value={capacity || ""}
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
        {classData &&
          daysOfWeek.map((day) => (
            <Box key={day} my={1}>
              <Grid container item key={day} spacing={1} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        required={schedules?.length === 0}
                        checked={
                          !!schedules?.find(
                            (schedule) => schedule.dayOfWeek === day
                          )
                        }
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
                        required: !!schedules?.find(
                          (schedule) => schedule.dayOfWeek === day
                        ),
                      },
                    }}
                    value={
                      !!schedules?.find(
                        (schedule) => schedule.dayOfWeek === day
                      )
                        ? dayjs(
                            schedules.find(
                              (schedule) => schedule.dayOfWeek === day
                            )?.startTime,
                            "HH:mm:ss"
                          )
                        : null
                    }
                    onChange={(newValue: Dayjs | null) =>
                      handleTimeChange("startTime", day, newValue)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TimePicker
                    label="End Time"
                    slotProps={{
                      textField: {
                        size: "small",
                      },
                    }}
                    value={
                      !!schedules?.find(
                        (schedule) => schedule.dayOfWeek === day
                      )
                        ? dayjs(
                            schedules.find(
                              (schedule) => schedule.dayOfWeek === day
                            )?.endTime,
                            "HH:mm:ss"
                          )
                        : null
                    }
                    onChange={(newValue: Dayjs | null) =>
                      handleTimeChange("endTime", day, newValue)
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
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
