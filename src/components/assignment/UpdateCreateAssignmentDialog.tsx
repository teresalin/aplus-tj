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

import fetcher from "../../../utils/fetcher";
import { Class } from "../../../pages/api/classes";
import { Assignment } from "../../../pages/api/assignments";

export interface IEditAssignmentDialogProps {
  existingData: Assignment | undefined | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Assignment | null | undefined) => void;
}

export default function EditAssignmentDialog({
  existingData,
  open,
  onClose,
  onSubmit,
}: IEditAssignmentDialogProps) {
  const [editedData, setEditedData] = React.useState(existingData);
  const { data } = useSWR("/api/classes", fetcher);
  const classes = data as Class[] | undefined;

  const isUpdate = !!existingData;

  React.useEffect(() => {
    if (editedData) {
      setEditedData(existingData);
    } else {
      setEditedData({
        id: 0,
        classId: 0,
        className: "",
        assignmentName: "",
        description: "",
        dueDate: new Date(),
        created: new Date(),
      });
    }
  }, [existingData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedData((prevData: Assignment | null | undefined) => ({
      ...prevData!,
      [name]: value,
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
                value={editedData.assignmentName}
                onChange={handleInputChange}
              />
              {/* TODO format date in yyyy-mm-dd format */}
              <TextField
                fullWidth
                required
                id="dueDate"
                name="dueDate"
                label="Due Date"
                type="date"
                variant="outlined"
                margin="dense"
                InputLabelProps={{ shrink: true }}
                value={dayjs(editedData.dueDate).format("YYYY-MM-DD")}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                required
                id="classId"
                name="classId"
                label="Assign to a class"
                margin="dense"
                value={editedData.classId}
                select
                onChange={handleInputChange}
              >
                {classes &&
                  classes.map((item: Class) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.className}
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
                value={editedData.description}
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
