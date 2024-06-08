import { DatePicker } from "@mui/x-date-pickers";
import Box from "@mui/material/Box";
import dayjs, { Dayjs } from "dayjs";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import utc from "dayjs/plugin/utc";

import { Class } from "../../classes";

dayjs.extend(utc);

export interface IAssignmentFormFieldsProps {
  assignment: any;
  onChange: (
    field: string,
    value: string | Date | Dayjs | null | Class
  ) => void;
  classes: Class[];
}

const AssignmentFormFields = ({
  assignment,
  onChange,
  classes,
}: IAssignmentFormFieldsProps) => {
  const handleClassChange = (event: SelectChangeEvent<number>) => {
    const value = parseInt(event.target.value as string, 10);
    const selectedClass = classes.find((c) => c.id === value);
    onChange("class", selectedClass || ({} as Class));
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
        value={assignment.name || ""}
        onChange={(e) => onChange("name", e.target.value)}
      />
      <DatePicker
        label="Due Date"
        format="YYYY-MM-DD"
        value={assignment.dueDate ? dayjs(assignment.dueDate).utc() : null}
        onChange={(date) => onChange("dueDate", date)}
        sx={{ marginTop: "8px", marginBottom: "4px", width: "100%" }}
        slotProps={{
          textField: {
            required: true,
          },
        }}
      />
      <Box mt="8px">
        <FormControl fullWidth>
          <InputLabel id="select-label">Assign to a class</InputLabel>
          <Select
            fullWidth
            required
            variant="outlined"
            id="class"
            name="class"
            label={"Assign to a class"}
            labelId="select-label"
            margin="dense"
            value={
              assignment.classInfo?.id ? assignment.classInfo.id.toString() : ""
            }
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
      <Box mt="4px">
        <TextField
          fullWidth
          id="description"
          name="description"
          label="Description"
          type="text"
          variant="outlined"
          margin="dense"
          value={assignment.description}
          onChange={(e) => onChange("description", e.target.value)}
          multiline
          maxRows={3}
        />
      </Box>
    </>
  );
};

export default AssignmentFormFields;
