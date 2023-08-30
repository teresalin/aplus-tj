import { GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import CheckIcon from "@mui/icons-material/Check";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";

const renderMenu = (params) => {
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

//0.8125rem
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

export function generateColumns(apiData: any): GridColDef[] {
  let columns: GridColDef[] = [];
  if (apiData.length > 0) {
    const item = apiData[0];
    if ("name" in item) {
      columns.push({
        field: "name",
        headerName: "姓名",
        minWidth: 100,
        flex: 1,
      });
    }
    if ("englishName" in item) {
      columns.push({
        field: "englishName",
        headerName: "英文名",
        minWidth: 100,
        flex: 1,
      });
    }
    if ("gender" in item) {
      columns.push({
        field: "gender",
        headerName: "Gender",
        minWidth: 80,
        flex: 1,
      });
    }
    if ("phone" in item) {
      columns.push({
        field: "phone",
        headerName: "手機",
        minWidth: 120,
        flex: 1,
      });
    }
    if ("email" in item) {
      columns.push({
        field: "email",
        headerName: "Email",
        minWidth: 210,
        flex: 1,
      });
    }
    if ("dateOfBirth" in item) {
      columns.push({
        field: "dateOfBirth",
        headerName: "出生日期",
        minWidth: 130,
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams<Date>) => {
          if (params.value == null) {
            return "";
          }
          return dayjs(params.value).format("YYYY-MM-DD");
        },
      });
    }
    if ("startDate" in item) {
      columns.push({
        field: "startDate",
        headerName: "課程開始日期",
        minWidth: 130,
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams<Date>) => {
          if (params.value == null) {
            return "";
          }
          return dayjs(params.value).format("YYYY-MM-DD");
        },
      });
    }
    if ("currentSchool" in item) {
      columns.push({
        field: "currentSchool",
        headerName: "現讀學校",
        minWidth: 210,
        flex: 1,
      });
    }
    if ("grade" in item) {
      columns.push({
        field: "grade",
        headerName: "年級",
        minWidth: 100,
        flex: 1,
      });
    }
    if ("textbookPublisher" in item) {
      columns.push({
        field: "textbookPublisher",
        headerName: "課本",
        minWidth: 100,
        flex: 1,
      });
    }
    if ("joinDate" in item) {
      columns.push({
        field: "joinDate",
        headerName: "開始日期",
        minWidth: 130,
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams<Date>) => {
          if (params.value == null) {
            return "";
          }
          return dayjs(params.value).format("YYYY-MM-DD");
        },
      });
    }
    if ("leaveDate" in item) {
      columns.push({
        field: "leaveDate",
        headerName: "離開日期",
        minWidth: 130,
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams<Date>) => {
          if (params.value == null) {
            return "";
          }
          return dayjs(params.value).format("YYYY-MM-DD");
        },
      });
    }
    if ("active" in item) {
      columns.push({
        field: "active",
        headerName: "Active",
        minWidth: 100,
        flex: 1,
        renderCell: renderChip,
      });
    }
    columns.push({
      field: "action",
      headerName: "Action",
      minWidth: 70,
      maxWidth: 70,
      flex: 1,
      renderCell: renderMenu,
    });
  }

  return columns;
}
