import * as React from "react";
import Box from "@mui/material/Box";
import fetcher from "../../utils/fetcher";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useSWR from "swr";
import {
  DataGrid,
  useGridRootProps,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbar,
  GridToolbarContainerProps,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { generateColumns } from "../../utils/data-grid/generateColumns";
import InfoIcon from "@mui/icons-material/Info";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";

interface CustomToolbarProps {
  setFilterButtonEl: React.Dispatch<
    React.SetStateAction<HTMLButtonElement | null>
  >;
}

function CustomToolbar({ setFilterButtonEl }: CustomToolbarProps) {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton ref={setFilterButtonEl} />
    </GridToolbarContainer>
  );
}

function a11yProps(key: string) {
  return {
    id: `simple-tab-${key}`,
    "aria-controls": `simple-tabpanel-${key}`,
  };
}

export const GridCustomToolbar = React.forwardRef<
  HTMLDivElement,
  GridToolbarContainerProps
>(function GridToolbar(props, ref) {
  const { className, ...other } = props;
  const rootProps = useGridRootProps();

  if (
    rootProps.disableColumnFilter &&
    rootProps.disableColumnSelector &&
    rootProps.disableDensitySelector
  ) {
    return null;
  }

  return (
    <GridToolbarContainer
      ref={ref}
      {...other}
      sx={{ direction: "row", justifyContent: "space-between" }}
    >
      {/* <GridToolbarContainer ref={ref} {...other}> */}
      <Grid item>
        <GridToolbarQuickFilter />
      </Grid>
      <Grid item>
        <GridToolbarColumnsButton
          title="Column visibility"
          style={{ padding: 0, minHeight: 0, minWidth: 0 }}
        />
        <GridToolbarFilterButton
          style={{ padding: 0, minHeight: 0, minWidth: 0 }}
        />
        <GridToolbarDensitySelector
          title="Density"
          style={{ padding: 0, minHeight: 0, minWidth: 0 }}
        />
        <GridToolbarExport
          title="Export"
          style={{ padding: 0, minHeight: 0, minWidth: 0 }}
        />
      </Grid>
    </GridToolbarContainer>
  );
});

const personTypes = ["persons", "staffs", "parents", "students"];

export default function CustomFilterPanelPosition() {
  const [value, setValue] = React.useState("persons");
  const { data } = useSWR(`api/${value}`, fetcher);
  const rows = data || [];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // TODO pass this into DataGrid
  const getTogglableColumns = (columns: GridColDef[]) => {
    // hide the column with field `id` from list of togglable columns
    return columns
      .filter((column) => column.field !== "id")
      .map((column) => column.field);
  };

  return (
    <div style={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="users tabs">
          {personTypes.map((key) => (
            <Tab key={key} value={key} label={key} {...a11yProps(key)} />
          ))}
        </Tabs>
      </Box>
      {rows && (
        <DataGrid
          localeText={{
            toolbarColumns: "",
            toolbarFilters: "",
            toolbarDensity: "",
            toolbarExport: "",
          }}
          rows={rows}
          columns={generateColumns(rows)}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                gender: false,
                currentSchool: false,
                textbookPublisher: false,
                startDate: false,
                joinDate: false,
                leaveDate: false,
              },
            },
          }}
          // slots={{
          //   toolbar: GridToolbar,
          // }}
          slots={{ toolbar: GridCustomToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          hideFooterSelectedRowCount
        />
      )}
    </div>
  );
}
