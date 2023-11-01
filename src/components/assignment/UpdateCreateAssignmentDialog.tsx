import { FormEvent, FormEventHandler } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import useSWR from "swr";

import { Assignment } from "../../../pages/api/assignments";
import { Class } from "../../../pages/api/classes";
import fetcher from "../../../utils/fetcher";
import { DatePicker } from "@mui/x-date-pickers";

export interface IUpdateCreateAssignmentDialogProps {
  isUpdate: boolean;
  existingData: Assignment;
  open: boolean;
  onClose;
  onSubmit;
}

export default function UpdateCreateAssignmentDialog({
  isUpdate,
  existingData,
  open,
  onClose,
  onSubmit,
}: IUpdateCreateAssignmentDialogProps) {
  const [editedData, setEditedData] = React.useState(existingData);
  const { data } = useSWR("/api/classes", fetcher);
  const classes = data || [];

  React.useEffect(() => {
    if (isUpdate) {
      setEditedData(existingData);
    } else {
      setEditedData({} as Assignment);
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

  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(editedData);
  };

  return (
    <>
      {editedData && (
        <Dialog disablePortal open={open} onClose={onClose}>
          <form onSubmit={handleSubmit}>
            <DialogTitle>New assignment</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                required
                id="assignmentName"
                name="assignmentName"
                label="Assignment Name"
                type="text"
                variant="outlined"
                margin="dense"
                value={editedData.name || ""}
                onChange={handleInputChange}
              />
              <DatePicker
                label="Date of Birth"
                format="YYYY-MM-DD"
                value={editedData.dueDate && dayjs(editedData.dueDate)}
                onChange={(date) => handleDateChange("dueDate", date)}
                sx={{ marginTop: "8px", marginBottom: "4px", width: "100%" }}
                slotProps={{
                  textField: {
                    required: true,
                  },
                }}
              />
              <TextField
                fullWidth
                required
                id="classId"
                name="classId"
                label="Assign to a class"
                margin="dense"
                value={editedData.classInfo?.id || ""}
                select
                onChange={handleInputChange}
              >
                {classes &&
                  classes.map((item: Class) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                type="text"
                variant="outlined"
                margin="dense"
                value={editedData.description || ""}
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
      )}
    </>
  );
}
