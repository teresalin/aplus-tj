"use client";

import { DatePicker } from "@mui/x-date-pickers";
import Box from "@mui/material/Box";
import type { Dayjs } from "dayjs";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import { fromPickerDate, toPickerDate } from "@/lib/dates";
import type { Assignment } from "@/modules/assignments";
import type { ClassOption } from "@/modules/classes";

export interface AssignmentFormValues {
  name: string;
  classId: string;
  description: string;
  dueDate: Dayjs | null;
}

export const emptyAssignmentFormValues: AssignmentFormValues = {
  name: "",
  classId: "",
  description: "",
  dueDate: null,
};

export function toAssignmentFormValues(
  assignment: Assignment,
): AssignmentFormValues {
  return {
    name: assignment.name,
    classId: assignment.class?.id ?? "",
    description: assignment.description ?? "",
    dueDate: toPickerDate(assignment.dueDate),
  };
}

/** Request body for creating or updating an assignment. */
export function toAssignmentPayload(values: AssignmentFormValues) {
  return { ...values, dueDate: fromPickerDate(values.dueDate) };
}

export interface IAssignmentFormFieldsProps {
  assignment: AssignmentFormValues;
  setFormData: React.Dispatch<React.SetStateAction<AssignmentFormValues>>;
  classes: ClassOption[];
}

const AssignmentFormFields = ({
  assignment,
  setFormData,
  classes,
}: IAssignmentFormFieldsProps) => {
  const { name, dueDate, description, classId } = assignment;

  const handleInputChange = <K extends keyof AssignmentFormValues>(
    field: K,
    value: AssignmentFormValues[K],
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
      <TextField
        fullWidth
        required
        id="name"
        name="name"
        label="Assignment Name"
        type="text"
        variant="outlined"
        margin="dense"
        value={name}
        onChange={(e) => handleInputChange("name", e.target.value)}
      />
      <DatePicker
        label="Due Date"
        format="YYYY-MM-DD"
        value={dueDate}
        onChange={(date) => handleInputChange("dueDate", date)}
        sx={{ marginTop: "16px", width: "100%" }}
        slotProps={{
          textField: {
            required: true,
          },
        }}
      />
      <Box mt="20px">
        <FormControl fullWidth>
          <InputLabel id="class-select-label">Assign to a class</InputLabel>
          <Select
            fullWidth
            required
            variant="outlined"
            id="class"
            name="class"
            label={"Assign to a class"}
            labelId="class-select-label"
            margin="dense"
            value={classId}
            onChange={(e) => handleInputChange("classId", e.target.value)}
          >
            {classes.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box mt="12px">
        <TextField
          fullWidth
          id="description"
          name="description"
          label="Description"
          type="text"
          variant="outlined"
          margin="dense"
          value={description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          multiline
          maxRows={3}
        />
      </Box>
    </>
  );
};

export default AssignmentFormFields;
