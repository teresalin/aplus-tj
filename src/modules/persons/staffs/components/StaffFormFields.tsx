"use client";

import type { Gender } from "@prisma/client";
import { DatePicker } from "@mui/x-date-pickers";
import Box from "@mui/material/Box";
import type { Dayjs } from "dayjs";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { fromPickerDate, toPickerDate } from "@/lib/dates";
import type { Staff } from "@/modules/persons/staffs";
import type { Role } from "@/modules/roles";

export interface StaffFormValues {
  name: string;
  gender: Gender | "";
  dateOfBirth: Dayjs | null;
  notes: string;
  email: string;
  phone: string;
  roleId: string;
  hireDate: Dayjs | null;
  leaveDate: Dayjs | null;
}

export const emptyStaffFormValues: StaffFormValues = {
  name: "",
  gender: "",
  dateOfBirth: null,
  notes: "",
  email: "",
  phone: "",
  roleId: "",
  hireDate: null,
  leaveDate: null,
};

export function toStaffFormValues(staff: Staff): StaffFormValues {
  return {
    name: staff.person.name,
    gender: staff.person.gender ?? "",
    dateOfBirth: toPickerDate(staff.person.dateOfBirth),
    notes: staff.person.notes ?? "",
    email: staff.person.email,
    phone: staff.person.phone ?? "",
    roleId: staff.roleId,
    hireDate: toPickerDate(staff.hireDate),
    leaveDate: toPickerDate(staff.leaveDate),
  };
}

/** Request body for creating or updating a staff member. */
export function toStaffPayload(values: StaffFormValues) {
  return {
    ...values,
    dateOfBirth: fromPickerDate(values.dateOfBirth),
    hireDate: fromPickerDate(values.hireDate),
    leaveDate: fromPickerDate(values.leaveDate),
  };
}

export interface IStaffFormFieldsProps {
  staff: StaffFormValues;
  setFormData: React.Dispatch<React.SetStateAction<StaffFormValues>>;
  roles: Role[];
}

const StaffFormFields = ({
  staff,
  setFormData,
  roles,
}: IStaffFormFieldsProps) => {
  const {
    name,
    gender,
    dateOfBirth,
    notes,
    phone,
    email,
    roleId,
    hireDate,
    leaveDate,
  } = staff;

  const handleInputChange = <K extends keyof StaffFormValues>(
    field: K,
    value: StaffFormValues[K],
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
      <Box>
        <Typography variant="body2" display="block" gutterBottom>
          Basic Information
        </Typography>
        <TextField
          id="name"
          name="name"
          label="Full Name"
          margin="dense"
          required
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        <DatePicker
          label="Date of Birth"
          format="YYYY-MM-DD"
          value={dateOfBirth}
          onChange={(date) => handleInputChange("dateOfBirth", date)}
          sx={{ marginTop: "16px", width: "100%" }}
          slotProps={{
            textField: {
              required: true,
            },
          }}
        />
        <Box mt="4px">
          <TextField
            fullWidth
            required
            id="gender"
            name="gender"
            label="Select a gender"
            margin="normal"
            select
            value={gender}
            onChange={(e) =>
              handleInputChange("gender", e.target.value as Gender)
            }
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Box>
        <Box mt="4px">
          <TextField
            multiline
            margin="dense"
            id="notes"
            name="notes"
            label="Notes"
            type="text"
            fullWidth
            maxRows={3}
            variant="outlined"
            placeholder="Hobbies, nicknames, etc."
            InputLabelProps={{ shrink: true }}
            value={notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
        </Box>
      </Box>
      <Box mt="16px">
        <Typography variant="body2" display="block" gutterBottom>
          Contact Information
        </Typography>
        <TextField
          required
          margin="dense"
          id="email"
          name="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        <Box mt="8px">
          <TextField
            required
            margin="dense"
            id="phone"
            name="phone"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
        </Box>
      </Box>
      <Box mt="16px">
        <Typography variant="body2" display="block" gutterBottom>
          Role
        </Typography>
        <Box mt="8px">
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Select a role</InputLabel>
            <Select
              fullWidth
              required
              variant="outlined"
              id="role"
              name="role"
              label={"Select a role"}
              labelId="role-select-label"
              value={roleId}
              onChange={(e) => handleInputChange("roleId", e.target.value)}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box mt="20px">
        <Typography variant="body2" display="block" gutterBottom>
          Enrollment Period
        </Typography>
        <Box mt="8px">
          <Grid container direction="row" spacing={1}>
            <Grid item xs={6}>
              <DatePicker
                label="Hire Date"
                format="YYYY-MM-DD"
                value={hireDate}
                onChange={(date) => handleInputChange("hireDate", date)}
                slotProps={{
                  textField: {
                    required: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="Leave Date"
                format="YYYY-MM-DD"
                value={leaveDate}
                onChange={(date) => handleInputChange("leaveDate", date)}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default StaffFormFields;
