import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useSWR from "swr";

import { CreateClassDTO } from "../dtos";
import { Schedule } from "../../schedules";
import ClassFormFields from "./ClassFormFields";
import fetcher from "../../../../utils/fetcher";

export interface ICreateClassDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClassDTO) => Promise<void>;
}

export default function CreateClassDialog({
  open,
  onClose,
  onSubmit,
}: ICreateClassDialogProps) {
  const [newClass, setNewClass] = React.useState({} as CreateClassDTO);
  const [schedules, setSchedules] = React.useState([] as Schedule[]);
  const { data: staffsData, error: staffsError } = useSWR(
    open ? "/api/persons/staffs" : null,
    fetcher
  );
  const { data: gradesData, error: gradesError } = useSWR(
    open ? "/api/grades" : null,
    fetcher
  );
  const teachers = staffsData || [];
  const grades = gradesData || [];

  const handleInputChange = (field: string, value: any) => {
    setNewClass((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    // Combine the newClass state with schedules
    const classDataToSubmit = {
      ...newClass,
      schedules: schedules,
    };
    onSubmit(classDataToSubmit);
  };

  return (
    <>
      <Dialog disablePortal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Class</DialogTitle>
          <DialogContent>
            <ClassFormFields
              classData={newClass}
              onChange={handleInputChange}
              grades={grades}
              teachers={teachers}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            {/* calling onSubmit at the <form> level instead of the button level ensures that 
            the form can be submitted not only when the submit button is clicked but also 
            when the user presses the Enter key while focusing on any input within the form.
            This is more ideal because it works with keyboard actions and ensures accessibility */}
            <Button autoFocus type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
