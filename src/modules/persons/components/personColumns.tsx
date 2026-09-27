import type { Person } from "@prisma/client";
import type { ReactNode } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";

import { formatDate } from "@/lib/dates";

/** The fields every person list (students, staff, parents) shows. */
export interface PersonRow {
  id: string;
  createdAt: Date;
  person: Pick<
    Person,
    "name" | "gender" | "phone" | "email" | "dateOfBirth" | "active"
  >;
}

const renderActiveIcon = (active: boolean) =>
  active ? (
    <CheckCircleIcon color="success" titleAccess="Active" />
  ) : (
    <CancelIcon color="error" titleAccess="Inactive" />
  );

/** Grid columns for a person list; `renderActive` customizes the status cell. */
export function personColumns<R extends PersonRow>(
  renderActive: (active: boolean) => ReactNode = renderActiveIcon,
): GridColDef<R>[] {
  return [
    { field: "id", headerName: "ID", minWidth: 50, flex: 1 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
      valueGetter: ({ row }) => row.person.name,
    },
    {
      field: "gender",
      headerName: "Gender",
      minWidth: 100,
      flex: 1,
      valueGetter: ({ row }) => row.person.gender,
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: 120,
      flex: 1,
      valueGetter: ({ row }) => row.person.phone,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
      valueGetter: ({ row }) => row.person.email,
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      minWidth: 120,
      flex: 1,
      valueGetter: ({ row }) => row.person.dateOfBirth,
      valueFormatter: ({ value }) => formatDate(value),
    },
    {
      field: "active",
      headerName: "Active",
      minWidth: 100,
      flex: 1,
      valueGetter: ({ row }) => row.person.active,
      renderCell: ({ value }) => renderActive(Boolean(value)),
    },
    {
      field: "createdAt",
      headerName: "Created On",
      minWidth: 120,
      flex: 1,
      valueFormatter: ({ value }) => formatDate(value),
    },
  ];
}

export const personColumnVisibility: GridColumnVisibilityModel = {
  id: false,
  gender: false,
  createdAt: false,
};

/** Columns users may show or hide (ids and audit fields stay hidden). */
export const getTogglablePersonColumns = (columns: GridColDef[]) =>
  columns
    .filter((column) => column.field !== "id" && column.field !== "createdAt")
    .map((column) => column.field);
