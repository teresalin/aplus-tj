"use client";

import type { Gender } from "@prisma/client";
import type React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
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

export const emptyParentFormValues: ParentFormValues = {
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

export interface IParentFormFieldsProps {
  parent: ParentFormValues;
  setFormData: React.Dispatch<React.SetStateAction<ParentFormValues>>;
}

export default function ParentFormFields({
  parent,
  setFormData,
}: IParentFormFieldsProps) {
  const handleInputChange = <K extends keyof ParentFormValues>(
    field: K,
    value: ParentFormValues[K],
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
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
            value={parent.name}
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
            value={parent.preferredName}
            onChange={(e) => handleInputChange("preferredName", e.target.value)}
          />
        </Grid>
      </Grid>
      <DatePicker
        label="Date of Birth"
        format="YYYY-MM-DD"
        value={parent.dateOfBirth}
        onChange={(date) => handleInputChange("dateOfBirth", date)}
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
        id="gender"
        name="gender"
        label="Select a gender"
        margin="dense"
        select
        value={parent.gender}
        onChange={(e) => handleInputChange("gender", e.target.value as Gender)}
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
        value={parent.notes}
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
        value={parent.email}
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
        value={parent.phone}
        onChange={(e) => handleInputChange("phone", e.target.value)}
      />
    </>
  );
}
