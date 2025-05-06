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

import { CreateStudentDTO, UpdateStudentDTO } from "../dtos";
import { Grade } from "../../../grades";

dayjs.extend(utc);

export interface IStudentFormFieldsProps {
  student: CreateStudentDTO | UpdateStudentDTO;
  setFormData: React.Dispatch<
    React.SetStateAction<CreateStudentDTO | UpdateStudentDTO>
  >;
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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // const handleGradeChange = (event: SelectChangeEvent<number>) => {
  //   const value = parseInt(event.target.value as string, 10);
  //   handleInputChange("gradeId", value || 0);
  // };

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
              value={name || ""}
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
              value={preferredName || ""}
              onChange={(e) =>
                handleInputChange("preferredName", e.target.value)
              }
            />
          </Grid>
        </Grid>
        <DatePicker
          label="Date of Birth"
          format="YYYY-MM-DD"
          // We want to put a null value here so the date picker field
          // does not complain and show a red error outline
          // Handle date as utc at all times
          // TODO: Deal with timezone and format here or when saving?
          value={dateOfBirth ? dayjs(dateOfBirth).utc() : null}
          onChange={(date) =>
            handleInputChange(
              "dateOfBirth",
              date ? dayjs(date).utc().format("YYYY-MM-DD") : null
            )
          }
          sx={{ marginTop: "16px", marginBottom: "8px", width: "100%" }}
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
          margin="normal"
          select
          value={gender || ""}
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
          margin="normal"
          placeholder="Hobbies, nicknames, etc."
          InputLabelProps={{ shrink: true }}
          value={notes || ""}
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
          value={email || ""}
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
          value={phone || ""}
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
          value={currentSchool || ""}
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
              value={gradeId || ""}
              onChange={(e) => handleInputChange("gradeId", e.target.value)}
            >
              {grades &&
                grades.map((grade: Grade) => (
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
          value={textbookPublisher || ""}
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
                value={admissionDate ? dayjs(admissionDate) : null}
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
                value={departureDate ? dayjs(departureDate) : null}
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
