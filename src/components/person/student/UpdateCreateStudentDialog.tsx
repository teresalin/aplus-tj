import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { FormEvent, FormEventHandler } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import fetcher from "../../../../utils/fetcher";
import { Grade } from "../../../../pages/api/students/grades";
import { Role } from "../../../../pages/api/staffs/roles";
import { Student } from "../../../../pages/api/students";

function RedBar() {
  return (
    <Box
      sx={{
        height: 20,
      }}
    />
  );
}

export interface IUpdateCreateStudentDialogProps {
  isUpdate: boolean;
  existingData: Student;
  open: boolean;
  onClose: () => void;
  onSubmit;
}

export default function UpdateCreateStudentDialog({
  isUpdate,
  existingData,
  open,
  onClose,
  onSubmit,
}: IUpdateCreateStudentDialogProps) {
  const [editedData, setEditedData] = React.useState(existingData);
  const { data } = useSWR("/api/students/grades", fetcher);
  const grades = data || ([] as Role[]);

  console.log(existingData);

  React.useEffect(() => {
    if (isUpdate) {
      setEditedData(existingData);
    } else {
      setEditedData({} as Student);
    }
  }, [existingData]);

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
          <DialogTitle>New Student</DialogTitle>
          <DialogContent>
            <Typography variant="body2" display="block" gutterBottom>
              Basic Information
            </Typography>
            <Grid container direction="row" spacing={{ xs: 0, sm: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  margin="dense"
                  id="name"
                  name="name"
                  label="Full Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={editedData.name || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  id="name"
                  name="name"
                  label="English Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={editedData.englishName || ""}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <DatePicker
              label="Date of Birth"
              format="YYYY-MM-DD"
              value={
                editedData.dateOfBirth ? dayjs(editedData.dateOfBirth) : null
              }
              sx={{ marginTop: "8px", marginBottom: "4px", width: "100%" }}
            />
            <TextField
              id="gender"
              name="gender"
              label="Select a gender"
              margin="dense"
              required
              select
              fullWidth
              onChange={handleInputChange}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
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
              value={editedData.notes ? editedData.notes : ""}
              onChange={handleInputChange}
            />
            <RedBar />
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
              value={editedData.email || ""}
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
              value={editedData.phone || ""}
              onChange={handleInputChange}
            />
            <RedBar />
            <Typography variant="body2" display="block" gutterBottom>
              School Information
            </Typography>
            <TextField
              required
              margin="dense"
              id="currentSchool"
              name="currentSchool"
              label="Current School"
              type="text"
              fullWidth
              variant="outlined"
              value={editedData.currentSchool || ""}
              onChange={handleInputChange}
            />
            <TextField
              id="grade"
              name="grade"
              label="Select a grade"
              margin="dense"
              required
              select
              fullWidth
              onChange={handleInputChange}
            >
              {grades &&
                grades.map((grade: Grade) => (
                  <MenuItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              required
              margin="dense"
              id="textbookPublisher"
              name="textbookPublisher"
              label="Textbook Publisher"
              type="text"
              fullWidth
              variant="outlined"
              value={editedData.textbookPublisher}
              onChange={handleInputChange}
            />
            <RedBar />
            <Typography variant="body2" display="block" gutterBottom>
              Enrollment Period
            </Typography>
            <Grid container direction="row" spacing={1}>
              <Grid item xs={6}>
                <DatePicker
                  label="Join Date"
                  format="YYYY-MM-DD"
                  value={
                    editedData.joinDate ? dayjs(editedData.joinDate) : null
                  }
                  sx={{ marginTop: "8px", marginBottom: "4px" }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="Leave Date"
                  format="YYYY-MM-DD"
                  value={
                    editedData.leaveDate ? dayjs(editedData.leaveDate) : null
                  }
                  sx={{ marginTop: "8px", marginBottom: "4px" }}
                />
              </Grid>
            </Grid>
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
