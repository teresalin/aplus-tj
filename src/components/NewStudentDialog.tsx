import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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

  return (
    <div>
      <IconButton aria-label="Add box icon" onClick={handleClickOpen}>
        <AddBoxIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Student</DialogTitle>
        <DialogContent>
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
            id="name"
            label="Date of Birth"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <RedBar />
          <Typography variant="body2" display="block">
            Contact Information
          </Typography>
          <TextField
            required
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
          />
          <TextField
            required
            margin="dense"
            id="name"
            label="Phone Number"
            type="phone"
            fullWidth
            variant="outlined"
          />
          <TextField
            required
            margin="dense"
            id="name"
            label="Join Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
