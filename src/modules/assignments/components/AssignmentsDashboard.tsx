"use client";

import { useRouter } from "next/navigation";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";

import BaseDataGrid from "@/components/DataGrid";
import LinkTabs from "@/components/navigation/LinkTabs";
import RenderMenu from "@/components/grid/RenderMenu";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { apiRequest, getErrorMessage } from "@/lib/api/client";
import { formatDate } from "@/lib/dates";
import {
  ASSIGNMENT_FILTERS,
  type Assignment,
  type AssignmentFilter,
} from "@/modules/assignments";
import type { ClassOption } from "@/modules/classes";
import CreateAssignmentDialog from "./CreateAssignmentDialog";
import DeleteAssignmentDialog from "./DeleteAssignmentDialog";
import UpdateAssignmentDialog from "./UpdateAssignmentDialog";
import {
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
  const router = useRouter();
  const notify = useSnackbar();

  const [isUpdateAssignmentDialogOpen, setIsUpdateAssignmentDialogOpen] =
    React.useState(false);
  const [isCreateAssignmentDialogOpen, setIsCreateAssignmentDialogOpen] =
    React.useState(false);
  const [isDeleteAssignmentDialogOpen, setIsDeleteAssignmentDialogOpen] =
    React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Assignment | null>(null);

  const handleEditClick = (row: Assignment) => {
    setSelectedRow(row);
    setIsUpdateAssignmentDialogOpen(true);
  };

  const handleDeleteClick = (row: Assignment) => {
    setSelectedRow(row);
    setIsDeleteAssignmentDialogOpen(true);
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
    data: AssignmentFormValues,
    resetForm: () => void,
  ) => {
    try {
      await apiRequest("/api/assignments", "POST", toAssignmentPayload(data));
      setIsCreateAssignmentDialogOpen(false);
      notify("Assignment created successfully");
      resetForm();
      router.refresh();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  const handleUpdateAssignment = async (data: AssignmentFormValues) => {
    if (!selectedRow) return;
    try {
      await apiRequest(
        `/api/assignments/${selectedRow.id}`,
        "PUT",
        toAssignmentPayload(data),
      );
      handleCloseUpdateAssignmentDialog();
      notify("Assignment updated successfully");
      router.refresh();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  };

  const handleDeleteAssignment = async (data: Assignment) => {
    try {
      await apiRequest(`/api/assignments/${data.id}`, "DELETE");
      handleCloseDeleteAssignmentDialog();
      notify("Assignment deleted successfully");
      router.refresh();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
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
          onEditClick={() => handleEditClick(row)}
          onDeleteClick={() => handleDeleteClick(row)}
        />
      ),
    },
  ];

  const toolbarButtons = (
    <IconButton
      onClick={() => setIsCreateAssignmentDialogOpen(true)}
      color="primary"
    >
      <AddBoxIcon />
    </IconButton>
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
        {/* TODO fix overlapping input fields */}
      </Box>
      <UpdateAssignmentDialog
        existingAssignment={selectedRow}
        open={isUpdateAssignmentDialogOpen}
        onClose={handleCloseUpdateAssignmentDialog}
        onSubmit={handleUpdateAssignment}
        classes={classes}
      />
      <CreateAssignmentDialog
        open={isCreateAssignmentDialogOpen}
        onClose={() => setIsCreateAssignmentDialogOpen(false)}
        onSubmit={handleCreateAssignment}
        classes={classes}
      />
      <DeleteAssignmentDialog
        assignment={selectedRow}
        open={isDeleteAssignmentDialogOpen}
        onClose={handleCloseDeleteAssignmentDialog}
        onSubmit={handleDeleteAssignment}
      />
    </>
  );
}
