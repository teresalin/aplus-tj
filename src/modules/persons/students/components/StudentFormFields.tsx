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
import type { Grade } from "@/modules/grades";
import type { Student } from "@/modules/persons/students";

export interface StudentFormValues {
  name: string;
  preferredName: string;
  gender: Gender | "";
  dateOfBirth: Dayjs | null;
  notes: string;
  email: string;
  phone: string;
  currentSchool: string;
  gradeId: string;
  textbookPublisher: string;
  admissionDate: Dayjs | null;
  departureDate: Dayjs | null;
}

export const emptyStudentFormValues: StudentFormValues = {
  name: "",
  preferredName: "",
  gender: "",
  dateOfBirth: null,
  notes: "",
  email: "",
  phone: "",
  currentSchool: "",
  gradeId: "",
  textbookPublisher: "",
  admissionDate: null,
  departureDate: null,
};

export function toStudentFormValues(student: Student): StudentFormValues {
  return {
    name: student.person.name,
    preferredName: student.person.preferredName ?? "",
    gender: student.person.gender ?? "",
    dateOfBirth: toPickerDate(student.person.dateOfBirth),
    notes: student.person.notes ?? "",
    email: student.person.email,
    phone: student.person.phone ?? "",
    currentSchool: student.currentSchool ?? "",
    gradeId: student.grade.id,
    textbookPublisher: student.textbookPublisher ?? "",
    admissionDate: toPickerDate(student.admissionDate),
    departureDate: toPickerDate(student.departureDate),
  };
}

/** Request body for creating or updating a student. */
export function toStudentPayload(values: StudentFormValues) {
  return {
    ...values,
    dateOfBirth: fromPickerDate(values.dateOfBirth),
    admissionDate: fromPickerDate(values.admissionDate),
    departureDate: fromPickerDate(values.departureDate),
  };
}

export interface IStudentFormFieldsProps {
  student: StudentFormValues;
  setFormData: React.Dispatch<React.SetStateAction<StudentFormValues>>;
  grades: Grade[];
}

const StudentFormFields = ({
  student,
  setFormData,
  grades,
}: IStudentFormFieldsProps) => {
  const {
    name,
    preferredName,
    gender,
    dateOfBirth,
    notes,
    phone,
    email,
    currentSchool,
    gradeId,
    textbookPublisher,
    admissionDate,
    departureDate,
  } = student;

  const handleInputChange = <K extends keyof StudentFormValues>(
    field: K,
    value: StudentFormValues[K],
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
              margin="normal"
              value={name}
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
              margin="normal"
              value={preferredName}
              onChange={(e) =>
                handleInputChange("preferredName", e.target.value)
              }
            />
          </Grid>
        </Grid>
        <DatePicker
          label="Date of Birth"
          format="YYYY-MM-DD"
          value={dateOfBirth}
          onChange={(date) => handleInputChange("dateOfBirth", date)}
          sx={{ marginTop: "16px", marginBottom: "8px", width: "100%" }}
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
        <TextField
          fullWidth
          multiline
          id="notes"
          name="notes"
          label="Notes"
          maxRows={3}
          type="text"
          variant="outlined"
          margin="normal"
          placeholder="Hobbies, nicknames, etc."
          InputLabelProps={{ shrink: true }}
          value={notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
        />
      </Box>
      <Box mt={2}>
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
          margin="normal"
          value={email}
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
          margin="normal"
          value={phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
        />
      </Box>
      <Box mt={2}>
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
          margin="normal"
          value={currentSchool}
          onChange={(e) => handleInputChange("currentSchool", e.target.value)}
        />
        <Box mt="16px" mb="8px">
          <FormControl fullWidth>
            <InputLabel id="grade-select-label">Select a grade</InputLabel>
            <Select
              fullWidth
              required
              variant="outlined"
              id="grade"
              name="grade"
              label={"Select a grade"}
              labelId="grade-select-label"
              value={gradeId}
              onChange={(e) => handleInputChange("gradeId", e.target.value)}
            >
              {grades.map((grade) => (
                <MenuItem key={grade.id} value={grade.id}>
                  {grade.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TextField
          fullWidth
          required
          id="textbookPublisher"
          name="textbookPublisher"
          label="Textbook Publisher"
          type="text"
          variant="outlined"
          margin="normal"
          value={textbookPublisher}
          onChange={(e) =>
            handleInputChange("textbookPublisher", e.target.value)
          }
        />
      </Box>
      <Box mt={2}>
        <Typography variant="body2" display="block" gutterBottom>
          Enrollment Period
        </Typography>
        <Box mt="16px">
          <Grid container direction="row" spacing={1}>
            <Grid item xs={6}>
              <DatePicker
                label="Admission Date"
                format="YYYY-MM-DD"
                value={admissionDate}
                onChange={(date) => handleInputChange("admissionDate", date)}
                slotProps={{
                  textField: {
                    required: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="Departure Date"
                format="YYYY-MM-DD"
                value={departureDate}
                onChange={(date) => handleInputChange("departureDate", date)}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default StudentFormFields;
