"use client";

import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import React from "react";

import BaseDataGrid from "@/components/DataGrid";
import FormDialog from "@/components/FormDialog";
import { useApiMutation } from "@/hooks/use-api-mutation";
import type { ParentSummary } from "@/modules/persons/parents";
import PersonsTabs from "../../PersonsTabs";
import {
  getTogglablePersonColumns,
  personColumnVisibility,
  personColumns,
} from "../../components/personColumns";
import ParentFormFields, {
  emptyParentFormValues,
  toParentPayload,
  type ParentFormValues,
} from "./ParentFormFields";

const renderActiveChip = (active: boolean) =>
  active ? (
    <Chip
      label="Active"
      size="small"
      sx={{ height: "20px", paddingX: 1 }}
      style={{ backgroundColor: "#bef0cc", color: "#507b67" }}
    />
  ) : (
    <Chip
      label="Inactive"
      size="small"
      sx={{ height: "20px" }}
      style={{ backgroundColor: "#f9e8e8", color: "#9f3d49" }}
    />
  );

const columns = personColumns<ParentSummary>(renderActiveChip);

export default function ParentsDashboard({
  parents,
}: {
  parents: ParentSummary[];
}) {
  const mutate = useApiMutation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const handleCreateParent = async (values: ParentFormValues) => {
    const created = await mutate({
      method: "POST",
      url: "/api/persons/parents",
      body: toParentPayload(values),
      successMessage: "Parent created successfully",
    });
    if (created) setIsCreateDialogOpen(false);
  };

  const toolbarButtons = (
    <IconButton
      aria-label="Add parent"
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
          data={parents}
          columns={columns}
          getTogglableColumns={getTogglablePersonColumns}
          initialColumnVisibilityModel={personColumnVisibility}
          additionalToolbarButtons={toolbarButtons}
        />
      </Box>
      <FormDialog
        open={isCreateDialogOpen}
        title="New Parent"
        initialValues={emptyParentFormValues}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateParent}
      >
        {(values, setValues) => (
          <ParentFormFields parent={values} setFormData={setValues} />
        )}
      </FormDialog>
    </>
  );
}
