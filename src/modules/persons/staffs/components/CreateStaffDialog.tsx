import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { FormEvent, FormEventHandler } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import { Role } from "../../../../pages/api/persons/staffs/roles";
import { Staff } from "../types";
import fetcher from "../../../../../utils/fetcher";

function RedBar() {
  return (
    <Box
      sx={{
        height: 20,
      }}
    />
  );
}

export interface ICreateStaffDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit;
}

export default function CreateStaffDialog({
  open,
  onClose,
  onSubmit,
}: ICreateStaffDialogProps) {
  const [newStaff, setNewStaff] = React.useState({} as Staff);

  const { data } = useSWR(open ? "/api/persons/staffs/roles" : null, fetcher);
  const roles = (data as Role[]) || [];

  const genders = ["Male", "Female", "Other"];

  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(newStaff);
  };

  const handleInputChange = (field, value) => {
    setNewStaff((prevData) => ({
      ...prevData,
      [field]: field === "classId" ? Number(value) : value,
    }));
  };

  const handleRoleChange = (event) => {
    const { value } = event.target;
    const selectedRole = roles.find((role) => role.id === value);
    setNewStaff((prevData) => ({
      ...prevData,
      role: selectedRole || prevData.role,
    }));
  };

  return (
    <>
      <Dialog disablePortal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Staff</DialogTitle>
          <DialogContent>
            <Typography variant="body2" display="block" gutterBottom>
              Basic Information
            </Typography>
            <TextField
              id="name"
              name="name"
              label="Full Name"
              margin="dense"
              required
              type="text"
              fullWidth
              variant="outlined"
              value={newStaff.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <DatePicker
              label="Date of Birth"
              format="YYYY-MM-DD"
              value={newStaff.dateOfBirth ? dayjs(newStaff.dateOfBirth) : null}
              onChange={(date) => handleInputChange("dateOfBirth", date)}
              sx={{ marginTop: "8px", marginBottom: "4px", width: "100%" }}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel id="gender-select-label">Select a gender</InputLabel>
              <Select
                fullWidth
                required
                variant="outlined"
                id="teacher"
                name="teacher"
                label={"Select a teacher"}
                labelId="teacher-select-label"
                margin="dense"
                value={newStaff.gender || ""}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                {genders.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              multiline
              margin="dense"
              id="notes"
              name="notes"
              label="Notes"
              type="text"
              fullWidth
              maxRows={3}
              variant="outlined"
              placeholder="Hobbies, nicknames, etc."
              InputLabelProps={{ shrink: true }}
              value={newStaff.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
            <RedBar />
            {/* TODO lowercase before storing into db */}
            <Typography variant="body2" display="block" gutterBottom>
              Contact Information
            </Typography>
            <TextField
              required
              margin="dense"
              id="email"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={newStaff.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="phone"
              name="phone"
              label="Phone Number"
              type="tel"
              fullWidth
              variant="outlined"
              value={newStaff.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            <RedBar />
            <Typography variant="body2" display="block" gutterBottom>
              Role
            </Typography>
            <TextField
              id="role"
              name="role"
              label="Select a role"
              margin="dense"
              required
              select
              fullWidth
              value={newStaff.role?.id || ""}
              onChange={handleRoleChange}
            >
              {roles &&
                roles.map((role: Role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
            </TextField>
            {/* TODO only visible when updating a teacher's class */}
            {/* <TextField
              id="class"
              name="class"
              label="Select a class"
              margin="dense"
              select
              fullWidth
              value={newStaff.role?.id || ""}
              onChange={handleRoleChange}
            >
              {roles &&
                roles.map((role: Role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
            </TextField> */}
            <RedBar />
            <Typography variant="body2" display="block" gutterBottom>
              Enrollment Period
            </Typography>
            <Grid container direction="row" spacing={1}>
              <Grid item xs={6}>
                <DatePicker
                  label="Join Date"
                  format="YYYY-MM-DD"
                  value={newStaff.joinDate && dayjs(newStaff.joinDate)}
                  onChange={(date) => handleInputChange("joinDate", date)}
                  sx={{ marginTop: "8px", marginBottom: "4px" }}
                  slotProps={{
                    textField: {
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="Leave Date"
                  format="YYYY-MM-DD"
                  value={newStaff.leaveDate && dayjs(newStaff.leaveDate)}
                  onChange={(date) => handleInputChange("leaveDate", date)}
                  sx={{ marginTop: "8px", marginBottom: "4px" }}
                />
              </Grid>
            </Grid>
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
