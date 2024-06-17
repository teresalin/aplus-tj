import { TimePicker } from "@mui/x-date-pickers";
import { Grade } from "../../grades";
import Box from "@mui/material/Box";
import dayjs, { Dayjs } from "dayjs";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { CreateClassDTO, UpdateClassDTO } from "../dtos";
import { dayOfWeek } from "../../../constants";
import { Schedule } from "../../schedules";
import { Staff, StaffSummary } from "../../persons/staffs";

export interface IClassFormFieldsProps {
  classData: CreateClassDTO | UpdateClassDTO;
  onChange: (field: string, value: any) => void;
  grades: Grade[];
  teachers: Staff[];
}

const ClassFormFields = ({
  classData,
  onChange,
  grades,
  teachers,
}: IClassFormFieldsProps) => {
  const handleGradeChange = (event: SelectChangeEvent<number>) => {
    const value = parseInt(event.target.value as string, 10);
    const selectedGrade = grades.find((grade) => grade.id === value);
    onChange("grade", selectedGrade || ({} as Grade));
  };

  const handleTeacherChange = (event: SelectChangeEvent<number>) => {
    const value = parseInt(event.target.value as string, 10);
    const selectedTeacher = teachers.find(
      (teacher) => teacher.staffId === value
    );
    onChange("teacher", selectedTeacher || ({} as StaffSummary));
  };

  const handleSwitchChange = (day: string) => {
    const existingSchedule = classData.schedules?.find(
      (schedule) => schedule.dayOfWeek === day
    );
    if (existingSchedule) {
      onChange(
        "schedules",
        classData.schedules?.filter((schedule) => schedule.dayOfWeek !== day)
      );
    } else {
      onChange("schedules", [
        ...(classData.schedules || []),
        { dayOfWeek: day, startTime: "", endTime: "" },
      ] as Schedule[]);
    }
  };

  const handleTimeChange = (
    field: string,
    day: string,
    newValue: Dayjs | null
  ) => {
    onChange(
      "schedules",
      classData.schedules?.map((schedule) => {
        if (schedule.dayOfWeek === day) {
          return {
            ...schedule,
            [field]: newValue ? newValue.format("HH:mm:ss") : "00:00:00",
          };
        }
        return schedule;
      })
    );
  };

  return (
    <>
      <Typography variant="body2" display="block">
        Class Information
      </Typography>
      <TextField
        required
        margin="dense"
        id="name"
        name="name"
        label="Name"
        type="text"
        defaultValue={classData.name || ""}
        fullWidth
        variant="outlined"
        onChange={(e) => onChange("name", e.target.value)}
      />
      <Box mt="8px">
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
            margin="dense"
            value={classData.gradeId || ""}
            onChange={handleGradeChange}
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
      <Box mt="12px">
        <FormControl fullWidth>
          <InputLabel id="teacher-select-label">Select a teacher</InputLabel>
          <Select
            fullWidth
            required
            variant="outlined"
            id="teacher"
            name="teacher"
            label={"Select a teacher"}
            labelId="teacher-select-label"
            margin="dense"
            value={classData.teacherId || ""}
            onChange={handleTeacherChange}
          >
            {teachers &&
              teachers.map((teacher: Staff) => (
                <MenuItem key={teacher.staffId} value={teacher.staffId}>
                  {teacher.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      <Box mt="4px">
        <TextField
          required
          margin="dense"
          id="capacity"
          name="capacity"
          label="Student Capacity"
          type="number"
          fullWidth
          variant="outlined"
          value={classData.capacity || ""}
          onChange={(e) => onChange("capacity", e.target.value)}
        />
      </Box>
      <Typography variant="body2" display="block">
        Class Schedule
      </Typography>
      {classData &&
        dayOfWeek.map((day) => (
          <Box key={day} my={1}>
            <Grid container item key={day} spacing={1} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        classData.schedules
                          ? Boolean(
                              classData.schedules.find(
                                (schedule) => schedule.dayOfWeek === day
                              )
                            )
                          : false
                      }
                      onChange={() => handleSwitchChange(day)}
                    />
                  }
                  label={day}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TimePicker
                  label="Start Time"
                  slotProps={{ textField: { size: "small" } }}
                  value={
                    classData.schedules &&
                    classData.schedules.find(
                      (schedule) => schedule.dayOfWeek === day
                    )
                      ? dayjs(
                          classData.schedules.find(
                            (schedule) => schedule.dayOfWeek === day
                          )?.startTime,
                          "HH:mm:ss"
                        )
                      : null
                  }
                  onChange={(newValue: Dayjs | null) =>
                    handleTimeChange("startTime", day, newValue)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TimePicker
                  label="End Time"
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                  value={
                    classData.schedules &&
                    classData.schedules.find(
                      (schedule) => schedule.dayOfWeek === day
                    )
                      ? dayjs(
                          classData.schedules.find(
                            (schedule) => schedule.dayOfWeek === day
                          )?.endTime,
                          "HH:mm:ss"
                        )
                      : null
                  }
                  onChange={(newValue: Dayjs | null) =>
                    handleTimeChange("endTime", day, newValue)
                  }
                />
              </Grid>
            </Grid>
          </Box>
        ))}
    </>
  );
};

export default ClassFormFields;
