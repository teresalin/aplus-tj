import React from "react";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useSWR from "swr";
import {
  GridColDef,
  GridValueFormatterParams,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import { Assignment } from "../../src/components/assignments/types";
import {
  CreateAssignmentDialog,
  DeleteAssignmentDialog,
  UpdateAssignmentDialog,
} from "../../src/components/assignments";
import fetcher from "../../utils/fetcher";
import RenderMenu from "../../src/components/grid/RenderMenu";
import BaseDataGrid from "../../src/components/persons/BaseDataGrid";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const assignmentTypes = ["all", "upcoming", "past due"];

export default function AssignmentGrid() {
  const [tab, setTab] = React.useState("all");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Assignment | null>(null);

  const { data, isLoading, error, mutate } = useSWR(
    `/api/assignments?filter=${tab}`,
    fetcher
  );
  const assignments = data || [];

  const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
    setTab(newTab);
  };

  const handleAddButtonClick = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedRow(null);
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedRow(null);
  };

  const handleUpdateAssignment = async (data: Assignment) => {
    const response = await fetch(`/api/assignments/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setIsUpdateDialogOpen(false);
      mutate({ ...data });
    } else {
      console.error("Error updating assignment:", response.statusText);
    }
  };

  const handleCreateAssignment = async (data) => {
    const response = await fetch("/api/assignments/index", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setIsCreateDialogOpen(false);
      mutate();
    } else {
      console.error("Error creating assignment:", response.statusText);
    }
  };

  const handleDeleteAssignment = async (data) => {
    const response = await fetch(`/api/assignments/${data.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      setIsDeleteDialogOpen(false);
    } else {
      console.error("Error deleting assignment data:", response.statusText);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "id",
      minWidth: 50,
      flex: 1,
    },
    {
      field: "className",
      headerName: "Class Name",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => params.row?.classInfo?.name,
    },
    {
      field: "name",
      headerName: "Assignment Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        if (params.value == null) {
          return "";
        }
        return dayjs(params.value).format("YYYY-MM-DD");
      },
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
    {
      field: "action",
      headerName: "Action",
      minWidth: 70,
      maxWidth: 70,
      flex: 1,
      renderCell: (params) => (
        <RenderMenu
          onEditClick={() => handleEditClick(params.row)}
          onDeleteClick={() => handleDeleteClick(params.row)}
        />
      ),
    },
  ];

  const getTogglableColumns = (columns: GridColDef[]) => {
    return columns
      .filter(
        (column) =>
          column.field !== "id" &&
          column.field !== "action" &&
          column.field !== "created"
      )
      .map((column) => column.field);
  };

  // TODO update columns
  const initialColumnVisibilityModel: GridColumnVisibilityModel = {
    id: false,
    name: true,
    active: true,
    created: false,
    action: true,
  };

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="assignment tabs"
        >
          {assignmentTypes.map((key) => (
            <Tab key={key} value={key} label={key} {...a11yProps(key)} />
          ))}
        </Tabs>
      </Box>
      <BaseDataGrid
        data={assignments}
        columns={columns}
        isLoading={isLoading}
        onAddClick={handleAddButtonClick}
        getTogglableColumns={getTogglableColumns}
        initialColumnVisibilityModel={initialColumnVisibilityModel}
      />
      {/* TODO fix overlapping input fields */}
      <UpdateAssignmentDialog
        assignment={selectedRow}
        open={isUpdateDialogOpen}
        onClose={handleCloseUpdateDialog}
        onSubmit={handleUpdateAssignment}
      />
      <CreateAssignmentDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateAssignment}
      />
      <DeleteAssignmentDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onSubmit={handleDeleteAssignment}
      />
    </Box>
  );
}
