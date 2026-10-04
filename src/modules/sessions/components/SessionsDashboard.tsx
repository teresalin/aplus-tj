"use client";

import { usePathname, useRouter } from "next/navigation";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";

import BaseDataGrid from "@/components/DataGrid";
import ConfirmDialog from "@/components/ConfirmDialog";
import FormDialog from "@/components/FormDialog";
import RenderMenu from "@/components/grid/RenderMenu";
import { useApiMutation } from "@/hooks/use-api-mutation";
import type { ClassOption } from "@/modules/classes";
import type { StaffOption } from "@/modules/persons/staffs";
import type { Session, SessionRange } from "@/modules/sessions";
import SessionFormFields, {
  emptySessionFormValues,
  hasSessionTimes,
  toCreateSessionPayload,
  toSessionFormValues,
  toUpdateSessionPayload,
  type SessionFormValues,
} from "./SessionFormFields";

const formatLocalTime = (value: Date) =>
  dayjs(value).format("YYYY-MM-DD HH:mm A");

const initialColumnVisibilityModel: GridColumnVisibilityModel = {
  id: false,
};

// Hide the `id` column from the list of togglable columns.
const getTogglableColumns = (columns: GridColDef[]) =>
  columns.filter((column) => column.field !== "id").map((c) => c.field);

/** The dialog being shown; edit and delete always carry the session they act on. */
type DialogState =
  | { type: "create" }
  | { type: "edit"; session: Session }
  | { type: "delete"; session: Session };

interface SessionsDashboardProps {
  sessions: Session[];
  classes: ClassOption[];
  teachers: StaffOption[];
  range: SessionRange;
}

export default function SessionsDashboard({
  sessions,
  classes,
  teachers,
  range,
}: SessionsDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const mutate = useApiMutation();
  // `dialog` outlives `open` so a closing dialog keeps its content while it animates out.
  const [dialog, setDialog] = React.useState<DialogState | null>(null);
  const [open, setOpen] = React.useState(false);
  const showDialog = (next: DialogState) => {
    setDialog(next);
    setOpen(true);
  };
  const closeDialog = () => setOpen(false);

  const handleRangeChange = (event: SelectChangeEvent<SessionRange>) => {
    router.push(`${pathname}?range=${event.target.value}`);
  };

  const handleCreateSession = async (values: SessionFormValues) => {
    const created = await mutate({
      method: "POST",
      url: "/api/sessions",
      body: toCreateSessionPayload(values),
      successMessage: "Session created successfully",
    });
    if (created) closeDialog();
  };

  const handleUpdateSession = async (
    session: Session,
    values: SessionFormValues,
  ) => {
    const updated = await mutate({
      method: "PUT",
      url: `/api/sessions/${session.id}`,
      body: toUpdateSessionPayload(values),
      successMessage: "Session updated successfully",
    });
    if (updated) closeDialog();
  };

  const handleDeleteSession = async (session: Session) => {
    const deleted = await mutate({
      method: "DELETE",
      url: `/api/sessions/${session.id}`,
      successMessage: "Session deleted successfully",
    });
    if (deleted) closeDialog();
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
      renderCell: ({ row, value }) => (
        <Link component={NextLink} href={`/sessions/${row.id}`}>
          {value}
        </Link>
      ),
    },
    {
      field: "teacher",
      headerName: "Teacher",
      minWidth: 150,
      flex: 1,
      valueGetter: ({ row }) => row.teacher.person.name,
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
      field: "status",
      headerName: "Status",
      minWidth: 110,
      flex: 1,
      renderCell: ({ value }) =>
        value === "Cancelled" ? (
          <Chip label="Cancelled" size="small" color="warning" />
        ) : (
          value
        ),
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
          onEditClick={() => showDialog({ type: "edit", session: row })}
          onDeleteClick={() => showDialog({ type: "delete", session: row })}
        />
      ),
    },
  ];

  const toolbarButtons = (
    <IconButton
      aria-label="Add session"
      onClick={() => showDialog({ type: "create" })}
      color="primary"
    >
      <AddBoxIcon />
    </IconButton>
  );

  const renderFields = (
    mode: "create" | "edit",
    values: SessionFormValues,
    setValues: React.Dispatch<React.SetStateAction<SessionFormValues>>,
  ) => (
    <SessionFormFields
      mode={mode}
      session={values}
      setFormData={setValues}
      classes={classes}
      teachers={teachers}
    />
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
      {dialog?.type === "create" && (
        <FormDialog
          open={open}
          title="New session"
          initialValues={emptySessionFormValues}
          canSubmit={hasSessionTimes}
          onClose={closeDialog}
          onSubmit={handleCreateSession}
        >
          {(values, setValues) => renderFields("create", values, setValues)}
        </FormDialog>
      )}
      {dialog?.type === "edit" && (
        <FormDialog
          key={dialog.session.id}
          open={open}
          title="Update session"
          initialValues={toSessionFormValues(dialog.session)}
          canSubmit={hasSessionTimes}
          onClose={closeDialog}
          onSubmit={(values) => handleUpdateSession(dialog.session, values)}
        >
          {(values, setValues) => renderFields("edit", values, setValues)}
        </FormDialog>
      )}
      {dialog?.type === "delete" && (
        <ConfirmDialog
          open={open}
          title="Delete session"
          message="Permanently delete this session? Only delete a session created by mistake; you cannot undo this. A session with attendance can't be deleted: edit it and set its status to Cancelled instead."
          confirmLabel="Delete"
          onClose={closeDialog}
          onConfirm={() => handleDeleteSession(dialog.session)}
        />
      )}
    </>
  );
}
