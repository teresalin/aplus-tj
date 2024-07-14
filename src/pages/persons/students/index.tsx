import { useRouter } from "next/router";
import Alert, { AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs from "dayjs";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import timezone from "dayjs/plugin/timezone";
import useSWR, { mutate } from "swr";
import utc from "dayjs/plugin/utc";
import {
  GridColDef,
  GridColumnVisibilityModel,
  GridRenderCellParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";

import {
  CreateStudentDialog,
  Student,
} from "../../../modules/persons/students";
import BaseDataGrid from "../../../modules/persons/BaseDataGrid";
import fetcher from "../../../../utils/fetcher";
import PersonsTabs from "../../../modules/persons/PersonsTabs";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function PersonGrid() {
  const router = useRouter();

  const [isCreateStudentDialogOpen, setIsCreateStudentDialogOpen] =
    React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    React.useState<AlertColor>("error");

  const { data, isLoading, error } = useSWR<Student[]>(
    "/api/persons/students",
    fetcher
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
    resetForm: () => void
  ) => {
    try {
      const normalizedEmail = data.email.trim().toLowerCase();

      const normalizedData = {
        ...data,
        email: normalizedEmail,
      };

      const response = await fetch(`/api/persons/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedData),
      });

      const responseData = await response.json();
      if (response.ok) {
        handleCloseCreateStudentDialog();
        mutate("/api/persons/students");
        setSnackbarMessage("Student created successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        resetForm();
      } else {
        console.error("Error creating student:", responseData);
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

  const onRowClick = (data: { studentId: number }) => {
    router.push(
      `/persons/students/[student_id]/details`,
      `/persons/students/${data.studentId}/details`
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
        <PersonsTabs currentTab="students" />
        <BaseDataGrid
          data={students}
          columns={columns}
          isLoading={isLoading}
          onAddClick={handleAddButtonClick}
          onRowClick={(params) => onRowClick(params.row)}
          getTogglableColumns={getTogglableColumns}
          initialColumnVisibilityModel={initialColumnVisibilityModel}
        />
      </Box>
      <CreateStudentDialog
        open={isCreateStudentDialogOpen}
        onClose={handleCloseCreateStudentDialog}
        onSubmit={handleCreateStudent}
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
