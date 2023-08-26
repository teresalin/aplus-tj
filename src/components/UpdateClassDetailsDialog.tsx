import { formatDate } from "../../utils/formatDate";
import { FormEvent, FormEventHandler } from "react";
import { Person } from "../../pages/api/persons";
import { Role } from "../../pages/api/staffs/roles";
import { Schedule } from "../../pages/api/classes/[class_id]/schedules";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useRouter } from "next/router";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import fetcher from "../../utils/fetcher";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

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

export default function UpdateClassDetailsDialog(props: { classDetails: any }) {
  const { classDetails } = props;
  const classID = useRouter().query.class_id;
  const [value, setValue] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const { data } = useSWR(open ? "/api/staffs" : null, fetcher);
  const staffs = data as Person[] | null;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const hasSchedule = (schedule: Schedule) => {
    const emptyTime = "00:00:00";
    if (schedule) {
      return schedule.startTime !== emptyTime && schedule.endTime !== emptyTime;
    }
    return false;
  };

  const handleSubmit: FormEventHandler = async (event: FormEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      name: { value: string };
      phone: { value: string };
      email: { value: string };
      dateOfBirth: { value: string };
      notes: { value: string };
      joinDate: { value: string };
      leaveDate: { value: string };
    };

    const dateOfBirth = new Date(target.dateOfBirth.value);
    const joinDate = new Date(target.joinDate.value);
    const leaveDate = target.leaveDate.value
      ? new Date(target.leaveDate.value)
      : null;

    const data = {
      name: target.name.value,
      phone: target.phone.value,
      email: target.email.value,
      dateOfBirth: formatDate(dateOfBirth),
      notes: target.notes.value,
      joinDate: formatDate(joinDate),
      leaveDate: leaveDate ? formatDate(leaveDate) : null,
    };

    try {
      const response = await fetch(`/api/assignment/${classID}`, {
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
                          classDetails.schedules[day]
                            ? classDetails.schedules[day].startTime ===
                              "00:00:00"
                              ? null
                              : dayjs(
                                  classDetails.schedules[day].startTime,
                                  "HH:mm:ss"
                                )
                            : null
                        }
                        onChange={(newValue) => setValue(newValue)}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TimePicker
                        label="End Time"
                        slotProps={{ textField: { size: "small" } }}
                        value={
                          classDetails.schedules[day]
                            ? classDetails.schedules[day].endTime === "00:00:00"
                              ? null
                              : dayjs(
                                  classDetails.schedules[day].endTime,
                                  "HH:mm:ss"
                                )
                            : null
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
            {/* <Select
              fullWidth
              // labelId="demo-simple-select-label"
              id="roleId"
              value={role}
              label="Role"
              displayEmpty
              onChange={handleRoleChange}
            >
              {staffs.map((role: Role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select> */}
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
