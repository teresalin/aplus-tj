import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useRouter } from "next/router";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import dayjs, { Dayjs } from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import { Class, ClassDetail } from "../types";
import { Grade } from "../../../../pages/api/grades";
import { Staff } from "../../person/staff/types";
import fetcher from "../../../../utils/fetcher";

const dayOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function RedBar() {
  return (
    <Box
      sx={{
        height: 20,
      }}
    />
  );
}

export interface IUpdateClassDetailsDialogProps {
  existingClass: ClassDetail;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClassDetail) => Promise<void>;
}

export default function UpdateClassDetailsDialogProps({
  existingClass,
  open,
  onClose,
  onSubmit,
}: IUpdateClassDetailsDialogProps) {
  const classID = useRouter().query.class_id;
  const [formData, setFormData] = React.useState({} as ClassDetail);
  const { data: staffsData, error: staffsError } = useSWR(
    "/api/persons/staffs",
    fetcher
  );
  const { data: gradesData, error: gradesError } = useSWR(
    "/api/grades",
    fetcher
  );
  const teachers = staffsData || [];
  const grades = gradesData || [];

  React.useEffect(() => {
    setFormData(existingClass);
  }, [existingClass]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };

  const handleTeacherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const selectedTeacher = teachers.find(
      (teacher) => teacher.staffId === value
    );
    setFormData((prevData) => ({
      ...prevData,
      teacher: selectedTeacher || {},
    }));
  };

  const handleGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // Find the selected grade object from your grades array
    const selectedGrade = grades.find((grade) => grade.id === value);
    setFormData((prevData) => ({
      ...prevData,
      grade: selectedGrade || {},
    }));
  };

  const handleSwitchChange = (day: string) => {
    setFormData((prevData) => {
      const existingScheduleIndex = prevData.schedules.findIndex(
        (schedule) => schedule.dayOfWeek === day
      );

      if (existingScheduleIndex === -1) {
        // If the schedule doesn't exist, add a new schedule with default values
        const newSchedule = {
          dayOfWeek: day,
          startTime: "",
          endTime: "",
        };
        return {
          ...prevData,
          schedules: [...prevData.schedules, newSchedule],
        };
      } else {
        // If the schedule exists, remove it
        const updatedSchedules = prevData.schedules.filter(
          (schedule) => schedule.dayOfWeek !== day
        );
        return {
          ...prevData,
          schedules: updatedSchedules,
        };
      }
    });
  };

  const handleTimeChange = (
    field: string,
    day: string,
    newValue: Dayjs | null
  ) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        schedules: prevData.schedules.map((schedule) => {
          if (schedule.dayOfWeek === day) {
            return {
              ...schedule,
              [field]: newValue
                ? dayjs(newValue).format("HH:mm:ss")
                : "00:00:00",
            };
          }
          return schedule;
        }),
      };
    });
  };

  // Custom validation is required since form is unable to detected the required field in TimePicker
  function hasEmptyOrInvalidTimeValues() {
    return formData.schedules.some(
      (schedule) =>
        !schedule.startTime ||
        !schedule.endTime ||
        schedule.startTime === "Invalid Date" ||
        schedule.endTime === "Invalid Date"
    );
  }

  // TODO fix submit
  const handleSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    if (hasEmptyOrInvalidTimeValues()) {
      alert("Please fill out all time values.");
    } else {
      onSubmit(formData);
    }
  };

  return (
    formData && (
      <div>
        <Dialog disablePortal open={open} onClose={onClose}>
          <form onSubmit={handleSubmit}>
            <DialogTitle>Update Class Details</DialogTitle>
            <DialogContent>
              <Typography variant="body2" display="block">
                Class Information
              </Typography>
              <TextField
                required
                margin="dense"
                id="name"
                name="name"
                label="Name"
                type="text"
                defaultValue={formData.name || ""}
                fullWidth
                variant="outlined"
                onChange={handleInputChange}
              />
              <Box mt="8px">
                <FormControl fullWidth>
                  <InputLabel id="grade-select-label">
                    Select a grade
                  </InputLabel>
                  <Select
                    fullWidth
                    required
                    variant="outlined"
                    id="grade"
                    name="grade"
                    label={"Select a grade"}
                    labelId="grade-select-label"
                    margin="dense"
                    value={formData.grade?.id || ""}
                    onChange={handleGradeChange}
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
              <Box mt="12px">
                <FormControl fullWidth>
                  <InputLabel id="teacher-select-label">
                    Select a teacher
                  </InputLabel>
                  <Select
                    fullWidth
                    required
                    variant="outlined"
                    id="teacher"
                    name="teacher"
                    label={"Select a teacher"}
                    labelId="teacher-select-label"
                    margin="dense"
                    value={formData.teacher?.staffId || ""}
                    onChange={handleTeacherChange}
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
              <Box mt="4px">
                <TextField
                  required
                  margin="dense"
                  id="capacity"
                  name="capacity"
                  label="Student Capacity"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.capacity || ""}
                  onChange={handleInputChange}
                />
              </Box>
              <RedBar />
              <Typography variant="body2" display="block">
                Class Schedule
              </Typography>
              {existingClass &&
                dayOfWeek.map((day) => (
                  <Box key={day} my={1}>
                    <Grid
                      container
                      item
                      key={day}
                      spacing={1}
                      alignItems="center"
                    >
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                formData.schedules
                                  ? Boolean(
                                      formData.schedules.find(
                                        (schedule) => schedule.dayOfWeek === day
                                      )
                                    )
                                  : false
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
                          slotProps={{ textField: { size: "small" } }}
                          value={
                            formData.schedules &&
                            formData.schedules.find(
                              (schedule) => schedule.dayOfWeek === day
                            )
                              ? dayjs(
                                  formData.schedules.find(
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
                            formData.schedules &&
                            formData.schedules.find(
                              (schedule) => schedule.dayOfWeek === day
                            )
                              ? dayjs(
                                  formData.schedules.find(
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
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button autoFocus type="submit">
                Submit
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    )
  );
}
