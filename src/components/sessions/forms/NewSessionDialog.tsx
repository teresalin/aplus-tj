import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { FormEvent, FormEventHandler } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import dayjs, { Dayjs } from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import useSWR from "swr";

import { Session } from "../types";
import { Class } from "../../classes/types";
import fetcher from "../../../../utils/fetcher";

export interface INewSessionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit;
}

export default function NewSessionDialog({
  open,
  onClose,
  onSubmit,
}: INewSessionDialogProps) {
  const [newSession, setNewSession] = React.useState({} as Session);
  const { data } = useSWR("/api/classes", fetcher);
  const classes = data || [];

  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(newSession);
  };

  const handleInputChange = (field, value) => {
    setNewSession((prevData) => ({
      ...prevData,
      [field]: field === "classId" ? Number(value) : value,
    }));
  };

  const handleTimeChange = (field: string, value: dayjs.Dayjs | null) => {
    setNewSession((prevData) => ({
      ...prevData,
      [field]: value ? dayjs(value).format("HH:mm:ss") : "00:00:00",
    }));
  };

  return (
    <>
      <Dialog disablePortal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New session</DialogTitle>
          <DialogContent>
            <DatePicker
              label="Session Date"
              format="YYYY-MM-DD"
              value={newSession.date || null}
              onChange={(date) => handleInputChange("date", date)}
              sx={{ marginTop: "8px", marginBottom: "4px", width: "100%" }}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />
            <Box mt={1.5}>
              <FormControl fullWidth>
                <InputLabel id="select-label">Assign to a class</InputLabel>
                <Select
                  fullWidth
                  required
                  id="classId"
                  name="classId"
                  label="Assign to a class"
                  labelId="select-label"
                  margin="dense"
                  value={
                    newSession.classId ? newSession.classId.toString() : ""
                  }
                  onChange={(e) => handleInputChange("classId", e.target.value)}
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
            <Stack mt={2} direction="row" spacing={1}>
              <TimePicker
                label="Start Time"
                value={
                  newSession.startTime
                    ? dayjs(newSession.startTime, "HH:mm:ss")
                    : null
                }
                onChange={(value: Dayjs | null) =>
                  handleTimeChange("startTime", value)
                }
              />
              <TimePicker
                label="End Time"
                value={
                  newSession.endTime
                    ? dayjs(newSession.endTime, "HH:mm:ss")
                    : null
                }
                onChange={(value: Dayjs | null) =>
                  handleTimeChange("endTime", value)
                }
              />
            </Stack>
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
