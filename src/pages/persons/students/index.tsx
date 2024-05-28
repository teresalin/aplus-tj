import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs from "dayjs";
import React from "react";
import useSWR from "swr";
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

export default function PersonGrid() {
  const router = useRouter();
  const [isCreateStudentDialogOpen, setIsCreateStudentDialogOpen] =
    React.useState(false);

  const { data, isLoading, error } = useSWR("/api/persons/students", fetcher);
  const students = (data as Student[]) || [];

  const handleAddButtonClick = () => {
    setIsCreateStudentDialogOpen(true);
  };

  const closeDialog = () => {
    setIsCreateStudentDialogOpen(false);
  };

  const handleCreateStudent = async (data) => {
    // Normalize the email: trim whitespace and convert to lowercase
    const normalizedEmail = data.email.trim().toLowerCase();

    // Create a new object with the normalized email and other data
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

    if (response.ok) {
      closeDialog();
    } else {
      console.error("Error creating student:", await response.text());
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
        return dayjs(params.value).format("YYYY-MM-DD");
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
    detailPanel: true,
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
        onClose={closeDialog}
        onSubmit={handleCreateStudent}
      />
    </>
  );
}
