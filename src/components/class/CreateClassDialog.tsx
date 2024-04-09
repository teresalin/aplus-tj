import { FormEvent, FormEventHandler } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import dayjs, { Dayjs } from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import useSWR from "swr";

import { Assignment } from "../../../pages/api/assignments";
import { Class } from "../../../pages/api/classes";
import fetcher from "../../../utils/fetcher";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Staff } from "../../../pages/api/persons/staffs";
import { Schedule } from "../../../pages/api/classes/[class_id]/schedules";
import Select from "@mui/material/Select";

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
  const [newClass, setNewClass] = React.useState({} as Class);
  const [updatedSchedules, setUpdatedSchedules] = React.useState(
    [] as Schedule[]
  );
  const { data } = useSWR(open ? "/api/persons/staffs" : null, fetcher);
  const teachers = data || [];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewClass((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };

  const handleTeacherChange = (event) => {
    const { value } = event.target;
    setNewClass((prevData) => ({
      ...prevData,
      teacher: { staffId: value as number },
    }));
  };

  // const handleTeacherChange = (
  //   event: React.SelectChangeEvent<{ value: number }>
  // ) => {
  //   const { value } = event.target;
  //   setNewClass((prevData) => ({
  //     ...prevData,
  //     teacher: { staffId: value as number },
  //   }));
  // };

  const handleSwitchChange = (day: string) => {
    setUpdatedSchedules((prevSchedules) => {
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

  const handleTimeChange = (field, day: string, newValue) => {
    setUpdatedSchedules((prevSchedules) => {
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

  const hasSchedule = (schedule: Schedule) => {
    const emptyTime = "00:00:00";
    if (schedule) {
      return schedule.startTime !== emptyTime && schedule.endTime !== emptyTime;
    }
    return false;
  };

  const handleDateChange = (fieldName, date) => {
    // setEditedData((prevData) => ({
    //   ...prevData,
    //   [fieldName]: date,
    // }));
  };

  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    // onSubmit(editedData);
  };

  return (
    <>
      <Dialog disablePortal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Class</DialogTitle>
          <DialogContent>
            <Typography variant="body2" display="block">
              Name
            </Typography>
            <TextField
              required
              margin="dense"
              id="name"
              label="Class Name"
              type="text"
              defaultValue={newClass ? newClass.name : null}
              fullWidth
              variant="outlined"
            />
            <RedBar />
            <Typography variant="body2" display="block">
              Schedule
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
                          updatedSchedules &&
                          updatedSchedules.find(
                            (schedule) => schedule.dayOfWeek === day
                          )
                            ? dayjs(
                                updatedSchedules.find(
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
                          updatedSchedules &&
                          updatedSchedules.find(
                            (schedule) => schedule.dayOfWeek === day
                          )
                            ? dayjs(
                                updatedSchedules.find(
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
            <RedBar />
            <Typography variant="body2" display="block">
              Teacher
            </Typography>
            {/* TODO fix default value */}
            <Select
              id="teacher"
              name="teacher"
              label="Select a teacher"
              margin="dense"
              required
              fullWidth
              value={newClass.teacher?.staffId || ""}
              onChange={handleTeacherChange}
            >
              {teachers &&
                teachers.map((teacher: Staff) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </MenuItem>
                ))}
            </Select>
            <RedBar />
            <Typography variant="body2" display="block">
              Capacity
            </Typography>
            <TextField
              required
              margin="dense"
              id="name"
              label="Student Capacity"
              type="number"
              fullWidth
              variant="outlined"
              value={newClass.capacity}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button autoFocus type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
