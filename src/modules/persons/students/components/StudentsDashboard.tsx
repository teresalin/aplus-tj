import { useRouter } from "next/router";
import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import useSWR, { mutate } from "swr";
import {
  GridColDef,
  GridColumnVisibilityModel,
  GridRenderCellParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { AlertColor } from "@mui/material/Alert";

import { Student } from "../types";
import BaseDataGrid from "../../../../components/DataGrid";
import CreateStudentDialog from "./CreateStudentDialog";
import fetcher from "../../../../../utils/fetcher";
import PersonsTabs from "../../PersonsTabs";

dayjs.extend(utc);
dayjs.extend(timezone);

interface StudentsDashboardProps {
  onSnackbar?: (message: string, severity?: AlertColor) => void;
}

export default function StudentsDashboard({
  onSnackbar,
}: StudentsDashboardProps) {
  const router = useRouter();
  const [isCreateStudentDialogOpen, setIsCreateStudentDialogOpen] =
    React.useState(false);

  const { data, isLoading, error } = useSWR<Student[]>(
    "/api/persons/students",
    fetcher,
  );
  const students = data || [];

  const handleAddButtonClick = () => {
    setIsCreateStudentDialogOpen(true);
  };

  const handleCloseCreateStudentDialog = () => {
    setIsCreateStudentDialogOpen(false);
  };

  const handleCreateStudent = async (
    data: { email: string },
    resetForm: () => void,
  ) => {
    try {
      const normalizedEmail = data.email.trim().toLowerCase();
      const normalizedData = { ...data, email: normalizedEmail };

      const response = await fetch(`/api/persons/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedData),
      });

      const responseData = await response.json();
      if (response.ok) {
        handleCloseCreateStudentDialog();
        mutate("/api/persons/students");
        onSnackbar?.("Student created successfully", "success");
        resetForm();
      } else {
        console.error("Error creating student:", responseData);
        onSnackbar?.(responseData.error.message, "error");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      onSnackbar?.("An unexpected error occurred", "error");
    }
  };

  const onRowClick = (data: { id: string }) => {
    router.push(`/persons/students/${data.id}/details`);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 50, flex: 1 },
    { field: "name", headerName: "Name", minWidth: 150, flex: 1 },
    { field: "gender", headerName: "Gender", minWidth: 100, flex: 1 },
    { field: "phone", headerName: "Phone", minWidth: 120, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<Date>) =>
        params.value ? dayjs(params.value).utc().format("YYYY-MM-DD") : "",
    },
    {
      field: "active",
      headerName: "Active",
      minWidth: 100,
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, boolean>) =>
        params.value ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        ),
    },
    {
      field: "created",
      headerName: "Created On",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<Date>) =>
        params.value ? dayjs(params.value).utc().format("YYYY-MM-DD") : "",
    },
  ];

  const getTogglableColumns = (columns: GridColDef[]) =>
    columns
      .filter(
        (column) =>
          column.field !== "id" &&
          column.field !== "action" &&
          column.field !== "detailPanel" &&
          column.field !== "created",
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
        <PersonsTabs currentTab="students" />
        <BaseDataGrid
          data={students}
          columns={columns}
          isLoading={isLoading}
          onRowClick={(params) => onRowClick(params.row)}
          getTogglableColumns={getTogglableColumns}
          initialColumnVisibilityModel={initialColumnVisibilityModel}
          additionalToolbarButtons={toolbarButtons}
        />
      </Box>
      <CreateStudentDialog
        open={isCreateStudentDialogOpen}
        onClose={handleCloseCreateStudentDialog}
        onSubmit={handleCreateStudent}
      />
    </>
  );
}
