"use client";

import React from "react";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
  GridEventListener,
  GridRowSelectionModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import CustomToolBar from "./grid/CustomToolBar";

interface BaseDataGridProps<R extends GridValidRowModel> {
  data: R[];
  columns: GridColDef<R>[];
  isLoading?: boolean;
  onRowClick?: GridEventListener<"rowClick">;
  getTogglableColumns?: (columns: GridColDef[]) => string[];
  initialColumnVisibilityModel: GridColumnVisibilityModel;
  additionalToolbarButtons?: React.ReactNode;
}

// Rows are never selectable; clicks are used for navigation instead.
const NO_SELECTION: GridRowSelectionModel = [];

export default function BaseDataGrid<R extends GridValidRowModel>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  getTogglableColumns,
  initialColumnVisibilityModel,
  additionalToolbarButtons,
}: BaseDataGridProps<R>) {
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>(initialColumnVisibilityModel);
  const [buttonEl, setButtonEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  return (
    <DataGrid
      getRowId={(row) => row.id}
      rows={data}
      loading={isLoading}
      columns={columns}
      rowSelectionModel={NO_SELECTION}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={setColumnVisibilityModel}
      onRowClick={onRowClick}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
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
          children: additionalToolbarButtons,
          setButtonEl,
        },
        columnsPanel: {
          getTogglableColumns,
        },
      }}
      pageSizeOptions={[5, 10, 25]}
      hideFooterSelectedRowCount
    />
  );
}
