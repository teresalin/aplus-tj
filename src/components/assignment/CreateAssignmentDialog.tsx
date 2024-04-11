import { DatePicker } from "@mui/x-date-pickers";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import useSWR from "swr";

import { Assignment } from "../../../pages/api/assignments";
import { Class } from "../../../pages/api/classes";
import fetcher from "../../../utils/fetcher";

export interface ICreateAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit;
}

export default function CreateAssignmentDialog({
  open,
  onClose,
  onSubmit,
}: ICreateAssignmentDialogProps) {
  // TODO create two functions, one for update and one for create and make the form components reusable
  const [newAssignment, setNewAssignment] = React.useState({} as Assignment);
  const { data } = useSWR("/api/classes", fetcher);
  const classes = data || [];

  const handleInputChange = (field: string, value) => {
    setNewAssignment((prevData) => ({
      ...prevData,
      [field]: field === "classId" ? Number(value) : value,
    }));
  };

  const handleClassChange = (event) => {
    const { value } = event.target;
    const selectedClass = classes.find((c) => c.id === value);
    setNewAssignment((prevData) => ({
      ...prevData,
      classInfo: selectedClass || {},
    }));
  };

  const handleSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(newAssignment);
  };

  return (
    <>
      <Dialog disablePortal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New assignment</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              required
              id="name"
              name="name"
              label="Assignment Name"
              type="text"
              variant="outlined"
              margin="dense"
              value={newAssignment.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <DatePicker
              label="Due Date"
              format="YYYY-MM-DD"
              value={newAssignment.dueDate || null}
              onChange={(date) => handleInputChange("dueDate", date)}
              sx={{ marginTop: "8px", marginBottom: "4px", width: "100%" }}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />
            <Box mt="8px">
              <FormControl fullWidth>
                <InputLabel id="select-label">Assign to a class</InputLabel>
                <Select
                  fullWidth
                  required
                  variant="outlined"
                  id="class"
                  name="class"
                  label={"Assign to a class"}
                  labelId="select-label"
                  margin="dense"
                  value={
                    newAssignment.classInfo?.id
                      ? newAssignment.classInfo.id.toString()
                      : ""
                  }
                  onChange={handleClassChange}
                >
                  {classes &&
                    classes.map((item: Class) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Box mt="4px">
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                type="text"
                variant="outlined"
                margin="dense"
                value={newAssignment.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                multiline
                maxRows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button autoFocus type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
