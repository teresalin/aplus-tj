import AddBoxIcon from "@mui/icons-material/AddBox";
import IconButton from "@mui/material/IconButton";
import React from "react";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import CustomToolBar from "../../../src/components/grid/CustomToolBar";

interface BaseDataGridProps {
  data: any[];
  columns: GridColDef[];
  isLoading: boolean;
  onAddClick?: () => void;
  onRowClick?: (row: any) => void;
  getTogglableColumns?: (columns: GridColDef[]) => string[]; // Optional function to determine which columns are togglable
  initialColumnVisibilityModel: GridColumnVisibilityModel;
}

const AddIconButton = ({ onClick }) => (
  <IconButton
    aria-label="Add"
    onClick={onClick}
    color="primary"
    sx={{ padding: "4px" }}
  >
    <AddBoxIcon />
  </IconButton>
);

const BaseDataGrid: React.FC<BaseDataGridProps> = ({
  data,
  columns,
  isLoading,
  onAddClick,
  onRowClick,
  getTogglableColumns,
  initialColumnVisibilityModel,
}) => {
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>(initialColumnVisibilityModel);
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const [buttonEl, setButtonEl] = React.useState<HTMLButtonElement | null>(
    null
  );

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

  return (
    <DataGrid
      getRowId={() => self.crypto.randomUUID()}
      autoHeight
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
      rows={data}
      loading={isLoading}
      columns={columns}
      rowSelectionModel={rowSelectionModel}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={(newModel) => {
        onColumnVisibilityChange(newModel);
      }}
      onRowClick={onRowClick}
      localeText={{
        toolbarColumns: "",
        toolbarFilters: "",
        toolbarDensity: "",
        toolbarExport: "",
      }}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
        columns: {
          columnVisibilityModel: columnVisibilityModel,
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
          children: onAddClick && <AddIconButton onClick={onAddClick} />,
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
};

export default BaseDataGrid;
