"use client";

import type { Gender } from "@prisma/client";
import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import Button from "@mui/material/Button";
import type { Dayjs } from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { fromPickerDate } from "@/lib/dates";

export interface ParentFormValues {
  name: string;
  preferredName: string;
  gender: Gender | "";
  dateOfBirth: Dayjs | null;
  notes: string;
  email: string;
  phone: string;
}

const emptyParentFormValues: ParentFormValues = {
  name: "",
  preferredName: "",
  gender: "",
  dateOfBirth: null,
  notes: "",
  email: "",
  phone: "",
};

/** Request body for creating a parent. */
export function toParentPayload(values: ParentFormValues) {
  return { ...values, dateOfBirth: fromPickerDate(values.dateOfBirth) };
}

export interface ICreateParentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ParentFormValues, resetForm: () => void) => Promise<void>;
}

export default function CreateParentDialog({
  open,
  onClose,
  onSubmit,
}: ICreateParentDialogProps) {
  const [newParent, setNewParent] = React.useState(emptyParentFormValues);

  const handleInputChange = <K extends keyof ParentFormValues>(
    field: K,
    value: ParentFormValues[K],
  ) => {
    setNewParent((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    await onSubmit(newParent, () => setNewParent(emptyParentFormValues));
  };

  return (
    <Dialog disablePortal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New Parent</DialogTitle>
        <DialogContent>
          <Typography variant="body2" display="block" gutterBottom>
            Basic Information
          </Typography>
          <Grid container direction="row" spacing={{ xs: 0, sm: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                id="name"
                name="name"
                label="Full Name"
                type="text"
                variant="outlined"
                margin="dense"
                value={newParent.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="englishName"
                name="englishName"
                label="English Name"
                type="text"
                variant="outlined"
                margin="dense"
                value={newParent.preferredName}
                onChange={(e) =>
                  handleInputChange("preferredName", e.target.value)
                }
              />
            </Grid>
          </Grid>
          <DatePicker
            label="Date of Birth"
            format="YYYY-MM-DD"
            value={newParent.dateOfBirth}
            onChange={(date) => handleInputChange("dateOfBirth", date)}
            sx={{ marginTop: "8px", marginBottom: "4px", width: "100%" }}
            slotProps={{
              textField: {
                required: true,
              },
            }}
          />
          {/* TODO update to Select */}
          <TextField
            fullWidth
            required
            id="gender"
            name="gender"
            label="Select a gender"
            margin="dense"
            select
            value={newParent.gender}
            onChange={(e) =>
              handleInputChange("gender", e.target.value as Gender)
            }
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            fullWidth
            multiline
            id="notes"
            name="notes"
            label="Notes"
            maxRows={3}
            type="text"
            variant="outlined"
            margin="dense"
            placeholder="Hobbies, nicknames, etc."
            InputLabelProps={{ shrink: true }}
            value={newParent.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
          <Typography variant="body2" display="block" gutterBottom>
            Contact Information
          </Typography>
          <TextField
            fullWidth
            required
            id="email"
            name="email"
            label="Email Address"
            type="email"
            variant="outlined"
            margin="dense"
            value={newParent.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <TextField
            fullWidth
            required
            id="phone"
            name="phone"
            label="Phone Number"
            type="tel"
            variant="outlined"
            margin="dense"
            value={newParent.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button autoFocus type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
