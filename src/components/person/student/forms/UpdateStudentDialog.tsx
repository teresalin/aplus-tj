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

import fetcher from "../../../../../utils/fetcher";
import { Grade } from "../../../../../pages/api/grades";
import { Student } from "../types";

function RedBar() {
  return (
    <Box
      sx={{
        height: 20,
      }}
    />
  );
}

export interface IUpdateStudentDialogProps {
  student: Student;
  open: boolean;
  onClose;
  onSubmit;
}

export default function UpdateStudentDialog({
  student,
  open,
  onClose,
  onSubmit,
}: IUpdateStudentDialogProps) {
  const [formData, setFormData] = React.useState({} as Student);
  const { data } = useSWR("/api/grades", fetcher);
  const grades = data || [];

  React.useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const handleInputChange = (field: string, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // Find the selected grade object from your grades array
    const selectedGrade = grades.find((grade) => grade.id === value);
    setFormData((prevData) => ({
      ...prevData,
      grade: selectedGrade || {},
    }));
  };

  const handleSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    onSubmit(formData);
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
                  fullWidth
                  required
                  id="name"
                  name="name"
                  label="Full Name"
                  type="text"
                  variant="outlined"
                  margin="dense"
                  value={formData.name || ""}
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
                  value={formData.englishName || ""}
                  onChange={(e) =>
                    handleInputChange("englishName", e.target.value)
                  }
                />
              </Grid>
            </Grid>
            <DatePicker
              label="Date of Birth"
              format="YYYY-MM-DD"
              // We want to put a null value here so the date picker field
              // does not complain anad show a red error outline
              value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
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
              value={formData.gender || ""}
              onChange={(e) => handleInputChange("gender", e.target.value)}
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
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
            <RedBar />
            {/* TODO lowercase before storing into db */}
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
              value={formData.email || ""}
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
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            <RedBar />
            <Typography variant="body2" display="block" gutterBottom>
              School Information
            </Typography>
            <TextField
              fullWidth
              required
              id="currentSchool"
              name="currentSchool"
              label="Current School"
              type="text"
              variant="outlined"
              margin="dense"
              value={formData.currentSchool || ""}
              onChange={(e) =>
                handleInputChange("currentSchool", e.target.value)
              }
            />
            {/* TODO update to Select */}
            <TextField
              fullWidth
              required
              id="grade"
              name="grade"
              label="Select a grade"
              margin="dense"
              select
              value={formData.grade?.id || ""}
              onChange={handleGradeChange}
            >
              {grades &&
                grades.map((grade: Grade) => (
                  <MenuItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              fullWidth
              required
              id="textbookPublisher"
              name="textbookPublisher"
              label="Textbook Publisher"
              type="text"
              variant="outlined"
              margin="dense"
              value={formData.textbookPublisher || ""}
              onChange={(e) =>
                handleInputChange("textbookPublisher", e.target.value)
              }
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
                  value={formData.joinDate ? dayjs(formData.joinDate) : null}
                  onChange={(date) => handleInputChange("joinDate", date)}
                  sx={{ marginTop: "8px", marginBottom: "4px" }}
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
                  value={formData.leaveDate ? dayjs(formData.leaveDate) : null}
                  onChange={(date) => handleInputChange("leaveDate", date)}
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
