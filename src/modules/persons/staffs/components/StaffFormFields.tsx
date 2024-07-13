import { DatePicker } from "@mui/x-date-pickers";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import utc from "dayjs/plugin/utc";

import { Role } from "../../roles";
import { CreateStaffDTO, UpdateStaffDTO } from "../dtos";

dayjs.extend(utc);

export interface IStaffFormFieldsProps {
  staff: CreateStaffDTO | UpdateStaffDTO;
  setFormData: React.Dispatch<
    React.SetStateAction<CreateStaffDTO | UpdateStaffDTO>
  >;
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
    joinDate,
    leaveDate,
  } = staff;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleRoleChange = (event: SelectChangeEvent<number>) => {
    const value = parseInt(event.target.value as string, 10);
    handleInputChange("roleId", value || 0);
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
          value={name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        <DatePicker
          label="Date of Birth"
          format="YYYY-MM-DD"
          value={dateOfBirth ? dayjs(dateOfBirth).utc() : null}
          onChange={(date) => handleInputChange("dateOfBirth", date)}
          sx={{ marginTop: "16px", width: "100%" }}
          slotProps={{
            textField: {
              required: true,
            },
          }}
        />
        <Box mt="4px">
          {/* TODO update to Select */}
          <TextField
            fullWidth
            required
            id="gender"
            name="gender"
            label="Select a gender"
            margin="normal"
            select
            value={gender || ""}
            onChange={(e) => handleInputChange("gender", e.target.value)}
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
            value={notes || ""}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
        </Box>
      </Box>
      <Box mt="16px">
        {/* TODO lowercase before storing into db */}
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
          value={email || ""}
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
            value={phone || ""}
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
              value={roleId || ""}
              onChange={handleRoleChange}
            >
              {roles &&
                roles.map((role: Role) => (
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
                label="Join Date"
                format="YYYY-MM-DD"
                value={joinDate ? dayjs(joinDate).utc() : null}
                onChange={(date) => handleInputChange("joinDate", date)}
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
                value={leaveDate ? dayjs(leaveDate).utc() : null}
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
