import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";
import React from "react";
import useSWR from "swr";
import {
  GridColDef,
  GridColumnVisibilityModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";

import { Staff } from "../../../src/components/persons/staffs/types";
import BaseDataGrid from "../../../src/components/persons/BaseDataGrid";
import fetcher from "../../../utils/fetcher";
import PersonsTabs from "../../../src/components/persons/PersonsTabs";
import CreateStaffDialog from "../../../src/components/persons/staffs/forms/CreateStaffDialog";

export default function PersonGrid() {
  const router = useRouter();

  const [isCreateStaffDialogOpen, setIsCreateStaffDialogOpen] =
    React.useState(false);

  const { data, isLoading, error } = useSWR("/api/persons/staffs", fetcher);
  const staffs = (data as Staff[]) || [];

  const handleAddButtonClick = () => {
    setIsCreateStaffDialogOpen(true);
  };

  const closeDialog = () => {
    setIsCreateStaffDialogOpen(false);
  };

  const handleCreateStaff = async (data) => {
    const url = "/api/persons/staffs/index";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // TODO close dialog
    } else {
      console.error("Error creating staff:", response.statusText);
    }
  };

  const onRowClick = (data: { personId: string }) => {
    router.push(`/persons/staffs/[id]`, `/persons/staffs/${data.personId}`);
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

  return (
    <>
      <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
        <PersonsTabs currentTab="staffs" />
        <BaseDataGrid
          data={staffs}
          columns={columns}
          isLoading={isLoading}
          onAddClick={handleAddButtonClick}
          onRowClick={onRowClick}
          getTogglableColumns={getTogglableColumns}
          initialColumnVisibilityModel={initialColumnVisibilityModel}
        />
      </Box>
      <CreateStaffDialog
        open={isCreateStaffDialogOpen}
        onClose={closeDialog}
        onSubmit={handleCreateStaff}
      />
    </>
  );
}
