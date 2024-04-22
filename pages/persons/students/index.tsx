import { useRouter } from "next/router";
import React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useSWR from "swr";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
  GridRowHeightParams,
  GridRowSelectionModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";

import CustomToolBar from "../../../src/components/grid/CustomToolBar";
import fetcher from "../../../utils/fetcher";
import UpdateCreateStudentDialog from "../../../src/components/person/student/forms/UpdateStudentDialog";
import { Staff } from "../../../src/components/person/staff/types";
import { Student } from "../../../src/components/person/student/types";

function a11yProps(key: string) {
  return {
    id: `simple-tab-${key}`,
    "aria-controls": `simple-tabpanel-${key}`,
  };
}

const personTypes = ["students", "parents", "staffs"];

export default function PersonGrid() {
  const router = useRouter();
  const [tab, setTab] = React.useState("students");
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>({
      detailPanel: true,
      personId: false,
      name: true,
      gender: false,
      phone: true,
      email: true,
      dateOfBirth: true,
      active: true,
      created: false,
      action: true,
    });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isCreateStudentDialogOpen, setIsCreateStudentDialogOpen] =
    React.useState(false);
  const [buttonEl, setButtonEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const { data } = useSWR("/api/persons/students", fetcher);
  const students = (data as Student[]) || [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
    // Define the route to navigate to based on the selected tab
    let routeToNavigate = `/persons/${newValue}`; // Construct the new route
    // Use the router to navigate to the selected route
    router.push(routeToNavigate);
  };

  const handleAddButtonClick = () => {
    // openDialog();
  };

  const handleCreateStudent = async (data) => {
    const url = "/api/persons/students/index";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      //   closeDialog();
    } else {
      console.error("Error creating student:", response.statusText);
    }
  };

  const onRowClick = (data: { personId: string }) => {
    router.push(`/persons/[tab]/[id]`, `/persons/${tab}/${data.personId}`);
  };

  const getTogglableColumns = (columns: GridColDef[]) => {
    return columns
      .filter(
        (column) =>
          column.field !== "personId" &&
          column.field !== "action" &&
          column.field !== "detailPanel" &&
          column.field !== "created"
      )
      .map((column) => column.field);
  };

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

  const renderChip = (params) => {
    return params.value ? (
      <Chip
        // icon={<CheckIcon />}
        label="Active"
        size="small"
        sx={{ height: "20px", paddingX: 1 }}
        style={{ backgroundColor: "#bef0cc", color: "#507b67" }}
      />
    ) : (
      <Chip
        // icon={<CloseIcon />}
        label="Inactive"
        size="small"
        sx={{ height: "20px" }}
        style={{ backgroundColor: "#f9e8e8", color: "#9f3d49" }}
      />
    );
  };

  const columns: GridColDef[] = [
    {
      field: "personId",
      headerName: "id",
      minWidth: 50,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "gender",
      headerName: "Gender",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
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
      field: "active",
      headerName: "Active",
      minWidth: 100,
      flex: 1,
      renderCell: renderChip,
    },
    // TODO fix failed prop type warning
    {
      field: "created",
      headerName: "Created On",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        if (params.value == null) {
          return "";
        }
        return dayjs(params.value).format("YYYY-MM-DD");
      },
    },
  ];

  if (!students) return <CircularProgress />;

  return (
    <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="users tabs">
          {personTypes.map((key) => (
            <Tab key={key} value={key} label={key} {...a11yProps(key)} />
          ))}
        </Tabs>
      </Box>
      <DataGrid
        getRowId={(row) => row.personId}
        autoHeight={true}
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
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) => {
          onColumnVisibilityChange(newModel);
        }}
        rows={students}
        columns={columns}
        rowSelectionModel={rowSelectionModel}
        onRowClick={(params) => onRowClick(params.row)}
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
            children: <AddIconButton onClick={handleAddButtonClick} />,
            setButtonEl,
          },
          columnsPanel: {
            getTogglableColumns,
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        hideFooterSelectedRowCount
      />
    </Box>
  );
}
