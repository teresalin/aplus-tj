// utils/columnUtils.ts
import { GridColDef } from "@mui/x-data-grid";

export const getTogglableColumns = (columns: GridColDef[]) => {
  // hide the column with field `id` from list of togglable columns
  return columns
    .filter((column) => column.field !== "id")
    .map((column) => column.field);
};
