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
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import { Class } from "../../../pages/api/classes";
import { FormEvent, FormEventHandler } from "react";
import { Person } from "../../../pages/api/persons";
import { Staff } from "../../../pages/api/persons/staffs";
import fetcher from "../../../utils/fetcher";

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

export interface IUpdateexistingDataDialogProps {
  existingData: Class;
  open: boolean;
  onClose;
  onSubmit;
}

export default function UpdateCreateStudentDialog({
  existingData,
  open,
  onClose,
  onSubmit,
}: IUpdateexistingDataDialogProps) {
  const classID = useRouter().query.class_id;
  const [editedData, setEditedData] = React.useState(existingData);
  const [updatedSchedules, setUpdatedSchedules] = React.useState(
    existingData.schedules
  );
  const { data } = useSWR(open ? "/api/persons/staffs" : null, fetcher);
  const teachers = (data as Person[]) || [];

  console.log(updatedSchedules);

  React.useEffect(() => {
    setEditedData(existingData);
  }, [existingData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };

  const handleGradeChange = (
    event: React.ChangeEvent<{ name: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData,
      grade: { id: value as number, name: name },
    }));
  };

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

  // custom validation is required since form is unable to detected the required field in TimePicker
  function hasEmptyOrInvalidTimeValues() {
    return updatedSchedules.some(
      (schedule) =>
        !schedule.startTime ||
        !schedule.endTime ||
        schedule.startTime === "Invalid Date" ||
        schedule.endTime === "Invalid Date"
    );
  }

  // TODO fix submit
  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();

    if (hasEmptyOrInvalidTimeValues()) {
      // Display an error message to the user
      alert("Please fill out all time values.");
    } else {
      // Proceed with the form submission
      onSubmit(editedData);
    }
  };

  return (
    <div>
      <Dialog disablePortal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Update Class Details</DialogTitle>
          <DialogContent>
            <Typography variant="body2" display="block">
              Name
            </Typography>
            <TextField
              required
              margin="dense"
              id="name"
              name="name"
              label="Class Name"
              type="text"
              defaultValue={editedData.name || ""}
              fullWidth
              variant="outlined"
            />
            <RedBar />
            <Typography variant="body2" display="block">
              Schedule
            </Typography>
            {existingData &&
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
                            checked={Boolean(
                              updatedSchedules.find(
                                (schedule) => schedule.dayOfWeek === day
                              )
                            )}
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
                </Box>
              ))}
            <RedBar />
            <Typography variant="body2" display="block">
              Teacher
            </Typography>
            <TextField
              id="teacher"
              name="teacher"
              label="Select a teacher"
              margin="dense"
              required
              select
              fullWidth
              value={editedData.teacher?.staffId || ""}
              onChange={handleGradeChange}
            >
              {teachers &&
                teachers.map((teacher: Staff) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </MenuItem>
                ))}
            </TextField>
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
              value={editedData.capacity || 0}
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
    </div>
  );
}
