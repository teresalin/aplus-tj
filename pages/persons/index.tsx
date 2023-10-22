import * as React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

import fetcher from "../../utils/fetcher";
import CustomToolBar from "../../src/components/grid/CustomToolBar";
import DetailPanel from "../../src/components/grid/DetailPanel";
import RenderMenu from "../../src/components/grid/RenderMenu";
import StaffDetailPanel from "../../src/components/person/StaffDetailPanel";
import StudentDetailPanel from "../../src/components/person/StudentDetailPanel";
import UpdateCreateStudentDialog from "../../src/components/person/student/UpdateCreateStudentDialog";
import { Student } from "../api/students";
import DeactivateStudentDialog from "../../src/components/person/student/DeactivateStudentDialog";

function a11yProps(key: string) {
  return {
    id: `simple-tab-${key}`,
    "aria-controls": `simple-tabpanel-${key}`,
  };
}

const personTypes = ["students", "parents", "staffs"];

export default function PersonGrid() {
  const [tab, setTab] = React.useState("students");
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  // const [selectedRowData, setSelectedRowData] = React.useState<Person>(
  //   {} as Person
  // );
  const [detailPanelOpen, setDetailPanelOpen] = React.useState<
    Map<string, boolean>
  >(new Map());
  const [visibleColumnCount, setVisibleColumnCount] = React.useState(7);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>({
      detailPanel: true,
      id: false,
      name: true,
      gender: false,
      phone: true,
      email: true,
      dateOfBirth: true,
      active: true,
      created: false,
      action: true,
    });
  const [isUpdateCreateDialogOpen, setIsUpdateCreateDialogOpen] =
    React.useState(false);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [rowToEdit, setRowToEdit] = React.useState({});
  const [rowToDeactivate, setRowToDeactivate] = React.useState({});
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] =
    React.useState(false);
  const [buttonEl, setButtonEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const { data } = useSWR(`api/${tab}`, fetcher);
  const [persons, setPersons] = React.useState(data);

  React.useEffect(() => {
    setPersons(data);
  }, [data]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
    setDetailPanelOpen(new Map());
  };

  const handleAddButtonClick = () => {
    setIsUpdate(false);
    setRowToEdit({});
    setIsUpdateCreateDialogOpen(true);
  };

  // TODO handle async issue
  const handleEditClick = (row) => {
    setIsUpdate(true);
    setRowToEdit(row);
    setIsUpdateCreateDialogOpen(true);
  };

  const handleDeactivateClick = (row) => {
    setRowToDeactivate(row);
    setIsDeactivateDialogOpen(true);
  };

  const handleCloseUpdateCreateDialog = () => {
    setIsUpdateCreateDialogOpen(false);
    setRowToEdit({});
  };

  const handleOpenDeactivateDialog = () => {
    setIsDeactivateDialogOpen(true);
  };

  const handleCloseDeactivateDialog = () => {
    setIsDeactivateDialogOpen(false);
    setRowToDeactivate({});
  };

  const onRowClick = (data: { id: string }) => {
    if (data.id.toString().startsWith("detail-panel")) {
      return;
    }

    const newDetailPanel = {
      ...data,
      id: `detail-panel-${data.id}`,
    };

    setDetailPanelOpen((prevState) => ({
      ...prevState,
      [data.id]: !prevState[data.id], // Toggle the state for the clicked row
    }));

    function insertDetailPanelByRowId(
      array: any[],
      rowId: string,
      detailPanel: any
    ): any[] {
      const newArray: any[] = [];
      for (const item of array) {
        newArray.push(item);
        if (item.id === rowId) {
          newArray.push(detailPanel);
        }
      }
      return newArray;
    }

    function removeDetailPanelByRowId(array: any[], rowId: string): any[] {
      const newArray: any[] = [];
      for (let i = 0; i < array.length; i++) {
        newArray.push(array[i]);
        if (array[i].id === rowId) {
          i++;
        }
      }
      return newArray;
    }

    const isPanelOpen = detailPanelOpen.get(data.id);
    if (isPanelOpen) {
      setDetailPanelOpen((map) => new Map(detailPanelOpen.set(data.id, false)));
      const result = removeDetailPanelByRowId(persons, data.id);
      setPersons(result);
    } else {
      setDetailPanelOpen((map) => new Map(detailPanelOpen.set(data.id, true)));
      const result = insertDetailPanelByRowId(persons, data.id, newDetailPanel);
      setPersons(result);
    }
  };

  const getTogglableColumns = (columns: GridColDef[]) => {
    return columns
      .filter(
        (column) =>
          column.field !== "id" &&
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
    setVisibleColumnCount(count);
    setColumnVisibilityModel(model);
  };

  // TODO update this
  const handleCreateNewPerson = async (data) => {
    const response = await fetch(`/api/${tab}/[assignment_id]`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setIsUpdateCreateDialogOpen(false);
    } else {
      console.error("Error creating new user:", response.statusText);
    }
  };

  const handleDeactivatePerson = async (data) => {
    const response = await fetch(`/api/${tab}/${data.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setIsUpdateCreateDialogOpen(false);
    } else {
      console.error("Error deactivating user:", response.statusText);
    }
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
        icon={<CheckIcon />}
        label="Active"
        size="small"
        sx={{ height: "20px" }}
        style={{ backgroundColor: "#d6f8e7", color: "#507b67" }}
      />
    ) : (
      <Chip
        icon={<CloseIcon />}
        label="Inactive"
        size="small"
        sx={{ height: "20px" }}
        style={{ backgroundColor: "#f9e8e8", color: "#9f3d49" }}
      />
    );
  };

  const columns: GridColDef[] = [
    {
      field: "detailPanel",
      headerName: "",
      disableColumnMenu: true,
      sortable: false,
      hideSortIcons: true,
      width: 1,
      colSpan: ({ row }) => {
        if (row.id.toString().startsWith("detail-panel")) {
          return visibleColumnCount;
        }
        return undefined;
      },
      renderCell: (params) => {
        if (params.row.id.toString().startsWith("detail-panel")) {
          if (tab === "students") {
            return <StudentDetailPanel data={params.row} />;
          } else if (tab === "parents") {
            return <DetailPanel data={params.row} />;
          } else {
            return <StaffDetailPanel data={params.row} />;
          }
        } else {
          return detailPanelOpen.get(params.row.id) ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          );
        }
      },
    },

    {
      field: "id",
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
    {
      field: "action",
      headerName: "Action",
      minWidth: 70,
      maxWidth: 70,
      flex: 1,
      renderCell: (params) => (
        <RenderMenu
          onEditClick={() => handleEditClick(params.row)}
          onDeleteClick={() => handleDeactivateClick(params.row)}
        />
      ),
    },
  ];

  if (!persons) return <CircularProgress />;

  return (
    <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="users tabs">
          {personTypes.map((key) => (
            <Tab key={key} value={key} label={key} {...a11yProps(key)} />
          ))}
        </Tabs>
      </Box>
      {persons && (
        <DataGrid
          autoHeight={true}
          sx={{
            width: "100%",
            overflow: "hidden",
            backgroundColor: "#fff",
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
          }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => {
            onColumnVisibilityChange(newModel);
          }}
          rows={persons}
          columns={columns}
          getRowHeight={({ id }: GridRowHeightParams) => {
            if (id.toString().startsWith("detail-panel")) {
              return "auto";
            }
            return null;
          }}
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
      )}
      <UpdateCreateStudentDialog
        isUpdate={isUpdate}
        existingData={rowToEdit as Student}
        open={isUpdateCreateDialogOpen}
        onClose={handleCloseUpdateCreateDialog}
        onSubmit={handleCreateNewPerson}
      />
      <DeactivateStudentDialog
        open={isDeactivateDialogOpen}
        onClose={handleCloseDeactivateDialog}
        onSubmit={handleDeactivatePerson}
      />
    </Box>
  );
}
