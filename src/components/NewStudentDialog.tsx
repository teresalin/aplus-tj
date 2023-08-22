import * as React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { FormEvent, FormEventHandler } from "react";
import { formatDate } from "../../utils/formatDate";

function RedBar() {
  return (
    <Box
      sx={{
        height: 20,
      }}
    />
  );
}

export default function NewStudentDialog() {
  const [open, setOpen] = React.useState(false);

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
      phone: target.phone.value,
      email: target.email.value,
      dateOfBirth: formatDate(dateOfBirth),
      notes: target.notes.value,
      joinDate: formatDate(joinDate),
      leaveDate: leaveDate ? formatDate(leaveDate) : null,
    };

    try {
      const response = await fetch("/api/students/[student_id]", {
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
      <IconButton aria-label="Add box icon" onClick={handleClickOpen}>
        <AddBoxIcon />
      </IconButton>
      <Dialog disablePortal open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Student</DialogTitle>
          <DialogContent>
            <Typography variant="body2" display="block">
              Basic Information
            </Typography>
            <TextField
              required
              margin="dense"
              id="name"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
            />
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
            <TextField
              multiline
              margin="dense"
              id="notes"
              label="Notes"
              type="text"
              fullWidth
              maxRows={3}
              variant="outlined"
              placeholder="Hobbies, nicknames, etc."
              InputLabelProps={{ shrink: true }}
            />
            <RedBar />
            <Typography variant="body2" display="block">
              Contact Information
            </Typography>
            <TextField
              required
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
            />
            <TextField
              required
              margin="dense"
              id="phone"
              label="Phone Number"
              type="phone"
              fullWidth
              variant="outlined"
            />
            <RedBar />
            <Typography variant="body2" display="block">
              Enrollment Period
            </Typography>
            <TextField
              required
              margin="dense"
              id="joinDate"
              label="Join Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              id="leaveDate"
              label="Leave Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
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
