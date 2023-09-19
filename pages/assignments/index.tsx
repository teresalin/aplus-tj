import { Assignment } from "../api/assignments";
import * as React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useSWR from "swr";
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

import fetcher from "../../utils/fetcher";
import CustomToolBar from "../../src/components/dataGrid/CustomToolBar";
import DeleteAssignmentDialog from "../../src/components/assignment/DeleteAssignmentDialog";
import EditAssignmentDialog from "../../src/components/assignment/EditAssignmentDialog";
import NewAssignmentDialog from "../../src/components/assignment/NewAssignmentDialog";
import RenderMenu from "../../src/components/dataGrid/RenderMenu";

function a11yProps(key: string) {
  return {
    id: `simple-tab-${key}`,
    "aria-controls": `simple-tabpanel-${key}`,
  };
}

const assignmentTypes = ["all", "upcoming", "past due"];

export default function CustomFilterPanelPosition() {
  const [tab, setTab] = React.useState("all");
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const [selectedRowData, setSelectedRowData] = React.useState<
    Assignment | undefined
  >({} as Assignment);
  const [isNewDialogOpen, setIsNewDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [buttonEl, setButtonEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const { data } = useSWR(`api/assignments`, fetcher);
  const assignments = data as Assignment[];

  const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
    setTab(newTab);
  };

  const handleOpenNewDialog = () => {
    setIsNewDialogOpen(true);
  };

  const handleCloseNewDialog = () => {
    setIsNewDialogOpen(false);
  };

  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) =>
      assignments.find((row) => row.id === id)
    );
    setSelectedRowData(selectedRowsData[0]);
  };

  // TODO creating without description does not close dialog
  const handleCreateNewAssignment = async (data) => {
    const response = await fetch(`/api/assignments/[assignment_id]`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setIsNewDialogOpen(false);
    } else {
      console.error("Error updating assignment data:", response.statusText);
    }
  };

  const handleSaveRowData = async (editedData) => {
    const response = await fetch(`/api/assignments/${editedData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedData),
    });

    if (response.ok) {
      setIsEditDialogOpen(false);
    } else {
      console.error("Error updating assignment data:", response.statusText);
    }
  };

  const handleDeleteRowData = async () => {
    const response = await fetch(`/api/assignments/${selectedRowData?.id}`, {
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

  // TODO pass this into DataGrid
  const getTogglableColumns = (columns: GridColDef[]) => {
    // hide the column with field `id` from list of togglable columns
    return columns
      .filter((column) => column.field !== "id")
      .map((column) => column.field);
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
      minWidth: 100,
      flex: 1,
    },
    {
      field: "className",
      headerName: "Class Name",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      minWidth: 50,
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
      minWidth: 50,
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
      renderCell: () => (
        <RenderMenu
          onEditClick={handleOpenEditDialog}
          onDeleteClick={handleOpenDeleteDialog}
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
      <DataGrid
        sx={{ backgroundColor: "#fff" }}
        rows={assignments}
        columns={columns}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
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
            children: <AddIconButton onClick={handleOpenNewDialog} />,
            setButtonEl,
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        hideFooterSelectedRowCount
      />
      <NewAssignmentDialog
        open={isNewDialogOpen}
        onClose={handleCloseNewDialog}
        onSubmit={handleCreateNewAssignment}
      />
      <EditAssignmentDialog
        existingData={selectedRowData}
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSubmit={handleSaveRowData}
      />
      <DeleteAssignmentDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onSubmit={handleDeleteRowData}
      />
    </Box>
  );
}
