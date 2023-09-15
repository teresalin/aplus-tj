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

function CustomToolBar({ buttonRef, children }) {
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
          ref={buttonRef}
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
          ref={buttonRef}
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
          ref={buttonRef}
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
          ref={buttonRef}
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
