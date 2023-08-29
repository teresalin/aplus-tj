import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridApi,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Person } from "../api/persons";
import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import fetcher from "../../utils/fetcher";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Tooltip from "@mui/material/Tooltip";
import useSWR from "swr";

const VISIBLE_FIELDS = ["name", "rating", "country", "dateCreated", "isAdmin"];

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

const renderDetailsButton = (params) => {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [clickedIndex, setClickedIndex] = React.useState(-1);

  const handleClick = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  function parseName(col6: any) {
    return;
  }

  return (
    <div>
      <Tooltip title="Actions">
        <IconButton
          onClick={handleClick}
          aria-label="action"
          size="small"
          aria-controls={openMenu ? "person-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? "true" : undefined}
        >
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="person-menu"
        anchorEl={anchorEl}
        open={openMenu}
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

export default function CustomFilterPanelPosition() {
  // const { data } = useDemoData({
  //   dataSet: "Employee",
  //   visibleFields: VISIBLE_FIELDS,
  //   rowLength: 10,
  // });
  const { data } = useSWR("api/persons", fetcher);
  const persons = data as Person[] | null;
  console.log(data);
  const [clickedIndex, setClickedIndex] = React.useState(-1);

  const [filterButtonEl, setFilterButtonEl] =
    React.useState<HTMLButtonElement | null>(null);

  const datagridSx: SxProps = {
    marginTop: 4,
    borderRadius: 2,
    height: 500,
    //minHeight: 500
  };

  const detailStyles = {
    borderTop: "2px solid",
    borderTopColor: "primary.main",
    pt: 2,
  };

  const columns = [
    {
      field: "id",
      headerName: "Name 1",
      minWidth: 100,
      flex: 1,
      disableClickEventBubbling: true,
      renderCell: (cellValues: GridRenderCellParams) => {
        return (
          <IconButton
            onClick={() => {
              clickedIndex === cellValues.value
                ? setClickedIndex(-1)
                : setClickedIndex(cellValues.value);
            }}
          >
            {cellValues.value === clickedIndex ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        );
      },
    },
    {
      field: "name",
      headerName: "Name 2",
      minWidth: 100,
      flex: 1,
      disableClickEventBubbling: true,
      renderCell: (cellValues: GridRenderCellParams) => {
        return (
          <Box>
            <div>{cellValues.value}</div>
            <Collapse in={cellValues.id === clickedIndex}>
              <Box sx={detailStyles}>Expanded: {cellValues.value}</Box>
            </Collapse>
          </Box>
        );
      },
    },
    {
      field: "gender",
      headerName: "Name 3",
      minWidth: 100,
      flex: 1,
      disableClickEventBubbling: true,
      renderCell: (cellValues: GridRenderCellParams) => {
        return (
          <Box>
            <div>{cellValues.value}</div>
            <Collapse in={cellValues.id === clickedIndex}>
              <Box sx={detailStyles}>Expanded: {cellValues.value}</Box>
            </Collapse>
          </Box>
        );
      },
    },
    {
      field: "phone",
      headerName: "Name 4",
      minWidth: 100,
      flex: 1,
      disableClickEventBubbling: true,
      renderCell: (cellValues: GridRenderCellParams) => {
        return (
          <Box>
            <div>{cellValues.value}</div>
            <Collapse in={cellValues.id === clickedIndex}>
              <Box sx={detailStyles}>Expanded: {cellValues.value}</Box>
            </Collapse>
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: "Name 5",
      minWidth: 100,
      flex: 1,
      // renderCell: renderSummaryDownloadButton,
      disableClickEventBubbling: true,
      renderCell: (cellValues: GridRenderCellParams) => {
        return (
          <Box>
            <div>{cellValues.value}</div>
            <Collapse in={cellValues.id === clickedIndex}>
              <Box sx={detailStyles}>Expanded: {cellValues.value}</Box>
            </Collapse>
          </Box>
        );
      },
    },
    {
      field: "col6",
      headerName: "Name 6",
      maxWidth: 100,
      flex: 1,
      renderCell: renderDetailsButton,
      disableClickEventBubbling: true,
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      {persons && (
        <DataGrid
          rows={persons}
          columns={columns}
          // autoHeight
          // getRowHeight={() => "auto"}
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            panel: {
              anchorEl: filterButtonEl,
            },
            toolbar: {
              setFilterButtonEl,
            },
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      )}
    </div>
  );
}
