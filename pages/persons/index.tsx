import * as React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
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

const personTypes = ["students", "parents", "staffs"];

export default function PersonGrid() {
  const [tab, setTab] = React.useState("students");
  const [gridKey, setGridKey] = React.useState(0);
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const [selectedRowIndex, setSelectedRowIndex] = React.useState();
  const [selectedRowData, setSelectedRowData] = React.useState<Person>(
    {} as Person
  );
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
  const [isNewDialogOpen, setIsNewDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [buttonEl, setButtonEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const { data } = useSWR(`api/${tab}`, fetcher);
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

  const onRowClick = (data) => {
    const newDetailPanel = {
      id: "detailPanel",
    } as unknown;

    function removeObjectById(array, idToRemove) {
      return array.filter((item) => item.id !== idToRemove);
    }

    function insertDetailPanelById(
      array: any[],
      idToInsertAfter: string,
      newObject: any
    ): any[] {
      const newArray: any[] = [];
      for (const item of array) {
        newArray.push(item);
        if (item.id === idToInsertAfter) {
          newArray.push(newObject);
        }
      }
      return newArray;
    }

    const hasDetailPanel = persons.some(
      (person) => person.id === "detailPanel"
    );

    const isFirstClick = Object.keys(selectedRowData).length === 0;
    const isSameRowClick =
      selectedRowData !== undefined && selectedRowData.id === data.id;
    const isNewRowClick =
      selectedRowData !== undefined && selectedRowData.id !== data.id;

    if (isFirstClick) {
      const newArr = insertDetailPanelById(persons, data.id, newDetailPanel);
      setPersons(newArr);
      setSelectedRowData(data);
    } else if (isNewRowClick) {
      if (hasDetailPanel) {
        // remove existing detail panel
        const result = removeObjectById(persons, "detailPanel");
        // add detail panel after new row
        const newArr = insertDetailPanelById(result, data.id, newDetailPanel);
        setPersons(newArr);
        setSelectedRowData(data);
      } else {
        const newArr = insertDetailPanelById(persons, data.id, newDetailPanel);
        setPersons(newArr);
        setSelectedRowData(data);
      }
    } else if (isSameRowClick) {
      if (hasDetailPanel) {
        const result = removeObjectById(persons, "detailPanel");
        setPersons(result);
      } else {
        const newArr = insertDetailPanelById(persons, data.id, newDetailPanel);
        setPersons(newArr);
      }
    } else {
      // do nothing
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
      console.error("Error updating user data:", response.statusText);
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
      colSpan: ({ row }) => {
        if (row.id === "detailPanel") {
          return visibleColumnCount;
        }
        return undefined;
      },
      width: 1,
      renderCell: (params) => {
        if (params.row.id === "detailPanel") {
          return <DetailPanel data={selectedRowData} />;
        } else {
          return <KeyboardArrowDownIcon />;
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
    <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={handleChange} aria-label="users tabs">
          {personTypes.map((key) => (
            <Tab key={key} value={key} label={key} {...a11yProps(key)} />
          ))}
        </Tabs>
      </Box>
      {persons && (
        <DataGrid
          autoHeight={true}
          key={gridKey}
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
            if (id === "detailPanel") {
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
              children: <AddIconButton onClick={handleOpenNewDialog} />,
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
      <NewPersonDialog
        personType={tab}
        open={isNewDialogOpen}
        onClose={handleCloseNewDialog}
        onSubmit={handleCreateNewPerson}
      />
    </Box>
  );
}
