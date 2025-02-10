import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import useSWR, { mutate } from "swr";

import { Role } from "../../roles";
import { Staff } from "../types";
import { staffToUpdateStaffDTO } from "../staff.transformers";
import { UpdateStaffDTO } from "../dtos";
import fetcher from "../../../../../utils/fetcher";
import StaffFormFields from "./StaffFormFields";

export interface IUpdateStaffDialogProps {
  existingStaff: Staff | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateStaffDTO, resetForm: () => void) => Promise<void>;
}

export default function UpdateStaffDialog({
  existingStaff,
  open,
  onClose,
  onSubmit,
}: IUpdateStaffDialogProps) {
  const initialStaffState = {} as UpdateStaffDTO;
  const [formData, setFormData] =
    React.useState<UpdateStaffDTO>(initialStaffState);

  const { data, error, isLoading } = useSWR<Role[]>(
    "/api/persons/staffs/roles",
    fetcher
  );
  const roles = data || [];

  // Initialize form data when the dialog opens with the latest staff data
  React.useEffect(() => {
    if (open && existingStaff) {
      mutate(`/api/persons/staffs/${existingStaff.id}`).then(() => {
        setFormData(staffToUpdateStaffDTO(existingStaff));
      });
    }
  }, [open, existingStaff]);

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    await onSubmit(formData as UpdateStaffDTO, () =>
      setFormData(initialStaffState)
    );
  };

  return (
    formData && (
      <Dialog disablePortal open={open} onClose={onClose}>
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
                    staff={formData}
                    setFormData={setFormData}
                    roles={roles}
                  />
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button autoFocus type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  );
}
