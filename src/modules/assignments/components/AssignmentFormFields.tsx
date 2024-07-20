import { DatePicker } from "@mui/x-date-pickers";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import utc from "dayjs/plugin/utc";

import { Class } from "../../classes";
import { CreateAssignmentDTO, UpdateAssignmentDTO } from "../dtos";

dayjs.extend(utc);

export interface IAssignmentFormFieldsProps {
  assignment: CreateAssignmentDTO | UpdateAssignmentDTO;
  setFormData: React.Dispatch<
    React.SetStateAction<CreateAssignmentDTO | UpdateAssignmentDTO>
  >;
  classes: Class[];
}

const AssignmentFormFields = ({
  assignment,
  setFormData,
  classes,
}: IAssignmentFormFieldsProps) => {
  const { name, dueDate, description, classId } = assignment;
  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleClassChange = (event: SelectChangeEvent<number>) => {
    const value = parseInt(event.target.value as string, 10);
    handleInputChange("classId", value || 0);
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
        value={name || ""}
        onChange={(e) => handleInputChange("name", e.target.value)}
      />
      <DatePicker
        label="Due Date"
        format="YYYY-MM-DD"
        value={dueDate ? dayjs(dueDate).utc() : null}
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
            value={classId || ""}
            onChange={handleClassChange}
          >
            {classes &&
              classes.map((item: Class) => (
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
