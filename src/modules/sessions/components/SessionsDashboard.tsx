import { AlertColor } from "@mui/material/Alert";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import timezone from "dayjs/plugin/timezone";
import useSWR, { mutate } from "swr";
import utc from "dayjs/plugin/utc";
import {
  GridColDef,
  GridValueFormatterParams,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import { ClassSummary } from "../../classes";
import { CreateSessionDTO, UpdateSessionDTO } from "../dtos";
import { Session } from "../types";
import BaseDataGrid from "../../../components/DataGrid";
import CreateSessionDialog from "./CreateSessionDialog";
import fetcher from "../../../../utils/fetcher";
import RenderMenu from "../../../components/grid/RenderMenu";
import UpdateSessionDialog from "./UpdateSessionDialog";

dayjs.extend(CustomParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const convertToLocalTime = (utcTime) => {
  return dayjs.utc(utcTime).local().format("YYYY-MM-DD HH:mm A");
};

interface SessionsDashboardProps {
  onSnackbar?: (message: string, severity?: AlertColor) => void;
}

export default function SessionsDashboard({
  onSnackbar,
}: SessionsDashboardProps) {
  const [timeRange, setTimeRange] = React.useState("thisMonth");
  const [selectedRow, setSelectedRow] = React.useState<Session | null>(null);
  const [isCreateSessionDialogOpen, setIsCreateSessionDialogOpen] =
    React.useState(false);
  const [isUpdateSessionDialogOpen, setIsUpdateSessionDialogOpen] =
    React.useState(false);
  const [isDeleteSessionDialogOpen, setIsDeleteSessionDialogOpen] =
    React.useState(false);

  const { data, isLoading, error } = useSWR<Session[]>(
    `api/sessions?range=${timeRange}`,
    fetcher
  );
  const sessions = data || [];

  const handleSelectChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  const handleAddButtonClick = () => {
    setIsCreateSessionDialogOpen(true);
  };

  const handleEditClick = (row: Session) => {
    setSelectedRow(row);
    setIsUpdateSessionDialogOpen(true);
  };

  const handleDeleteClick = (row: Session) => {
    setSelectedRow(row);
    setIsDeleteSessionDialogOpen(true);
  };

  const handleCloseCreateSessionDialog = () => {
    setIsCreateSessionDialogOpen(false);
  };

  const handleCloseUpdateSessionDialog = () => {
    setIsUpdateSessionDialogOpen(false);
    setIsUpdateSessionDialogOpen(false);
  };

  const handleCloseDeleteSessionDialog = () => {
    setIsDeleteSessionDialogOpen(false);
  };

  const handleCreateSession = async (
    data: CreateSessionDTO,
    resetForm: () => void
  ) => {
    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    try {
      if (response.ok) {
        handleCloseCreateSessionDialog();
        mutate(`/api/sessions`);
        onSnackbar?.("Session created successfully", "success");
        resetForm();
      } else {
        console.error("Error creating session:", responseData);
        onSnackbar?.(responseData.error.message, "error");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      onSnackbar?.("An unexpected error occurred", "error");
    }
  };

  const handleUpdateSession = async (
    data: UpdateSessionDTO,
    resetForm: () => void
  ) => {
    const response = await fetch(`/api/sessions/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    try {
      if (response.ok) {
        handleCloseUpdateSessionDialog();
        mutate(`api/sessions?range=${timeRange}`);
        onSnackbar?.("Session updated successfully", "success");
        resetForm();
      } else {
        console.error("Error updating session:", responseData);
        onSnackbar?.(responseData.error.message, "error");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      onSnackbar?.("An unexpected error occurred", "error");
    }
  };

  const handleDeleteSession = async (data: Session) => {
    const response = await fetch(`/api/sessions/${data.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    try {
      if (response.ok) {
        handleCloseDeleteSessionDialog();
        mutate(`/api/sessions?filter=${timeRange}`);
        onSnackbar?.("Session deleted successfully", "success");
      } else {
        console.error("Error deleting session:", responseData);
        onSnackbar?.(responseData.error.message, "error");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      onSnackbar?.("An unexpected error occurred", "error");
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
      field: "class",
      headerName: "Class Name",
      minWidth: 200,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<ClassSummary>) => {
        if (params.value == null) {
          return "";
        }
        return params.value.name;
      },
    },
    {
      field: "startTime",
      headerName: "Start Time",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        if (params.value == null) {
          return "";
        }
        return convertToLocalTime(params.value);
      },
    },
    {
      field: "endTime",
      headerName: "End Time",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        if (params.value == null) {
          return "";
        }
        return convertToLocalTime(params.value);
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
    // hide the column with field `id` from list of togglable columns
    return columns
      .filter((column) => column.field !== "id")
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

  const toolbarButtons = [
    <IconButton key="add" onClick={handleAddButtonClick} color="primary">
      <AddBoxIcon />
    </IconButton>,
  ];

  return (
    <>
      <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <FormControl sx={{ my: 1, minWidth: 150 }}>
            <InputLabel id="demo-select-small-label"></InputLabel>
            <Select
              id="demo-select-small"
              value={timeRange}
              displayEmpty
              label=""
              onChange={handleSelectChange}
              style={{ height: "30px" }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="last7Days">Last 7 days</MenuItem>
              <MenuItem value="thisMonth">This month</MenuItem>
              <MenuItem value="yearToDate">Year to date</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <BaseDataGrid
          data={sessions}
          columns={columns}
          isLoading={isLoading}
          getTogglableColumns={getTogglableColumns}
          initialColumnVisibilityModel={initialColumnVisibilityModel}
          additionalToolbarButtons={toolbarButtons}
        />
      </Box>
      <CreateSessionDialog
        open={isCreateSessionDialogOpen}
        onClose={handleCloseCreateSessionDialog}
        onSubmit={handleCreateSession}
      />
      <UpdateSessionDialog
        existingSession={selectedRow}
        open={isUpdateSessionDialogOpen}
        onClose={handleCloseUpdateSessionDialog}
        onSubmit={handleUpdateSession}
      />
      {/* <DeleteSessionDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onSubmit={handleDeleteRowData}
      /> */}
    </>
  );
}
