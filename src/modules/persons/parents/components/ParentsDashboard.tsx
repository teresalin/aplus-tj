import { useRouter } from "next/router";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import React from "react";
import useSWR, { mutate } from "swr";
import {
  GridColDef,
  GridColumnVisibilityModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { AlertColor } from "@mui/material/Alert";

import { Parent } from "../types";
import BaseDataGrid from "../../../../components/DataGrid";
import CreateParentDialog from "./CreateParentDialog";
import fetcher from "../../../../../utils/fetcher";
import PersonsTabs from "../../PersonsTabs";

interface ParentsDashboardProps {
  onSnackbar?: (message: string, severity?: AlertColor) => void;
}

export default function ParentsDashboard({
  onSnackbar,
}: ParentsDashboardProps) {
  const router = useRouter();
  const [isCreateParentDialogOpen, setIsCreateParentDialogOpen] =
    React.useState(false);

  const { data, isLoading, error } = useSWR<Parent[]>(
    "/api/persons/parents",
    fetcher
  );
  const parents = data || [];

  const handleAddButtonClick = () => {
    setIsCreateParentDialogOpen(true);
  };

  const handleCloseCreateParentDialog = () => {
    setIsCreateParentDialogOpen(false);
  };

  const handleCreateParent = async (
    data: { email: string },
    resetForm: () => void
  ) => {
    const url = "/api/persons/parents/index";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (response.ok) {
      handleCloseCreateParentDialog();
      mutate("/api/persons/students");
      onSnackbar?.("Parent created successfully", "success");
      resetForm();
    } else {
      console.error("Error creating parent:", responseData);
      onSnackbar?.(responseData.error.message, "error");
    }
  };

  const onRowClick = (data: { personId: string }) => {
    router.push(`/persons/parents/[id]`, `/persons/parents/${data.personId}`);
  };

  const renderChip = (params) => {
    return params.value ? (
      <Chip
        // icon={<CheckIcon />}
        label="Active"
        size="small"
        sx={{ height: "20px", paddingX: 1 }}
        style={{ backgroundColor: "#bef0cc", color: "#507b67" }}
      />
    ) : (
      <Chip
        // icon={<CloseIcon />}
        label="Inactive"
        size="small"
        sx={{ height: "20px" }}
        style={{ backgroundColor: "#f9e8e8", color: "#9f3d49" }}
      />
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
      renderCell: renderChip,
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

  const toolbarButtons = [
    <IconButton key="add" onClick={handleAddButtonClick} color="primary">
      <AddBoxIcon />
    </IconButton>,
  ];

  return (
    <>
      <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
        <PersonsTabs currentTab="parents" />
        <BaseDataGrid
          data={parents}
          columns={columns}
          isLoading={isLoading}
          onRowClick={(params) => onRowClick(params.row)}
          getTogglableColumns={getTogglableColumns}
          initialColumnVisibilityModel={initialColumnVisibilityModel}
          additionalToolbarButtons={toolbarButtons}
        />
      </Box>
      <CreateParentDialog
        open={isCreateParentDialogOpen}
        onClose={handleCloseCreateParentDialog}
        onSubmit={handleCreateParent}
      />
    </>
  );
}
