import { FormEvent, FormEventHandler } from "react";
import { Role } from "../../../../pages/api/staffs/roles";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import fetcher from "../../../../utils/fetcher";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import dayjs from "dayjs";

function RedBar() {
  return (
    <Box
      sx={{
        height: 20,
      }}
    />
  );
}

export interface IUpdateCreatePersonDialogProps {
  personType;
  existingData;
  open: boolean;
  onClose: () => void;
  onSubmit;
}

export default function UpdateCreatePersonDialog({
  personType,
  existingData,
  open,
  onClose,
  onSubmit,
}: IUpdateCreatePersonDialogProps) {
  const [editedData, setEditedData] = React.useState(existingData);
  const [role, setRole] = React.useState("");
  // const [open, setOpen] = React.useState(false);
  const { data } = useSWR("/api/staffs/roles", fetcher);
  const roles = data || ([] as Role[]);

  const personIdParam = `[${personType.slice(0, -1)}_id]`;

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

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
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
              value={editedData.name}
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
              value={dayjs(editedData.dateOfBirth).format("YYYY-MM-DD")}
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
              value={editedData.notes}
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
              value={editedData.email}
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
              value={editedData.phone}
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
                  value={dayjs(editedData.joinDate).format("YYYY-MM-DD")}
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
                  value={dayjs(editedData.leaveDate).format("YYYY-MM-DD")}
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
