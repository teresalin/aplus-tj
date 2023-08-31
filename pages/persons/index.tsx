import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useSWR from "swr";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import NewPersonDialog from "../../src/components/NewPersonDialog";
import fetcher from "../../utils/fetcher";
import { generateColumns } from "../../utils/data-grid/generateColumns";

function a11yProps(key: string) {
  return {
    id: `simple-tab-${key}`,
    "aria-controls": `simple-tabpanel-${key}`,
  };
}

// TODO fix toolbar icon sizes and hover
function CustomToolbar({ buttonRef }) {
  return (
    <GridToolbarContainer
      sx={{ direction: "row", justifyContent: "space-between" }}
    >
      <Grid item>
        <GridToolbarQuickFilter style={{ marginLeft: 8 }} />
      </Grid>
      <Grid item>
        <NewPersonDialog personType={"persons"} />
        <GridToolbarColumnsButton
          title="Column visibility"
          ref={buttonRef}
          style={{ padding: 0, minHeight: 0, minWidth: 0 }}
        />
        <GridToolbarFilterButton
          ref={buttonRef}
          style={{ padding: 0, minHeight: 0, minWidth: 0 }}
        />
        <GridToolbarDensitySelector
          title="Density"
          ref={buttonRef}
          style={{
            padding: 0,
            minHeight: 0,
            minWidth: 0,
          }}
        />
        <GridToolbarExport
          ref={buttonRef}
          title="Export"
          style={{ padding: 0, minHeight: 0, minWidth: 0 }}
        />
      </Grid>
    </GridToolbarContainer>
  );
}

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

  const buttonRef = React.useRef<HTMLButtonElement>(null);

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
          sx={{ backgroundColor: "#fff" }}
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
                gender: false,
                currentSchool: false,
                textbookPublisher: false,
                startDate: false,
                joinDate: false,
                leaveDate: false,
              },
            },
          }}
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            basePopper: {
              anchorEl: buttonRef.current,
              placement: "bottom-end",
            },
            toolbar: {
              buttonRef,
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          hideFooterSelectedRowCount
        />
      )}
    </div>
  );
}
