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
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
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

export interface IUpdateCreateStaffDialogProps {
  isUpdate: boolean;
  existingData: Staff;
  open: boolean;
  onClose;
  onSubmit;
}

export default function UpdateCreateStaffDialog({
  isUpdate,
  existingData,
  open,
  onClose,
  onSubmit,
}: IUpdateCreateStaffDialogProps) {
  const [editedData, setEditedData] = React.useState(existingData);
  const { data } = useSWR("/api/persons/staffs/roles", fetcher);
  const roles = data || [];

  React.useEffect(() => {
    if (isUpdate) {
      setEditedData(existingData);
    } else {
      setEditedData({} as Staff);
    }
  }, [existingData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };

  const handleDateChange = (fieldName, date) => {
    setEditedData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const handleRoleChange = (
    event: React.ChangeEvent<{ name: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData,
      role: { id: value as number, name: name },
    }));
  };

  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(editedData);
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
              value={editedData.name || ""}
              onChange={handleInputChange}
            />
            <DatePicker
              label="Date of Birth"
              format="YYYY-MM-DD"
              value={
                editedData.dateOfBirth ? dayjs(editedData.dateOfBirth) : null
              }
              onChange={(date) => handleDateChange("dateOfBirth", date)}
              sx={{ marginTop: "8px", marginBottom: "4px", width: "100%" }}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />
            <TextField
              id="gender"
              name="gender"
              label="Select a gender"
              margin="dense"
              required
              select
              fullWidth
              value={editedData.gender || ""}
              onChange={handleInputChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
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
              value={editedData.notes || ""}
              onChange={handleInputChange}
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
              value={editedData.email || ""}
              onChange={handleInputChange}
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
              value={editedData.phone || ""}
              onChange={handleInputChange}
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
              value={editedData.role?.id || ""}
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
              value={editedData.role?.id || ""}
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
                  value={editedData.joinDate && dayjs(editedData.joinDate)}
                  onChange={(date) => handleDateChange("joinDate", date)}
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
                  value={editedData.leaveDate && dayjs(editedData.leaveDate)}
                  onChange={(date) => handleDateChange("leaveDate", date)}
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
