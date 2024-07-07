import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useSWR, { mutate } from "swr";

import { Class } from "../types";
import { classToUpdateClassDTO } from "../class.transformers";
import { UpdateClassDTO } from "../dtos";
import fetcher from "../../../../utils/fetcher";
import ClassFormFields from "./ClassFormFields";

export interface IUpdateClassDetailsDialogProps {
  existingClass: Class | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateClassDTO, resetForm: () => void) => Promise<void>;
}

export default function UpdateClassDetailsDialogProps({
  existingClass,
  open,
  onClose,
  onSubmit,
}: IUpdateClassDetailsDialogProps) {
  const initialClassState = {} as UpdateClassDTO;
  const [formData, setFormData] =
    React.useState<UpdateClassDTO>(initialClassState);
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
      mutate(`/api/classes/${existingClass.id}`).then(() => {
        setFormData(classToUpdateClassDTO(existingClass));
      });
    }
  }, [open, existingClass]);

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    await onSubmit(formData as UpdateClassDTO, () =>
      setFormData(initialClassState)
    );
  };

  return (
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
  );
}
