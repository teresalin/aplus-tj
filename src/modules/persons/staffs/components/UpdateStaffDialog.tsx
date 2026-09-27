"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

import type { Role } from "@/modules/roles";
import type { Staff } from "@/modules/persons/staffs";
import StaffFormFields, {
  emptyStaffFormValues,
  toStaffFormValues,
  type StaffFormValues,
} from "./StaffFormFields";

export interface IUpdateStaffDialogProps {
  existingStaff: Staff;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormValues) => Promise<void>;
  roles: Role[];
}

export default function UpdateStaffDialog({
  existingStaff,
  open,
  onClose,
  onSubmit,
  roles,
}: IUpdateStaffDialogProps) {
  const [formData, setFormData] = React.useState(emptyStaffFormValues);

  // Start from the latest staff data each time the dialog opens.
  React.useEffect(() => {
    if (open) {
      setFormData(toStaffFormValues(existingStaff));
    }
  }, [open, existingStaff]);

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Dialog disablePortal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update Staff</DialogTitle>
        <DialogContent>
          <StaffFormFields
            staff={formData}
            setFormData={setFormData}
            roles={roles}
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
