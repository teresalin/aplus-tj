import React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
  GridToolbar,
} from "@mui/x-data-grid";

interface BaseDataGridProps {
  data: any[];
  columns: GridColDef[];
  isLoading: boolean;
  onAddClick?: () => void;
  onRowClick?: (row: any) => void;
  getTogglableColumns?: (columns: GridColDef[]) => string[];
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
  onRowClick,
  initialColumnVisibilityModel,
}) => {
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>(initialColumnVisibilityModel);
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);

  const onColumnVisibilityChange = (
    model: React.SetStateAction<GridColumnVisibilityModel>
  ) => {
    if (typeof model === "function") {
      return;
    }

    let count = 0;
    Object.keys(model).forEach((key) => {
      if (model[key as keyof GridColumnVisibilityModel]) {
        count++;
      }
    });

    setColumnVisibilityModel(model);
  };

  return (
    <DataGrid
      getRowId={(row) => row.id}
      rows={data}
      loading={isLoading}
      columns={columns}
      rowSelectionModel={rowSelectionModel}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={(newModel) => {
        onColumnVisibilityChange(newModel);
      }}
      onRowClick={onRowClick}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
        columns: {
          columnVisibilityModel: columnVisibilityModel,
        },
      }}
      slots={{
        toolbar: GridToolbar,
      }}
      pageSizeOptions={[5, 10, 25]}
      hideFooterSelectedRowCount
    />
  );
};

export default BaseDataGrid;
