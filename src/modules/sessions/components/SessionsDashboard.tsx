"use client";

import { usePathname, useRouter } from "next/navigation";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";

import BaseDataGrid from "@/components/DataGrid";
import RenderMenu from "@/components/grid/RenderMenu";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { apiRequest, getErrorMessage } from "@/lib/api/client";
import type { ClassOption } from "@/modules/classes";
import type { Session, SessionRange } from "@/modules/sessions";
import CreateSessionDialog from "./CreateSessionDialog";
import DeleteSessionDialog from "./DeleteSessionDialog";
import UpdateSessionDialog from "./UpdateSessionDialog";
import { toSessionPayload, type SessionFormValues } from "./SessionFormFields";

const formatLocalTime = (value: Date) =>
  dayjs(value).format("YYYY-MM-DD HH:mm A");

const initialColumnVisibilityModel: GridColumnVisibilityModel = {
  id: false,
};

// Hide the `id` column from the list of togglable columns.
const getTogglableColumns = (columns: GridColDef[]) =>
  columns.filter((column) => column.field !== "id").map((c) => c.field);

interface SessionsDashboardProps {
  sessions: Session[];
  classes: ClassOption[];
  range: SessionRange;
}

export default function SessionsDashboard({
  sessions,
  classes,
  range,
}: SessionsDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const notify = useSnackbar();

  const [selectedRow, setSelectedRow] = React.useState<Session | null>(null);
  const [isCreateSessionDialogOpen, setIsCreateSessionDialogOpen] =
    React.useState(false);
  const [isUpdateSessionDialogOpen, setIsUpdateSessionDialogOpen] =
    React.useState(false);
  const [isDeleteSessionDialogOpen, setIsDeleteSessionDialogOpen] =
    React.useState(false);

  const handleRangeChange = (event: SelectChangeEvent<SessionRange>) => {
    router.push(`${pathname}?range=${event.target.value}`);
  };

  const handleEditClick = (row: Session) => {
    setSelectedRow(row);
    setIsUpdateSessionDialogOpen(true);
  };

  const handleDeleteClick = (row: Session) => {
    setSelectedRow(row);
    setIsDeleteSessionDialogOpen(true);
  };

  const handleCreateSession = async (
    data: SessionFormValues,
    resetForm: () => void,
  ) => {
    try {
      await apiRequest("/api/sessions", "POST", toSessionPayload(data));
      setIsCreateSessionDialogOpen(false);
      notify("Session created successfully");
      resetForm();
      router.refresh();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  const handleUpdateSession = async (data: SessionFormValues) => {
    if (!selectedRow) return;
    try {
      await apiRequest(
        `/api/sessions/${selectedRow.id}`,
        "PUT",
        toSessionPayload(data),
      );
      setIsUpdateSessionDialogOpen(false);
      notify("Session updated successfully");
      router.refresh();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  const handleDeleteSession = async () => {
    if (!selectedRow) return;
    try {
      await apiRequest(`/api/sessions/${selectedRow.id}`, "DELETE");
      setIsDeleteSessionDialogOpen(false);
      setSelectedRow(null);
      notify("Session deleted successfully");
      router.refresh();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  const columns: GridColDef<Session>[] = [
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
      valueGetter: ({ row }) => row.class.name,
    },
    {
      field: "startTime",
      headerName: "Start Time",
      minWidth: 120,
      flex: 1,
      valueFormatter: ({ value }) => (value ? formatLocalTime(value) : ""),
    },
    {
      field: "endTime",
      headerName: "End Time",
      minWidth: 120,
      flex: 1,
      valueFormatter: ({ value }) => (value ? formatLocalTime(value) : ""),
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 70,
      maxWidth: 70,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <RenderMenu
          onEditClick={() => handleEditClick(row)}
          onDeleteClick={() => handleDeleteClick(row)}
        />
      ),
    },
  ];

  const toolbarButtons = (
    <IconButton
      onClick={() => setIsCreateSessionDialogOpen(true)}
      color="primary"
    >
      <AddBoxIcon />
    </IconButton>
  );

  return (
    <>
      <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <FormControl sx={{ my: 1, minWidth: 150 }}>
            <Select<SessionRange>
              id="session-range-select"
              value={range}
              onChange={handleRangeChange}
              inputProps={{ "aria-label": "Session date range" }}
              style={{ height: "30px" }}
            >
              <MenuItem value="all">
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
          getTogglableColumns={getTogglableColumns}
          initialColumnVisibilityModel={initialColumnVisibilityModel}
          additionalToolbarButtons={toolbarButtons}
        />
      </Box>
      <CreateSessionDialog
        open={isCreateSessionDialogOpen}
        onClose={() => setIsCreateSessionDialogOpen(false)}
        onSubmit={handleCreateSession}
        classes={classes}
      />
      <UpdateSessionDialog
        existingSession={selectedRow}
        open={isUpdateSessionDialogOpen}
        onClose={() => setIsUpdateSessionDialogOpen(false)}
        onSubmit={handleUpdateSession}
        classes={classes}
      />
      <DeleteSessionDialog
        open={isDeleteSessionDialogOpen}
        onClose={() => setIsDeleteSessionDialogOpen(false)}
        onSubmit={handleDeleteSession}
      />
    </>
  );
}
