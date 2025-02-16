import { useRouter } from "next/router";
import { AlertColor } from "@mui/material/Alert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import React from "react";
import timezone from "dayjs/plugin/timezone";
import useSWR, { mutate } from "swr";
import utc from "dayjs/plugin/utc";
import {
  GridColDef,
  GridColumnVisibilityModel,
  GridRenderCellParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";

import { Staff } from "../types";
import fetcher from "../../../../../utils/fetcher";
import PersonsTabs from "../../PersonsTabs";
import BaseDataGrid from "../../../../components/DataGrid";
import CreateStaffDialog from "./CreateStaffDialog";

dayjs.extend(utc);
dayjs.extend(timezone);

interface StaffsDashboardProps {
  onSnackbar?: (message: string, severity?: AlertColor) => void;
}

export default function StaffsDashboard({ onSnackbar }: StaffsDashboardProps) {
  const router = useRouter();

  const [isCreateStaffDialogOpen, setIsCreateStaffDialogOpen] =
    React.useState(false);

  const { data, isLoading, error } = useSWR<Staff[]>(
    "/api/persons/staffs",
    fetcher
  );
  const staffs = data || [];

  const handleAddButtonClick = () => {
    setIsCreateStaffDialogOpen(true);
  };

  const handleCloseCreateStaffDialog = () => {
    setIsCreateStaffDialogOpen(false);
  };

  const handleCreateStaff = async (
    data: { email: string },
    resetForm: () => void
  ) => {
    try {
      const normalizedEmail = data.email.trim().toLowerCase();

      const normalizedData = {
        ...data,
        email: normalizedEmail,
      };

      const response = await fetch(`/api/persons/staffs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedData),
      });

      const responseData = await response.json();
      if (response.ok) {
        handleCloseCreateStaffDialog();
        mutate("/api/persons/staffs");
        onSnackbar?.("Staff created successfully", "success");
        resetForm();
      } else {
        console.error("Error creating staff:", responseData);
        onSnackbar?.(responseData.error.message, "error");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      onSnackbar?.("An unexpected error occurred", "error");
    }
  };

  const onRowClick = (data: { staffId: string }) => {
    router.push(
      `/persons/staffs/[staff_id]/details`,
      `/persons/staffs/${data.staffId}/details`
    );
  };

  const columns: GridColDef[] = [
    {
      field: "personId",
      headerName: "id",
      minWidth: 50,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "gender",
      headerName: "Gender",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        if (params.value == null) {
          return "";
        }
        return dayjs(params.value).utc().format("YYYY-MM-DD");
      },
    },
    {
      field: "active",
      headerName: "Active",
      minWidth: 100,
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, Boolean>) =>
        params.value ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
    },
    // TODO fix failed prop type warning
    {
      field: "created",
      headerName: "Created On",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        if (params.value == null) {
          return "";
        }
        return dayjs(params.value).format("YYYY-MM-DD");
      },
    },
  ];

  const getTogglableColumns = (columns: GridColDef[]) => {
    return columns
      .filter(
        (column) =>
          column.field !== "personId" &&
          column.field !== "action" &&
          column.field !== "detailPanel" &&
          column.field !== "created"
      )
      .map((column) => column.field);
  };

  const initialColumnVisibilityModel: GridColumnVisibilityModel = {
    personId: false,
    name: true,
    gender: false,
    phone: true,
    email: true,
    dateOfBirth: true,
    active: true,
    created: false,
    action: true,
  };

  if (error) {
    return <div>Error fetching data</div>;
  }

  const toolbarButtons = [
    <IconButton key="add" onClick={handleAddButtonClick} color="primary">
      <AddBoxIcon />
    </IconButton>,
  ];

  return (
    <>
      <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
        <PersonsTabs currentTab="staffs" />
        <BaseDataGrid
          data={staffs}
          columns={columns}
          isLoading={isLoading}
          onRowClick={(params) => onRowClick(params.row)}
          getTogglableColumns={getTogglableColumns}
          initialColumnVisibilityModel={initialColumnVisibilityModel}
          additionalToolbarButtons={toolbarButtons}
        />
      </Box>
      <CreateStaffDialog
        open={isCreateStaffDialogOpen}
        onClose={handleCloseCreateStaffDialog}
        onSubmit={handleCreateStaff}
      />
    </>
  );
}
