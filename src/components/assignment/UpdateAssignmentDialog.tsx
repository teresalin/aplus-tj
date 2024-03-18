import { DatePicker } from "@mui/x-date-pickers";
import { FormEvent, FormEventHandler } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import dayjs, { Dayjs } from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import useSWR from "swr";

import { Assignment } from "../../../pages/api/assignments";
import { Class } from "../../../pages/api/classes";
import fetcher from "../../../utils/fetcher";

export interface IUpdateAssignmentDialogProps {
  assignment: Assignment | null;
  open: boolean;
  onClose: () => void;
  onSubmit;
}

export default function UpdateAssignmentDialog({
  assignment,
  open,
  onClose,
  onSubmit,
}: IUpdateAssignmentDialogProps) {
  // TODO create two functions, one for update and one for create and make the form components reusable
  const [formData, setFormData] = React.useState({} as Assignment);
  const { data } = useSWR("/api/classes", fetcher);
  const classes = data || [];

  React.useEffect(() => {
    if (assignment) {
      setFormData(assignment);
    }
  }, [assignment]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      classInfo: { id: value as number },
    }));
  };

  const handleDateChange = (value: Dayjs | null) => {
    setFormData((prevData) => ({
      ...prevData,
      dueDate: value as unknown as Date,
    }));
  };

  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
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
              value={formData.name}
              onChange={handleInputChange}
            />
            <DatePicker
              label="Due Date"
              format="YYYY-MM-DD"
              value={dayjs(formData.dueDate)}
              onChange={handleDateChange}
              sx={{ marginTop: "8px", marginBottom: "4px", width: "100%" }}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />
            <Select
              fullWidth
              required
              id="classId"
              name="classId"
              label="Assign to a class"
              margin="dense"
              value={formData.classInfo?.id ? formData.classInfo?.id : ""}
              onChange={handleSelectChange}
            >
              {classes &&
                classes.map((item: Class) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              type="text"
              variant="outlined"
              margin="dense"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              maxRows={3}
            />
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
