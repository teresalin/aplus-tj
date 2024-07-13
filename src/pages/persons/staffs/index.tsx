import Alert, { AlertColor } from "@mui/material/Alert";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs from "dayjs";
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

import { Staff } from "../../../modules/persons/staffs";
import BaseDataGrid from "../../../modules/persons/BaseDataGrid";
import CreateStaffDialog from "../../../modules/persons/staffs/components/CreateStaffDialog";
import fetcher from "../../../../utils/fetcher";
import PersonsTabs from "../../../modules/persons/PersonsTabs";
import Snackbar from "@mui/material/Snackbar";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function PersonGrid() {
  const router = useRouter();

  const [isCreateStaffDialogOpen, setIsCreateStaffDialogOpen] =
    React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    React.useState<AlertColor>("error");

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
        setSnackbarMessage("Staff created successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        resetForm();
      } else {
        console.error("Error creating staff:", responseData);
        setSnackbarMessage(responseData.error.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setSnackbarMessage("An unexpected error occurred");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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

  return (
    <>
      <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
        <PersonsTabs currentTab="staffs" />
        <BaseDataGrid
          data={staffs}
          columns={columns}
          isLoading={isLoading}
          onAddClick={handleAddButtonClick}
          onRowClick={(params) => onRowClick(params.row)}
          getTogglableColumns={getTogglableColumns}
          initialColumnVisibilityModel={initialColumnVisibilityModel}
        />
      </Box>
      <CreateStaffDialog
        open={isCreateStaffDialogOpen}
        onClose={handleCloseCreateStaffDialog}
        onSubmit={handleCreateStaff}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
