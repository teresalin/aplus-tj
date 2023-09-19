import * as React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useSWR from "swr";
import {
  DataGrid,
  GridColDef,
  GridRowHeightParams,
  GridRowSelectionModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";

import fetcher from "../../utils/fetcher";
import { Person } from "../api/persons";
import CustomToolBar from "../../src/components/dataGrid/CustomToolBar";
import DetailPanel from "../../src/components/dataGrid/DetailPanel";
import NewPersonDialog from "../../src/components/person/NewPersonDialog";
import RenderMenu from "../../src/components/dataGrid/RenderMenu";

function a11yProps(key: string) {
  return {
    id: `simple-tab-${key}`,
    "aria-controls": `simple-tabpanel-${key}`,
  };
}

const personTypes = ["persons", "staffs", "parents", "students"];

export default function CustomFilterPanelPosition() {
  const [tab, setTab] = React.useState("persons");
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const [selectedRowData, setSelectedRowData] = React.useState<
    Person | undefined
  >({} as Person);
  const [isNewDialogOpen, setIsNewDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [buttonEl, setButtonEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const { data } = useSWR(`api/${tab}`, fetcher);
  // const persons = data as [];
  const [persons, setPersons] = React.useState(data);

  React.useEffect(() => {
    setPersons(data);
  }, [data]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
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

  function addAfter(array, index, newItem) {
    return [...array.slice(0, index + 1), newItem, ...array.slice(index + 1)];
  }

  function removeAfter(array, index) {
    return [...array.slice(0, index + 1), ...array.slice(index + 2)];
  }

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) =>
      persons.find((row) => row.id === id)
    );
    // get selected row index
    const index = persons.findIndex((x) => x.id === selectedRowsData[0].id);
    const detailPanel = persons[index + 1];
    console.log("index: ", index);

    const hasDetailPanel = detailPanel.id === "";
    console.log("hasDetailPanel: ", hasDetailPanel);
    if (hasDetailPanel) {
      let removed = removeAfter(persons, index);
      setPersons(removed);
    } else {
      const test = {
        id: "",
        name: "",
        gender: "",
        phone: "",
        email: "",
        dateOfBirth: "",
        notes: "",
        active: "",
        created: "",
      } as unknown as Person;
      const newArr = addAfter(persons, index, test);
      setPersons(newArr);
    }
    setSelectedRowData(selectedRowsData[0]);
  };

  // TODO pass this into DataGrid
  const getTogglableColumns = (columns: GridColDef[]) => {
    // hide the column with field `id` from list of togglable columns
    return columns
      .filter((column) => column.field !== "id")
      .map((column) => column.field);
  };

  // TODO update this
  const handleCreateNewPerson = async (data) => {
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
      field: "details",
      headerName: "details",
      minWidth: 50,
      flex: 1,
      colSpan: ({ row }) => {
        if (row.id === "") {
          return 8;
        }
        return undefined;
      },
      valueGetter: ({ value, row }) => {
        if (row.id === "") {
          return "testingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtesting";
        }
        return value;
      },
      renderCell: (params) => {
        if (params.row.id === "") {
          return <DetailPanel data={selectedRowData} />;
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
      minWidth: 100,
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
      minWidth: 100,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      minWidth: 50,
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
      minWidth: 50,
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
      renderCell: () => (
        <RenderMenu
          onEditClick={handleOpenEditDialog}
          onDeleteClick={handleOpenDeleteDialog}
        />
      ),
    },
  ];

  if (!persons) return <CircularProgress />;

  return (
    <div style={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={handleChange} aria-label="users tabs">
          {personTypes.map((key) => (
            <Tab key={key} value={key} label={key} {...a11yProps(key)} />
          ))}
        </Tabs>
      </Box>
      {persons && (
        <DataGrid
          sx={{ backgroundColor: "#fff" }}
          rows={persons}
          columns={columns}
          getRowHeight={({ id, densityFactor }: GridRowHeightParams) => {
            if (id === "") {
              return "auto";
            }
            return null;
          }}
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
      )}
      <NewPersonDialog
        personType={tab}
        open={isNewDialogOpen}
        onClose={handleCloseNewDialog}
        onSubmit={handleCreateNewPerson}
      />
    </div>
  );
}
