import * as React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useSWR from "swr";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import fetcher from "../../utils/fetcher";
import { generateColumns } from "../../utils/data-grid/generateColumns";
import CustomToolBar from "../../src/components/data-grid/CustomToolBar";
import IconButton from "@mui/material/IconButton";
import NewPersonDialog from "../../src/components/person/NewPersonDialog";

function a11yProps(key: string) {
  return {
    id: `simple-tab-${key}`,
    "aria-controls": `simple-tabpanel-${key}`,
  };
}

const personTypes = ["persons", "staffs", "parents", "students"];

export default function CustomFilterPanelPosition() {
  const [value, setValue] = React.useState("persons");
  const [isNewDialogOpen, setIsNewDialogOpen] = React.useState(false);
  const { data } = useSWR(`api/${value}`, fetcher);
  const persons = data as [];
  const [buttonEl, setButtonEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleOpenNewDialog = () => {
    setIsNewDialogOpen(true);
  };

  const handleCloseNewDialog = () => {
    setIsNewDialogOpen(false);
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

  if (!persons) return <CircularProgress />;

  return (
    <div style={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="users tabs">
          {personTypes.map((key) => (
            <Tab key={key} value={key} label={key} {...a11yProps(key)} />
          ))}
        </Tabs>
      </Box>
      {persons && (
        <DataGrid
          sx={{ backgroundColor: "#fff" }}
          localeText={{
            toolbarColumns: "",
            toolbarFilters: "",
            toolbarDensity: "",
            toolbarExport: "",
          }}
          rows={persons}
          columns={generateColumns(persons)}
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
        personType={value}
        open={isNewDialogOpen}
        onClose={handleCloseNewDialog}
        onSubmit={handleCreateNewPerson}
      />
    </div>
  );
}
