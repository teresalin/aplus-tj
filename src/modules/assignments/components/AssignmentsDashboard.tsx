"use client";

import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";

import BaseDataGrid from "@/components/DataGrid";
import ConfirmDialog from "@/components/ConfirmDialog";
import FormDialog from "@/components/FormDialog";
import LinkTabs from "@/components/navigation/LinkTabs";
import RenderMenu from "@/components/grid/RenderMenu";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { formatDate } from "@/lib/dates";
import {
  ASSIGNMENT_FILTERS,
  type Assignment,
  type AssignmentFilter,
} from "@/modules/assignments";
import type { ClassOption } from "@/modules/classes";
import AssignmentFormFields, {
  emptyAssignmentFormValues,
  toAssignmentFormValues,
  toAssignmentPayload,
  type AssignmentFormValues,
} from "./AssignmentFormFields";

const filterHref = (filter: AssignmentFilter) =>
  `/assignments?filter=${encodeURIComponent(filter)}`;

const filterTabs = ASSIGNMENT_FILTERS.map((filter) => ({
  label: filter,
  href: filterHref(filter),
}));

const getTogglableColumns = (columns: GridColDef[]) =>
  columns
    .filter(
      (column) =>
        column.field !== "id" &&
        column.field !== "action" &&
        column.field !== "createdAt",
    )
    .map((column) => column.field);

const initialColumnVisibilityModel: GridColumnVisibilityModel = {
  id: false,
  createdAt: false,
};

/** The dialog being shown; edit and delete always carry the assignment they act on. */
type DialogState =
  | { type: "create" }
  | { type: "edit"; assignment: Assignment }
  | { type: "delete"; assignment: Assignment };

interface AssignmentsDashboardProps {
  assignments: Assignment[];
  classes: ClassOption[];
  filter: AssignmentFilter;
}

export default function AssignmentsDashboard({
  assignments,
  classes,
  filter,
}: AssignmentsDashboardProps) {
  const mutate = useApiMutation();
  // `dialog` outlives `open` so a closing dialog keeps its content while it animates out.
  const [dialog, setDialog] = React.useState<DialogState | null>(null);
  const [open, setOpen] = React.useState(false);
  const showDialog = (next: DialogState) => {
    setDialog(next);
    setOpen(true);
  };
  const closeDialog = () => setOpen(false);

  const handleCreateAssignment = async (values: AssignmentFormValues) => {
    const created = await mutate({
      method: "POST",
      url: "/api/assignments",
      body: toAssignmentPayload(values),
      successMessage: "Assignment created successfully",
    });
    if (created) closeDialog();
  };

  const handleUpdateAssignment = async (
    assignment: Assignment,
    values: AssignmentFormValues,
  ) => {
    const updated = await mutate({
      method: "PUT",
      url: `/api/assignments/${assignment.id}`,
      body: toAssignmentPayload(values),
      successMessage: "Assignment updated successfully",
    });
    if (updated) closeDialog();
  };

  const handleDeleteAssignment = async (assignment: Assignment) => {
    const deleted = await mutate({
      method: "DELETE",
      url: `/api/assignments/${assignment.id}`,
      successMessage: "Assignment deleted successfully",
    });
    if (deleted) closeDialog();
  };

  const columns: GridColDef<Assignment>[] = [
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
      valueGetter: ({ row }) => row.class?.name,
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
      valueFormatter: ({ value }) => formatDate(value),
    },
    {
      field: "createdAt",
      headerName: "Created On",
      minWidth: 120,
      flex: 1,
      valueFormatter: ({ value }) => formatDate(value),
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
          onEditClick={() => showDialog({ type: "edit", assignment: row })}
          onDeleteClick={() => showDialog({ type: "delete", assignment: row })}
        />
      ),
    },
  ];

  const toolbarButtons = (
    <IconButton
      aria-label="Add assignment"
      onClick={() => showDialog({ type: "create" })}
      color="primary"
    >
      <AddBoxIcon />
    </IconButton>
  );

  const renderFields = (
    values: AssignmentFormValues,
    setValues: React.Dispatch<React.SetStateAction<AssignmentFormValues>>,
  ) => (
    <AssignmentFormFields
      assignment={values}
      setFormData={setValues}
      classes={classes}
    />
  );

  return (
    <>
      <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <LinkTabs
            tabs={filterTabs}
            value={filterHref(filter)}
            ariaLabel="assignment tabs"
          />
        </Box>
        <BaseDataGrid
          data={assignments}
          columns={columns}
          getTogglableColumns={getTogglableColumns}
          initialColumnVisibilityModel={initialColumnVisibilityModel}
          additionalToolbarButtons={toolbarButtons}
        />
      </Box>
      {dialog?.type === "create" && (
        <FormDialog
          open={open}
          title="New assignment"
          initialValues={emptyAssignmentFormValues}
          onClose={closeDialog}
          onSubmit={handleCreateAssignment}
        >
          {renderFields}
        </FormDialog>
      )}
      {dialog?.type === "edit" && (
        <FormDialog
          key={dialog.assignment.id}
          open={open}
          title="Update Assignment"
          initialValues={toAssignmentFormValues(dialog.assignment)}
          onClose={closeDialog}
          onSubmit={(values) =>
            handleUpdateAssignment(dialog.assignment, values)
          }
        >
          {renderFields}
        </FormDialog>
      )}
      {dialog?.type === "delete" && (
        <ConfirmDialog
          open={open}
          title="Delete Assignment"
          message="Permanently delete this assignment and remove it from its corresponding class? You cannot undo this action."
          confirmLabel="Delete"
          onClose={closeDialog}
          onConfirm={() => handleDeleteAssignment(dialog.assignment)}
        />
      )}
    </>
  );
}
