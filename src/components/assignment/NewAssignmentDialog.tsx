import { formatDate } from "../../../utils/formatDate";
import { FormEvent, FormEventHandler } from "react";
import * as React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import fetcher from "../../../utils/fetcher";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import useSWR from "swr";
import { Class } from "../../../pages/api/classes";

export default function NewAssignmentDialog() {
  const [classId, setClassId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { data } = useSWR("/api/classes", fetcher);
  const classes = data || ([] as Class[]);

  const handleClassChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setClassId(event.target.value);
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
      classId: { value: string };
      dueDate: { value: string };
      description: { value: string };
    };

    const dueDate = new Date(target.dueDate.value);

    const data = {
      name: target.name.value,
      classId: parseInt(classId),
      dueDate: formatDate(dueDate),
      description: target.description.value,
    };

    try {
      const response = await fetch(`/api/assignments/[assignment_id]`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        handleClose();
      } else {
        // Handle error
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <IconButton
        aria-label="Add box icon"
        onClick={handleClickOpen}
        color="primary"
        sx={{ padding: "4px" }}
      >
        <AddBoxIcon />
      </IconButton>
      <Dialog disablePortal open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New assignment</DialogTitle>
          <DialogContent>
            <TextField
              id="name"
              label="Assignment Name"
              type="text"
              variant="outlined"
              margin="dense"
              required
              fullWidth
            />
            {/* TODO format date in yyyy-mm-dd format */}
            <TextField
              id="dueDate"
              label="Due Date"
              type="date"
              variant="outlined"
              margin="dense"
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              id="classId"
              label="Assign to a class"
              margin="dense"
              value={classId}
              required
              select
              fullWidth
              onChange={handleClassChange}
            >
              {classes.map((item: Class) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.className}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="description"
              label="Description"
              type="text"
              variant="outlined"
              margin="dense"
              multiline
              fullWidth
              maxRows={3}
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
    </>
  );
}
