"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

import type { Role } from "@/modules/roles";
import StaffFormFields, {
  emptyStaffFormValues,
  type StaffFormValues,
} from "./StaffFormFields";

export interface ICreateStaffDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormValues, resetForm: () => void) => Promise<void>;
  roles: Role[];
}

export default function CreateStaffDialog({
  open,
  onClose,
  onSubmit,
  roles,
}: ICreateStaffDialogProps) {
  const [newStaff, setNewStaff] = React.useState(emptyStaffFormValues);

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    await onSubmit(newStaff, () => setNewStaff(emptyStaffFormValues));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New Staff</DialogTitle>
        <DialogContent>
          <StaffFormFields
            staff={newStaff}
            setFormData={setNewStaff}
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
