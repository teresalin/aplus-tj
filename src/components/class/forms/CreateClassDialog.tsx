import { TimePicker } from "@mui/x-date-pickers";
import React from "react";
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
import { Schedule } from "../../../../pages/api/classes/[class_id]/schedules";
import { Staff } from "../../person/staff/types";
import fetcher from "../../../../utils/fetcher";

export interface ICreateClassDialogProps {
  open: boolean;
  onClose;
  onSubmit;
}

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

export default function CreateClassDialog({
  open,
  onClose,
  onSubmit,
}: ICreateClassDialogProps) {
  const [newClass, setNewClass] = React.useState({} as ClassDetail);
  const [schedules, setSchedules] = React.useState([] as Schedule[]);
  const { data: staffsData, error: staffsError } = useSWR(
    open ? "/api/persons/staffs" : null,
    fetcher
  );
  const { data: gradesData, error: gradesError } = useSWR(
    open ? "/api/grades" : null,
    fetcher
  );
  const teachers = staffsData || [];
  const grades = gradesData || [];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewClass((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTeacherChange = (event) => {
    const { value } = event.target;
    const selectedTeacher = teachers.find((teacher) => teacher.id === value);
    setNewClass((prevData) => ({
      ...prevData,
      teacher: selectedTeacher || {},
    }));
  };

  const handleGradeChange = (event) => {
    const { value } = event.target;
    // Find the selected grade object from your grades array
    const selectedGrade = grades.find((grade) => grade.id === value);
    setNewClass((prevData) => ({
      ...prevData,
      grade: selectedGrade || {},
    }));
  };

  const handleSwitchChange = (day: string) => {
    setSchedules((prevSchedules) => {
      const existingScheduleIndex = prevSchedules.findIndex(
        (schedule) => schedule.dayOfWeek === day
      );

      if (existingScheduleIndex === -1) {
        // If the schedule doesn't exist, add a new schedule with default values
        const newSchedule = {
          dayOfWeek: day,
          startTime: "",
          endTime: "",
        };
        return [...prevSchedules, newSchedule];
      } else {
        // If the schedule exists, remove it
        return prevSchedules.filter((schedule) => schedule.dayOfWeek !== day);
      }
    });
  };

  const handleTimeChange = (field: string, day: string, newValue) => {
    setSchedules((prevSchedules) => {
      return prevSchedules.map((schedule) => {
        if (schedule.dayOfWeek === day) {
          return {
            ...schedule,
            [field]: newValue ? dayjs(newValue).format("HH:mm:ss") : "00:00:00",
          };
        }
        return schedule;
      });
    });
  };

  const handleSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    // Combine the newClass state with schedules
    const classDataToSubmit = {
      ...newClass,
      schedules: schedules,
    };
    onSubmit(classDataToSubmit);
  };

  return (
    <>
      <Dialog disablePortal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Class</DialogTitle>
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
              value={newClass.name || ""}
              fullWidth
              variant="outlined"
              onChange={handleInputChange}
            />
            {/* <Typography variant="body2" display="block">
              Grade
            </Typography> */}
            <Box mt="8px">
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
                  value={newClass.grade?.id || ""}
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
                  value={newClass.teacher?.staffId || ""}
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
                value={newClass.capacity || ""}
                onChange={handleInputChange}
              />
            </Box>
            <RedBar />
            <Typography variant="body2" display="block">
              Class Schedule
            </Typography>
            <Grid container spacing={1}>
              {newClass &&
                dayOfWeek.map((day) => (
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
                              newClass.schedules &&
                              Boolean(
                                newClass.schedules.find(
                                  (schedule) => schedule.dayOfWeek === day
                                )
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
                        slotProps={{ textField: { size: "small" } }}
                        value={
                          schedules &&
                          schedules.find(
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
                          schedules &&
                          schedules.find(
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
                ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            {/* calling onSubmit at the <form> level instead of the button level ensures that 
            the form can be submitted not only when the submit button is clicked but also 
            when the user presses the Enter key while focusing on any input within the form.
            This is more ideal because it works with keyboard actions and ensures accessibility */}
            <Button autoFocus type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
