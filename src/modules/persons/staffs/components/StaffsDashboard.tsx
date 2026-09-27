"use client";

import { useRouter } from "next/navigation";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import React from "react";

import BaseDataGrid from "@/components/DataGrid";
import FormDialog from "@/components/FormDialog";
import { useApiMutation } from "@/hooks/use-api-mutation";
import type { StaffSummary } from "@/modules/persons/staffs";
import type { Role } from "@/modules/roles";
import PersonsTabs from "../../PersonsTabs";
import {
  getTogglablePersonColumns,
  personColumnVisibility,
  personColumns,
} from "../../components/personColumns";
import StaffFormFields, {
  emptyStaffFormValues,
  toStaffPayload,
  type StaffFormValues,
} from "./StaffFormFields";

const columns = personColumns<StaffSummary>();

export default function StaffsDashboard({
  staffs,
  roles,
}: {
  staffs: StaffSummary[];
  roles: Role[];
}) {
  const router = useRouter();
  const mutate = useApiMutation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const handleCreateStaff = async (values: StaffFormValues) => {
    const created = await mutate({
      method: "POST",
      url: "/api/persons/staffs",
      body: toStaffPayload(values),
      successMessage: "Staff created successfully",
    });
    if (created) setIsCreateDialogOpen(false);
  };

  const toolbarButtons = (
    <IconButton
      aria-label="Add staff member"
      onClick={() => setIsCreateDialogOpen(true)}
      color="primary"
    >
      <AddBoxIcon />
    </IconButton>
  );

  return (
    <>
      <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
        <PersonsTabs />
        <BaseDataGrid
          data={staffs}
          columns={columns}
          onRowClick={(params) =>
            router.push(`/persons/staffs/${params.id}/details`)
          }
          getTogglableColumns={getTogglablePersonColumns}
          initialColumnVisibilityModel={personColumnVisibility}
          additionalToolbarButtons={toolbarButtons}
        />
      </Box>
      <FormDialog
        open={isCreateDialogOpen}
        title="New Staff"
        initialValues={emptyStaffFormValues}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateStaff}
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
