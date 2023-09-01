import { useState } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
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
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import InfoIcon from "@mui/icons-material/Info";
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import DehazeIcon from '@mui/icons-material/Dehaze';
import TableRowsIcon from '@mui/icons-material/TableRows';

import fetcher from "../../utils/fetcher";
import NewPersonDialog from "../../src/components/NewPersonDialog";

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
          startIcon={<IconButton>
            <ViewColumnIcon style={{ fontSize: '24px' }} />
          </IconButton>}
          ref={buttonRef}
          style={{ padding: 0, minHeight: 0, minWidth: 0 }}
          sx={{ "& .MuiButton-startIcon": { margin: 0 } }}
        />
        <GridToolbarFilterButton
          componentsProps={{
            button: {
              startIcon: (
                <IconButton>
                  <FilterListIcon style={{ fontSize: '24px' }} />
                </IconButton>
              )
            }
          }}
          ref={buttonRef}
          style={{ padding: 0, minHeight: 0, minWidth: 0 }}
        />
        <GridToolbarDensitySelector
          title="Density"
          ref={buttonRef}
          startIcon={<IconButton>
            <TableRowsIcon style={{ fontSize: '24px' }} />
          </IconButton>}
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

const renderMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title="Actions">
        <IconButton
          onClick={handleClick}
          aria-label="action"
          size="small"
          aria-controls={open ? "person-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="person-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>Edit</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

const columns = [
  {
    field: "id",
    headerName: "id",
    minWidth: 120,
    flex: 1,
  },
  {
    field: "assignmentName",
    headerName: "Assignment Name",
    minWidth: 120,
    flex: 1,
  },
  {
    field: "className",
    headerName: "Class Name",
    minWidth: 120,
    flex: 1,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    minWidth: 120,
    flex: 1,
    valueFormatter: (params: GridValueFormatterParams<Date>) => {
      if (params.value == null) {
        return "";
      }
      return dayjs(params.value).format("YYYY-MM-DD");
    },
  },
  {
    field: "action",
    headerName: "Action",
    minWidth: 70,
    maxWidth: 70,
    flex: 1,
    renderCell: renderMenu,
  },
];

const assignmentTypes = ["all", "upcoming", "past due"];

export default function CustomFilterPanelPosition() {
  const [value, setValue] = React.useState("all");
  const { data } = useSWR(`api/assignments`, fetcher);
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
          {assignmentTypes.map((key) => (
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
          columns={columns}
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
