import { formatDate } from "../../../utils/formatDate";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { Person } from "../../../pages/api/persons";
import { Schedule } from "../../../pages/api/classes/[class_id]/schedules";
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
import EditIcon from "@mui/icons-material/Edit";
import fetcher from "../../../utils/fetcher";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Role } from "../../../pages/api/staffs/roles";

const dayOfWeek = [
  "Monday",
  "Tuesday",
  // "Wednesday",
  // "Thursday",
  // "Friday",
  // "Saturday",
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

export default function UpdateClassDetailsDialog({ classDetails }) {
  const classID = useRouter().query.class_id;
  const [open, setOpen] = useState(false);
  const [teacher, setTeacher] = useState(classDetails.teacherName);
  const [updatedSchedules, setUpdatedSchedules] = useState(
    classDetails.schedules
  );
  const { data } = useSWR(open ? "/api/staffs" : null, fetcher);
  const staffs = data as Person[] | null;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTimeChange = (day: string, newValue) => {
    console.log(dayjs(newValue).format("HH:mm:ss"));
    setUpdatedSchedules((prevSchedules: any) => ({
      ...prevSchedules,
      [day]: {
        ...prevSchedules[day],
        startTime: newValue
          ? dayjs(newValue).format("HH:mm:ss")
          : dayjs().format("HH:mm:ss"),
      },
    }));
  };

  const handleTeacherChange = () => {};

  const hasSchedule = (schedule: Schedule) => {
    const emptyTime = "00:00:00";
    if (schedule) {
      return schedule.startTime !== emptyTime && schedule.endTime !== emptyTime;
    }
    return false;
  };

  const handleSubmit: FormEventHandler = async (event: FormEvent) => {
    // event.preventDefault();

    const target = event.target as typeof event.target & {
      name: { value: string };
      capacity: { value: string };
    };

    const data = {
      name: target.name.value,
      capacity: target.capacity.value,
    };

    try {
      const response = await fetch(`/api/classes/${classID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Handle success
        handleClose;
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle fetch error
    }
  };

  return (
    <div>
      <Button
        variant="text"
        color="primary"
        startIcon={<EditIcon />}
        onClick={handleClickOpen}
      >
        Edit
      </Button>
      <Dialog disablePortal open={open} onClose={handleClose}>
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
              label="Class Name"
              type="text"
              defaultValue={classDetails ? classDetails.name : null}
              fullWidth
              variant="outlined"
            />
            <RedBar />
            <Typography variant="body2" display="block">
              Schedule
            </Typography>
            <Grid container spacing={1}>
              {classDetails &&
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
                            checked={hasSchedule(classDetails.schedules[day])}
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
                          updatedSchedules[day].startTime !== "00:00:00"
                            ? dayjs(updatedSchedules[day].startTime, "HH:mm:ss")
                            : null
                        }
                        onChange={(newValue: Dayjs | null) =>
                          handleTimeChange(day, newValue)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TimePicker
                        label="End Time"
                        slotProps={{ textField: { size: "small" } }}
                        value={
                          updatedSchedules &&
                          updatedSchedules[day].endTime !== "00:00:00"
                            ? dayjs(updatedSchedules[day].endTime, "HH:mm:ss")
                            : null
                        }
                        onChange={(newValue: Dayjs | null) =>
                          handleTimeChange(day, newValue)
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
              fullWidth
              // labelId="demo-simple-select-label"
              id="teacher"
              value={teacher}
              label="Teacher"
              displayEmpty
              onChange={handleTeacherChange}
            >
              {staffs &&
                staffs.map((staff: Person) => (
                  <MenuItem key={staff.id} value={staff.id}>
                    {staff.name}
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
              value={classDetails.capacity}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button autoFocus type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
