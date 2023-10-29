import * as React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import tz from "dayjs/plugin/timezone";
import useSWR from "swr";
import utc from "dayjs/plugin/utc";
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

import { Assignment } from "../api/assignments";
import { Session } from "../api/sessions";
import CustomToolBar from "../../src/components/grid/CustomToolBar";
import DeleteSessionDialog from "../../src/components/session/DeleteSessionDialog";
import fetcher from "../../utils/fetcher";
import NewSessionDialog from "../../src/components/session/NewSessionDialog";
import RenderMenu from "../../src/components/grid/RenderMenu";

dayjs.extend(CustomParseFormat);
dayjs.extend(utc);
dayjs.extend(tz);

export default function SessionGrid() {
  const [timeRange, setTimeRange] = React.useState("thisMonth");
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const [selectedRowData, setSelectedRowData] = React.useState<
    Assignment | undefined
  >({} as Assignment);
  const [isNewDialogOpen, setIsNewDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [buttonEl, setButtonEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const { data } = useSWR(`api/sessions?range=${timeRange}`, fetcher);
  const sessions = data as Session[];

  const handleSelectChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  const handleOpenNewDialog = () => {
    setIsNewDialogOpen(true);
  };

  const handleCloseNewDialog = () => {
    setIsNewDialogOpen(false);
  };

  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleRenderMenuClick = (row) => {
    setSelectedRowData(row);
  };

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) =>
      sessions.find((row) => row.id === id)
    );
    setSelectedRowData(selectedRowsData[0]);
  };

  // TODO creating without description does not close dialog
  const handleCreateNewAssignment = async (data) => {
    const response = await fetch(`/api/assignments/[assignment_id]`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setIsNewDialogOpen(false);
    } else {
      console.error("Error updating assignment data:", response.statusText);
    }
  };

  const handleSaveRowData = async (editedData) => {
    const response = await fetch(`/api/assignments/${editedData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedData),
    });

    if (response.ok) {
      setIsEditDialogOpen(false);
    } else {
      console.error("Error updating assignment data:", response.statusText);
    }
  };

  const handleDeleteRowData = async () => {
    const response = await fetch(`/api/assignments/${selectedRowData?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      setIsDeleteDialogOpen(false);
    } else {
      console.error("Error deleting assignment data:", response.statusText);
    }
  };

  // TODO pass this into DataGrid
  const getTogglableColumns = (columns: GridColDef[]) => {
    // hide the column with field `id` from list of togglable columns
    return columns
      .filter((column) => column.field !== "id")
      .map((column) => column.field);
  };

  function AddIconButton({ onClick }) {
    return (
      <IconButton
        aria-label="Add box icon"
        onClick={onClick}
        color="primary"
        sx={{ padding: "4px" }}
      >
        <AddBoxIcon />
      </IconButton>
    );
  }

  const convertToTime = (ft) =>
    dayjs(ft, "HH:mm:ss", "en", true).isValid()
      ? dayjs(ft, "HH:mm:ss").format("hh:ss A")
      : ft;

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "id",
      minWidth: 50,
      flex: 1,
    },
    {
      field: "className",
      headerName: "Class Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "sessionDate",
      headerName: "sessionDate",
      minWidth: 150,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        if (params.value == null) {
          return "";
        }
        return dayjs.utc(params.value).tz("Asia/Taipei").format("YYYY-MM-DD");
      },
    },
    {
      field: "startTime",
      headerName: "Start Time",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        if (params.value == null) {
          return "";
        }
        return convertToTime(params.value);
      },
    },
    {
      field: "endTime",
      headerName: "End Time",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        if (params.value == null) {
          return "";
        }
        return convertToTime(params.value);
      },
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 70,
      maxWidth: 70,
      flex: 1,
      renderCell: (params) => (
        <RenderMenu
          onEditClick={handleOpenEditDialog}
          onDeleteClick={handleOpenDeleteDialog}
        />
      ),
    },
  ];

  if (!sessions) return <CircularProgress />;

  return (
    <Box style={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <FormControl sx={{ my: 1, minWidth: 150 }}>
          <InputLabel id="demo-select-small-label"></InputLabel>
          <Select
            id="demo-select-small"
            value={timeRange}
            displayEmpty
            label=""
            onChange={handleSelectChange}
            style={{ height: "30px" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="last7Days">Last 7 days</MenuItem>
            <MenuItem value="thisMonth">This month</MenuItem>
            <MenuItem value="yearToDate">Year to date</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DataGrid
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
        rows={sessions}
        columns={columns}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
        localeText={{
          toolbarColumns: "",
          toolbarFilters: "",
          toolbarDensity: "",
          toolbarExport: "",
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          columns: {
            columnVisibilityModel: {
              id: false,
              created: false,
            },
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
            children: <AddIconButton onClick={handleOpenNewDialog} />,
            setButtonEl,
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        hideFooterSelectedRowCount
      />
      <NewSessionDialog
        open={isNewDialogOpen}
        onClose={handleCloseNewDialog}
        onSubmit={handleCreateNewAssignment}
      />
      <DeleteSessionDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onSubmit={handleDeleteRowData}
      />
    </Box>
  );
}
