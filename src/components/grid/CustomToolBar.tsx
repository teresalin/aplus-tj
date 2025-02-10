import React from "react";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import FilterListIcon from "@mui/icons-material/FilterList";
import Grid from "@mui/material/Grid";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

export interface CustomToolbarProps {
  children: React.JSX.Element;
  setButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

function CustomToolBar({ children, setButtonEl }: CustomToolbarProps) {
  return (
    <GridToolbarContainer
      sx={{ direction: "row", justifyContent: "space-between" }}
    >
      <Grid item>
        <GridToolbarQuickFilter sx={{ marginLeft: 1 }} />
      </Grid>
      <Grid item>
        {children}
        <GridToolbarColumnsButton
          title="Column visibility"
          ref={setButtonEl}
          startIcon={<ViewColumnIcon />}
          sx={{
            padding: 0,
            minHeight: 0,
            minWidth: 0,
            borderRadius: 5,
            "& .MuiButton-startIcon": {
              "& > *:first-of-type": { fontSize: 24 },
              margin: 0,
              padding: "4px",
            },
          }}
        />
        <GridToolbarFilterButton
          ref={setButtonEl}
          componentsProps={{
            button: {
              startIcon: <FilterListIcon />,
            },
          }}
          sx={{
            padding: 0,
            minHeight: 0,
            minWidth: 0,
            borderRadius: 5,
            "& .MuiButton-startIcon": {
              "& > *:first-of-type": { fontSize: 24 },
              margin: 0,
              padding: "4px",
            },
          }}
        />
        <GridToolbarDensitySelector
          title="Density"
          startIcon={<TableRowsIcon />}
          sx={{
            padding: 0,
            minHeight: 0,
            minWidth: 0,

            borderRadius: 5,
            "& .MuiButton-startIcon": {
              "& > *:first-of-type": { fontSize: 24 },
              margin: 0,
              padding: "4px",
            },
          }}
        />
        <GridToolbarExport
          title="Export"
          startIcon={<DownloadForOfflineIcon />}
          sx={{
            padding: 0,
            minHeight: 0,
            minWidth: 0,
            borderRadius: 5,
            "& .MuiButton-startIcon": {
              "& > *:first-of-type": { fontSize: 24 },
              margin: 0,
              padding: "4px",
            },
          }}
        />
      </Grid>
    </GridToolbarContainer>
  );
}

export default CustomToolBar;
