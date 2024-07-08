import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import useSWR, { mutate } from "swr";

import { Class } from "../types";
import { classToUpdateClassDTO } from "../class.transformers";
import { UpdateClassDTO } from "../dtos";
import ClassFormFields from "./ClassFormFields";
import fetcher from "../../../../utils/fetcher";

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
  const [hasError, setHasError] = React.useState(false);

  const {
    data: staffsData,
    error: staffsError,
    isLoading: staffsLoading,
  } = useSWR("/api/persons/staffs", fetcher);
  const {
    data: gradesData,
    error: gradesError,
    isLoading: gradesLoading,
  } = useSWR("/api/grades", fetcher);

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
    if (!hasError) {
      await onSubmit(formData as UpdateClassDTO, () =>
        setFormData(initialClassState)
      );
    }
  };

  return (
    <>
      <Dialog disablePortal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Update Class Details</DialogTitle>
          <DialogContent>
            {staffsLoading || gradesLoading ? (
              <CircularProgress />
            ) : (
              <>
                {staffsError && (
                  <Alert severity="error">
                    Failed to load staff data: {staffsError.message}
                  </Alert>
                )}
                {gradesError && (
                  <Alert severity="error">
                    Failed to load grades data: {gradesError.message}
                  </Alert>
                )}
                {!staffsError && !gradesError && (
                  <ClassFormFields
                    classData={formData}
                    setFormData={setFormData}
                    grades={grades}
                    teachers={teachers}
                    setHasError={setHasError}
                  />
                )}
              </>
            )}
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
