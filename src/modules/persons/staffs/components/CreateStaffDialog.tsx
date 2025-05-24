import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import useSWR from "swr";

import { CreateStaffDTO } from "../dtos";
import { Role } from "../../../roles";
import fetcher from "../../../../../utils/fetcher";
import StaffFormFields from "./StaffFormFields";

export interface ICreateStaffDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStaffDTO, resetForm: () => void) => Promise<void>;
}

export default function CreateStaffDialog({
  open,
  onClose,
  onSubmit,
}: ICreateStaffDialogProps) {
  const initialStaffState = {} as CreateStaffDTO;
  const [newStaff, setNewStaff] = React.useState(initialStaffState);

  const { data, error, isLoading } = useSWR<Role[]>(
    "/api/persons/roles",
    fetcher,
  );
  const roles = data || [];

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();
    await onSubmit(newStaff as CreateStaffDTO, () =>
      setNewStaff(initialStaffState),
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New Staff</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              {error && (
                <Alert severity="error">
                  Failed to load role data: {error.message}
                </Alert>
              )}
              {!error && (
                <StaffFormFields
                  staff={newStaff}
                  setFormData={setNewStaff}
                  roles={roles}
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
  );
}
