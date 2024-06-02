import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import { CreateStudentDTO } from "../dtos/create-student.dto";
import { Grade } from "../../../../pages/api/grades";
import fetcher from "../../../../../utils/fetcher";
import StudentFormFields from "./StudentFormFields";
import { Dayjs } from "dayjs";

export interface ICreateStudentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentDTO, resetForm: () => void) => Promise<void>;
}

export default function CreateStudentDialog({
  open,
  onClose,
  onSubmit,
}: ICreateStudentDialogProps) {
  const initialStudentState = {} as CreateStudentDTO;
  const [newStudent, setNewStudent] = React.useState(initialStudentState);
  const { data } = useSWR("/api/grades", fetcher);
  const grades = (data as Grade[]) || [];

  const handleInputChange = (
    field: string,
    value: string | Date | Dayjs | null
  ) => {
    setNewStudent((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault(); // Prevent default form submission behavior
    await onSubmit(newStudent, () => setNewStudent(initialStudentState));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New Student</DialogTitle>
        <DialogContent>
          <StudentFormFields
            student={newStudent}
            onChange={handleInputChange}
            grades={grades}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button autoFocus type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
