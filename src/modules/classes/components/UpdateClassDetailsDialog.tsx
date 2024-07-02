import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useSWR from "swr";

import { Class } from "../types";
import { classToUpdateClassDTO } from "../class.transformers";
import { UpdateClassDTO } from "../dtos";
import fetcher from "../../../../utils/fetcher";
import ClassFormFields from "./ClassFormFields";

export interface IUpdateClassDetailsDialogProps {
  existingClass: Class | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateClassDTO) => Promise<void>;
}

export default function UpdateClassDetailsDialogProps({
  existingClass,
  open,
  onClose,
  onSubmit,
}: IUpdateClassDetailsDialogProps) {
  const initialClassState = {} as UpdateClassDTO;
  const [formData, setFormData] = React.useState(initialClassState);
  const { data: staffsData, error: staffsError } = useSWR(
    "/api/persons/staffs",
    fetcher
  );
  const { data: gradesData, error: gradesError } = useSWR(
    "/api/grades",
    fetcher
  );
  const teachers = staffsData || [];
  const grades = gradesData || [];

  React.useEffect(() => {
    if (open && existingClass) {
      setFormData(classToUpdateClassDTO(existingClass));
    }
  }, [open, existingClass]);

  // Custom validation is required since form is unable to detected the required field in TimePicker
  function hasEmptyOrInvalidTimeValues() {
    return formData.schedules?.some(
      (schedule) =>
        !schedule.startTime ||
        !schedule.endTime ||
        schedule.startTime === "Invalid Date" ||
        schedule.endTime === "Invalid Date"
    );
  }

  // TODO fix submit
  const handleSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    if (hasEmptyOrInvalidTimeValues()) {
      alert("Please fill out all time values.");
    } else {
      onSubmit(formData);
    }
  };

  return (
    formData && (
      <>
        <Dialog disablePortal open={open} onClose={onClose}>
          <form onSubmit={handleSubmit}>
            <DialogTitle>Update Class Details</DialogTitle>
            <DialogContent>
              <ClassFormFields
                classData={formData}
                setFormData={setFormData}
                grades={grades}
                teachers={teachers}
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
      </>
    )
  );
}
