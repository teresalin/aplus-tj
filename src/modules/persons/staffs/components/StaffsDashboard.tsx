"use client";

import { useRouter } from "next/navigation";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";

import BaseDataGrid from "@/components/DataGrid";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { apiRequest, getErrorMessage } from "@/lib/api/client";
import { formatDate } from "@/lib/dates";
import type { StaffSummary } from "@/modules/persons/staffs";
import type { Role } from "@/modules/roles";
import PersonsTabs from "../../PersonsTabs";
import CreateStaffDialog from "./CreateStaffDialog";
import { toStaffPayload, type StaffFormValues } from "./StaffFormFields";

const columns: GridColDef<StaffSummary>[] = [
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
    renderCell: ({ value }) =>
      value ? (
        <CheckCircleIcon color="success" />
      ) : (
        <CancelIcon color="error" />
      ),
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

export default function StaffsDashboard({
  staffs,
  roles,
}: {
  staffs: StaffSummary[];
  roles: Role[];
}) {
  const router = useRouter();
  const notify = useSnackbar();
  const [isCreateStaffDialogOpen, setIsCreateStaffDialogOpen] =
    React.useState(false);

  const handleCreateStaff = async (
    data: StaffFormValues,
    resetForm: () => void,
  ) => {
    try {
      await apiRequest("/api/persons/staffs", "POST", toStaffPayload(data));
      setIsCreateStaffDialogOpen(false);
      notify("Staff created successfully");
      resetForm();
      router.refresh();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  const toolbarButtons = (
    <IconButton
      onClick={() => setIsCreateStaffDialogOpen(true)}
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
          getTogglableColumns={getTogglableColumns}
          initialColumnVisibilityModel={initialColumnVisibilityModel}
          additionalToolbarButtons={toolbarButtons}
        />
      </Box>
      <CreateStaffDialog
        open={isCreateStaffDialogOpen}
        onClose={() => setIsCreateStaffDialogOpen(false)}
        onSubmit={handleCreateStaff}
        roles={roles}
      />
    </>
  );
}
