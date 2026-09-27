"use client";

import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";

import { apiRequest, getErrorMessage } from "@/lib/api/client";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import type { Role } from "@/modules/roles";
import type { Staff } from "@/modules/persons/staffs";
import UpdateStaffDialog from "./UpdateStaffDialog";
import { toStaffPayload, type StaffFormValues } from "./StaffFormFields";

export default function EditStaffButton({
  staff,
  roles,
}: {
  staff: Staff;
  roles: Role[];
}) {
  const router = useRouter();
  const notify = useSnackbar();
  const [open, setOpen] = React.useState(false);

  const handleUpdateStaff = async (data: StaffFormValues) => {
    try {
      await apiRequest(
        `/api/persons/staffs/${staff.id}`,
        "PATCH",
        toStaffPayload(data),
      );
      setOpen(false);
      notify("Staff updated successfully");
      router.refresh();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  return (
    <>
      <Button
        variant="text"
        color="primary"
        startIcon={<EditIcon />}
        onClick={() => setOpen(true)}
      >
        Edit
      </Button>
      <UpdateStaffDialog
        existingStaff={staff}
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleUpdateStaff}
        roles={roles}
      />
    </>
  );
}
