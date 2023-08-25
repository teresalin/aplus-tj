import { formatDate } from "../../utils/formatDate";
import { FormEvent, FormEventHandler } from "react";
import { Role } from "../../pages/api/staffs/roles";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useRouter } from "next/router";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import fetcher from "../../utils/fetcher";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Person } from "../../pages/api/persons";

function RedBar() {
  return (
    <Box
      sx={{
        height: 20,
      }}
    />
  );
}

export default function UpdateClassDetailsDialog() {
  const classID = useRouter().query.class_id;
  console.log("classID: ", classID);

  const [role, setRole] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { data: staffsData } = useSWR(open ? "/api/staffs" : null, fetcher);
  const { data: classData } = useSWR(
    open && classID ? `/api/classes/${classID}` : null,
    fetcher
  );
  const { data: dayOfWeekData } = useSWR(
    open ? "/api/day-of-week" : null,
    fetcher
  );
  const staffs = staffsData || ([] as Person[]);
  const classDetail = classData || ([] as Person[]);
  const dayOfWeek = dayOfWeekData as string[] | null;

  // console.log("open: ", open);
  // console.log("classDetail: ", classDetail);
  // console.log("dayOfWeek: ", dayOfWeek);
  // console.log("dayOfWeek type: ", typeof dayOfWeek);

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      roleId: role,
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
              defaultValue={classDetail.name}
              fullWidth
              variant="outlined"
            />
            <RedBar />
            <Typography variant="body2" display="block">
              Schedule
            </Typography>
            <Grid container spacing={1}>
              {dayOfWeek &&
                dayOfWeek.map((day) => (
                  <Grid
                    container
                    item
                    key={day}
                    spacing={1}
                    alignItems="center"
                  >
                    <Grid item xs={12} md={4}>
                      <FormControlLabel control={<Switch />} label={day} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TimePicker
                        label="Start Time"
                        slotProps={{ textField: { size: "small" } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TimePicker
                        label="End Time"
                        slotProps={{ textField: { size: "small" } }}
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
