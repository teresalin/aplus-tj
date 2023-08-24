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
  const assignmentID = useRouter().query.assignment_id;
  const [role, setRole] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { data } = useSWR("/api/staffs/roles", fetcher);
  const roles = data || ([] as Role[]);

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
      const response = await fetch(`/api/assignment/${assignmentID}`, {
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
          <DialogTitle>Update Assignment Details</DialogTitle>
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
              fullWidth
              variant="outlined"
            />
            <RedBar />
            <Typography variant="body2" display="block">
              Schedule
            </Typography>
            <Grid container>
              <Grid item xs={12} md={2}>
                <Switch />
              </Grid>
              <Grid item xs={12} md={5}>
                <TimePicker label="Basic time picker" />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  required
                  margin="dense"
                  id="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
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
              {roles.map((role: Role) => (
                <MenuItem value={role.id}>{role.name}</MenuItem>
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
