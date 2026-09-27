"use client";

import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";

import FormDialog from "@/components/FormDialog";
import { useApiMutation } from "@/hooks/use-api-mutation";
import type { Role } from "@/modules/roles";
import type { Staff } from "@/modules/persons/staffs";
import StaffFormFields, {
  toStaffFormValues,
  toStaffPayload,
  type StaffFormValues,
} from "./StaffFormFields";

export default function EditStaffButton({
  staff,
  roles,
}: {
  staff: Staff;
  roles: Role[];
}) {
  const mutate = useApiMutation();
  const [open, setOpen] = React.useState(false);

  const handleUpdateStaff = async (values: StaffFormValues) => {
    const updated = await mutate({
      method: "PATCH",
      url: `/api/persons/staffs/${staff.id}`,
      body: toStaffPayload(values),
      successMessage: "Staff updated successfully",
    });
    if (updated) setOpen(false);
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
      <FormDialog
        open={open}
        title="Update Staff"
        initialValues={toStaffFormValues(staff)}
        onClose={() => setOpen(false)}
        onSubmit={handleUpdateStaff}
      >
        {(values, setValues) => (
          <StaffFormFields
            staff={values}
            setFormData={setValues}
            roles={roles}
          />
        )}
      </FormDialog>
    </>
  );
}
