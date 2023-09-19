import { FormEvent, FormEventHandler } from "react";
import { Role } from "../../../pages/api/staffs/roles";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import fetcher from "../../../utils/fetcher";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

function RedBar() {
  return (
    <Box
      sx={{
        height: 20,
      }}
    />
  );
}

export interface INewPersonDialogProps {
  personType;
  open: boolean;
  onClose: () => void;
  onSubmit;
}

export default function EditAssignmentDialog({
  personType,
  open,
  onClose,
  onSubmit,
}: INewPersonDialogProps) {
  const [newPerson, setNewPerson] = React.useState({
    name: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    notes: "",
    joinDate: "",
    leaveDate: "",
  });
  const [role, setRole] = React.useState("");
  // const [open, setOpen] = React.useState(false);
  const { data } = useSWR("/api/staffs/roles", fetcher);
  const roles = data || ([] as Role[]);

  const personIdParam = `[${personType.slice(0, -1)}_id]`;

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const handleSubmit: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(newPerson);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPerson((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Dialog disablePortal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New {personType.slice(0, -1)}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" display="block">
              Basic Information
            </Typography>
            <TextField
              required
              margin="dense"
              id="name"
              name="name"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newPerson.name}
              onChange={handleInputChange}
            />
            {/* TODO format date in yyyy-mm-dd format */}
            <TextField
              required
              margin="dense"
              id="dateOfBirth"
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={newPerson.dateOfBirth}
              onChange={handleInputChange}
            />
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
              value={newPerson.notes}
              onChange={handleInputChange}
            />
            <RedBar />
            {personType === "staffs" && (
              <div>
                <Typography variant="body2" display="block">
                  Role
                </Typography>
                {/* TODO fix default value */}
                <Select
                  fullWidth
                  // labelId="demo-simple-select-label"
                  id="roleId"
                  name="roleId"
                  value={role}
                  label="Role"
                  displayEmpty
                  onChange={handleRoleChange}
                >
                  {roles.map((role: Role) => (
                    <MenuItem value={role.id}>{role.name}</MenuItem>
                  ))}
                </Select>
                <RedBar />
              </div>
            )}
            {/* TODO lowercase before storing into db */}
            <Typography variant="body2" display="block">
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
              value={newPerson.email}
              onChange={handleInputChange}
            />
            <TextField
              required
              margin="dense"
              id="phone"
              name="phone"
              label="Phone Number"
              type="tel"
              fullWidth
              variant="outlined"
              value={newPerson.phone}
              onChange={handleInputChange}
            />
            <RedBar />
            {personType !== "parents" && (
              <div>
                <Typography variant="body2" display="block">
                  Enrollment Period
                </Typography>
                <TextField
                  required
                  margin="dense"
                  id="joinDate"
                  name="joinDate"
                  label="Join Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={newPerson.joinDate}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  id="leaveDate"
                  name="leaveDate"
                  label="Leave Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={newPerson.leaveDate}
                  onChange={handleInputChange}
                />
              </div>
            )}
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
