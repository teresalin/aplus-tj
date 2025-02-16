import React from "react";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import CustomToolBar from "./grid/CustomToolBar";

interface BaseDataGridProps {
  data: any[];
  columns: GridColDef[];
  isLoading: boolean;
  onRowClick?: (row: any) => void;
  getTogglableColumns?: (columns: GridColDef[]) => string[];
  initialColumnVisibilityModel: GridColumnVisibilityModel;
  additionalToolbarButtons?: React.ReactNode[];
}

const BaseDataGrid: React.FC<BaseDataGridProps> = ({
  data,
  columns,
  isLoading,
  onRowClick,
  initialColumnVisibilityModel,
  additionalToolbarButtons = [],
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
      }}
      pageSizeOptions={[5, 10, 25]}
      hideFooterSelectedRowCount
    />
  );
};

export default BaseDataGrid;
