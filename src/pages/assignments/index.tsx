import Alert, { AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import timezone from "dayjs/plugin/timezone";
import useSWR, { mutate } from "swr";
import utc from "dayjs/plugin/utc";
import {
  GridColDef,
  GridValueFormatterParams,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import {
  Assignment,
  CreateAssignmentDialog,
  CreateAssignmentDTO,
  DeleteAssignmentDialog,
  UpdateAssignmentDialog,
} from "../../modules/assignments";
import BaseDataGrid from "../../modules/persons/BaseDataGrid";
import fetcher from "../../../utils/fetcher";
import RenderMenu from "../../components/grid/RenderMenu";

dayjs.extend(utc);
dayjs.extend(timezone);

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const assignmentTypes = ["all", "upcoming", "past due"];

export default function AssignmentGrid() {
  const [tab, setTab] = React.useState("all");
  const [isUpdateAssignmentDialogOpen, setIsUpdateAssignmentDialogOpen] =
    React.useState(false);
  const [isCreateAssignmentDialogOpen, setIsCreateAssignmentDialogOpen] =
    React.useState(false);
  const [isDeleteAssignmentDialogOpen, setIsDeleteAssignmentDialogOpen] =
    React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    React.useState<AlertColor>("error");
  const [selectedRow, setSelectedRow] = React.useState<Assignment | null>(null);

  const { data, isLoading, error } = useSWR<Assignment[]>(
    `/api/assignments?filter=${tab}`,
    fetcher
  );
  const assignments = data || [];

  const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
    setTab(newTab);
  };

  const handleAddButtonClick = () => {
    setIsCreateAssignmentDialogOpen(true);
  };

  const handleEditClick = (row: Assignment) => {
    setSelectedRow(row);
    setIsUpdateAssignmentDialogOpen(true);
  };

  const handleDeleteClick = (row: Assignment) => {
    setSelectedRow(row);
    setIsDeleteAssignmentDialogOpen(true);
  };

  const handleCloseCreateAssignmentDialog = () => {
    setIsCreateAssignmentDialogOpen(false);
  };

  const handleCloseUpdateAssignmentDialog = () => {
    setIsUpdateAssignmentDialogOpen(false);
    setSelectedRow(null);
  };

  const handleCloseDeleteAssignmentDialog = () => {
    setIsDeleteAssignmentDialogOpen(false);
    setSelectedRow(null);
  };

  const handleCreateAssignment = async (
    data: CreateAssignmentDTO,
    resetForm: () => void
  ) => {
    const response = await fetch("/api/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    try {
      if (response.ok) {
        handleCloseCreateAssignmentDialog();
        mutate(`/api/assignments?filter=${tab}`);
        setSnackbarMessage("Assignment created successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        resetForm();
      } else {
        console.error("Error creating assignment:", responseData);
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

  const handleUpdateAssignment = async (
    data: Assignment,
    resetForm: () => void
  ) => {
    const response = await fetch(`/api/assignments/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    try {
      if (response.ok) {
        handleCloseUpdateAssignmentDialog();
        mutate(`/api/assignments?filter=${tab}`);
        setSnackbarMessage("Assignment updated successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        resetForm();
      } else {
        console.error("Error updating assignment:", responseData);
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

  const handleDeleteAssignment = async (data: Assignment) => {
    const response = await fetch(`/api/assignments/${data.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    try {
      if (response.ok) {
        handleCloseDeleteAssignmentDialog();
        mutate(`/api/assignments?filter=${tab}`);
        setSnackbarMessage("Assignment deleted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        console.error("Error deleting assignment:", responseData);
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

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "id",
      minWidth: 50,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Assignment Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "className",
      headerName: "Class",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => params.row?.class?.name,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 220,
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
        return dayjs(params.value).utc().format("YYYY-MM-DD");
      },
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
        return dayjs(params.value).utc().format("YYYY-MM-DD");
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
    <>
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
      </Box>
      <UpdateAssignmentDialog
        existingAssignment={selectedRow}
        open={isUpdateAssignmentDialogOpen}
        onClose={handleCloseUpdateAssignmentDialog}
        onSubmit={handleUpdateAssignment}
      />
      <CreateAssignmentDialog
        open={isCreateAssignmentDialogOpen}
        onClose={handleCloseCreateAssignmentDialog}
        onSubmit={handleCreateAssignment}
      />
      {selectedRow && (
        <DeleteAssignmentDialog
          assignment={selectedRow}
          open={isDeleteAssignmentDialogOpen}
          onClose={handleCloseDeleteAssignmentDialog}
          onSubmit={handleDeleteAssignment}
        />
      )}
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
