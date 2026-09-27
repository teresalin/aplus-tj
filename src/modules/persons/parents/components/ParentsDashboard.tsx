"use client";

import { useRouter } from "next/navigation";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";

import BaseDataGrid from "@/components/DataGrid";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { apiRequest, getErrorMessage } from "@/lib/api/client";
import { formatDate } from "@/lib/dates";
import type { ParentSummary } from "@/modules/persons/parents";
import PersonsTabs from "../../PersonsTabs";
import CreateParentDialog, {
  toParentPayload,
  type ParentFormValues,
} from "./CreateParentDialog";

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

const columns: GridColDef<ParentSummary>[] = [
  {
    field: "id",
    headerName: "id",
    minWidth: 50,
    flex: 1,
  },
  {
    field: "name",
    headerName: "Name",
    minWidth: 150,
    flex: 1,
    valueGetter: ({ row }) => row.person.name,
  },
  {
    field: "gender",
    headerName: "Gender",
    minWidth: 100,
    flex: 1,
    valueGetter: ({ row }) => row.person.gender,
  },
  {
    field: "phone",
    headerName: "Phone",
    minWidth: 120,
    flex: 1,
    valueGetter: ({ row }) => row.person.phone,
  },
  {
    field: "email",
    headerName: "Email",
    minWidth: 200,
    flex: 1,
    valueGetter: ({ row }) => row.person.email,
  },
  {
    field: "dateOfBirth",
    headerName: "Date of Birth",
    minWidth: 120,
    flex: 1,
    valueGetter: ({ row }) => row.person.dateOfBirth,
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: "active",
    headerName: "Active",
    minWidth: 100,
    flex: 1,
    valueGetter: ({ row }) => row.person.active,
    renderCell: ({ value }) => renderActiveChip(value),
  },
  {
    field: "createdAt",
    headerName: "Created On",
    minWidth: 120,
    flex: 1,
    valueFormatter: ({ value }) => formatDate(value),
  },
];

const getTogglableColumns = (columns: GridColDef[]) =>
  columns
    .filter(
      (column) =>
        column.field !== "id" &&
        column.field !== "action" &&
        column.field !== "createdAt",
    )
    .map((column) => column.field);

const initialColumnVisibilityModel: GridColumnVisibilityModel = {
  id: false,
  name: true,
  gender: false,
  phone: true,
  email: true,
  dateOfBirth: true,
  active: true,
  createdAt: false,
};

export default function ParentsDashboard({
  parents,
}: {
  parents: ParentSummary[];
}) {
  const router = useRouter();
  const notify = useSnackbar();
  const [isCreateParentDialogOpen, setIsCreateParentDialogOpen] =
    React.useState(false);

  const handleCreateParent = async (
    data: ParentFormValues,
    resetForm: () => void,
  ) => {
    try {
      await apiRequest("/api/persons/parents", "POST", toParentPayload(data));
      setIsCreateParentDialogOpen(false);
      notify("Parent created successfully");
      resetForm();
      router.refresh();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  const toolbarButtons = (
    <IconButton
      onClick={() => setIsCreateParentDialogOpen(true)}
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
          getTogglableColumns={getTogglableColumns}
          initialColumnVisibilityModel={initialColumnVisibilityModel}
          additionalToolbarButtons={toolbarButtons}
        />
      </Box>
      <CreateParentDialog
        open={isCreateParentDialogOpen}
        onClose={() => setIsCreateParentDialogOpen(false)}
        onSubmit={handleCreateParent}
      />
    </>
  );
}
