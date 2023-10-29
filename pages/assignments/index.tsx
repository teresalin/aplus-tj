import * as React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useSWR, { useSWRConfig } from "swr";
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import { Assignment } from "../api/assignments";
import CustomToolBar from "../../src/components/grid/CustomToolBar";
import DeleteAssignmentDialog from "../../src/components/assignment/DeleteAssignmentDialog";
import fetcher from "../../utils/fetcher";
import RenderMenu from "../../src/components/grid/RenderMenu";
import UpdateCreateAssignmentDialog from "../../src/components/assignment/UpdateCreateAssignmentDialog";

function a11yProps(key: string) {
  return {
    id: `simple-tab-${key}`,
    "aria-controls": `simple-tabpanel-${key}`,
  };
}

const assignmentTypes = ["all", "upcoming", "past due"];

export default function AssignmentGrid() {
  const { mutate } = useSWRConfig();
  const [tab, setTab] = React.useState("all");
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>({
      detailPanel: true,
      id: false,
      name: true,
      gender: false,
      phone: true,
      email: true,
      dateOfBirth: true,
      active: true,
      created: false,
      action: true,
    });
  const [isUpdateCreateDialogOpen, setIsUpdateCreateDialogOpen] =
    React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [rowToEdit, setRowToEdit] = React.useState({});
  const [rowToDeactivate, setRowToDeactivate] = React.useState({});
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] =
    React.useState(false);
  const [buttonEl, setButtonEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const { data } = useSWR(`api/assignments`, fetcher);
  const assignments = data || [];

  const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
    setTab(newTab);
  };

  const handleAddButtonClick = () => {
    setIsUpdate(false);
    setRowToEdit({}); // Reset any data
    setIsUpdateCreateDialogOpen(true);
  };

  const handleEditClick = (row) => {
    setIsUpdate(true);
    setRowToEdit(row);
    setIsUpdateCreateDialogOpen(true);
  };

  const handleDeactivateClick = (row) => {
    setRowToDeactivate(row);
    setIsDeactivateDialogOpen(true);
  };

  const handleCloseUpdateCreateDialog = () => {
    setIsUpdateCreateDialogOpen(false);
    setRowToEdit({});
  };

  const handleOpenDeactivateDialog = () => {
    setIsDeactivateDialogOpen(true);
  };

  const handleCloseDeactivateDialog = () => {
    setIsDeactivateDialogOpen(false);
    setRowToDeactivate({});
  };

  // TODO mutate is not working
  const handleUpdateOrCreateAssignment = async (data) => {
    const url = isUpdate
      ? `/api/assignments/${data.id}`
      : `/api/assignments/index`;
    const method = isUpdate ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setIsUpdateCreateDialogOpen(false);
      mutate("/api/assignments");
    } else {
      console.error("Error creating/updating assignment:", response.statusText);
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

  const onColumnVisibilityChange = (
    model: React.SetStateAction<GridColumnVisibilityModel>
  ) => {
    let count = 0;
    for (const key in model) {
      if (model[key] === true) {
        count++;
      }
    }
    setColumnVisibilityModel(model);
  };

  function AddIconButton({ onClick }) {
    return (
      <IconButton
        aria-label="Add box icon"
        onClick={onClick}
        color="primary"
        sx={{ padding: "4px" }}
      >
        <AddBoxIcon />
      </IconButton>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "id",
      minWidth: 50,
      flex: 1,
    },
    {
      field: "assignmentName",
      headerName: "Assignment Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "className",
      headerName: "Class Name",
      minWidth: 150,
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
          onDeleteClick={() => handleDeactivateClick(params.row)}
        />
      ),
    },
  ];

  if (!assignments) return <CircularProgress />;

  return (
    <Box style={{ width: "100%" }}>
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
      {/* TODO disable filter on certain columns */}
      <DataGrid
        sx={{
          width: "100%",
          overflow: "hidden",
          ".MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
        }}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) => {
          onColumnVisibilityChange(newModel);
        }}
        rows={assignments}
        columns={columns}
        rowSelectionModel={rowSelectionModel}
        localeText={{
          toolbarColumns: "",
          toolbarFilters: "",
          toolbarDensity: "",
          toolbarExport: "",
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          columns: {
            columnVisibilityModel: {
              id: false,
              created: false,
            },
          },
        }}
        slots={{
          toolbar: CustomToolBar,
        }}
        slotProps={{
          panel: {
            anchorEl: buttonEl,
            placement: "bottom-end",
          },
          toolbar: {
            children: <AddIconButton onClick={handleAddButtonClick} />,
            setButtonEl,
          },
          columnsPanel: {
            getTogglableColumns,
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        hideFooterSelectedRowCount
      />
      <UpdateCreateAssignmentDialog
        isUpdate={isUpdate}
        existingData={rowToEdit as Assignment}
        open={isUpdateCreateDialogOpen}
        onClose={handleCloseUpdateCreateDialog}
        onSubmit={handleUpdateOrCreateAssignment}
      />
      <DeleteAssignmentDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeactivateDialog}
        onSubmit={handleDeleteAssignment}
      />
    </Box>
  );
}
