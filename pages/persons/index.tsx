import { alpha } from "@mui/system";
import { formatDate } from "../../utils/formatDate";
import { Person } from "../api/persons";
import { useState } from "react";
import { visuallyHidden } from "@mui/utils";
import * as React from "react";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import fetcher from "../../utils/fetcher";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NewPersonDialog from "../../src/components/NewPersonDialog";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import SearchBar from "../../src/components/SearchBar";
import Grid from "@mui/material/Grid";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | Date | boolean },
  b: { [key in Key]: number | string | Date | boolean }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Person;
  label: string;
  numeric: boolean;
  sort: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
    sort: true,
  },
  {
    id: "dateOfBirth",
    numeric: false,
    disablePadding: false,
    label: "Date of Birth",
    sort: false,
  },
  {
    id: "phone",
    numeric: false,
    disablePadding: false,
    label: "Phone",
    sort: false,
  },

  {
    id: "joinDate",
    numeric: false,
    disablePadding: false,
    label: "Join Date",
    sort: true,
  },
  {
    id: "active",
    numeric: false,
    disablePadding: false,
    label: "Status",
    sort: true,
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Person
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Person) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sort ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
        <TableCell padding="checkbox"></TableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  personType: string;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { personType } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Users
      </Typography>
      <SearchBar setSearchQuery={undefined} />
      <NewPersonDialog personType={personType} />
    </Toolbar>
  );
}

function a11yProps(key: string) {
  return {
    id: `simple-tab-${key}`,
    "aria-controls": `simple-tabpanel-${key}`,
  };
}

function Row(props: { row: any }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleRowClick = (event: any) => {
    setOpen(!open);
  };

  const handleMenuClick = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <TableRow
        hover
        onClick={handleRowClick}
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">{formatDate(row.dateOfBirth)}</TableCell>
        <TableCell align="left">{row.phone}</TableCell>
        <TableCell align="left">{formatDate(row.joinDate)}</TableCell>
        <TableCell align="left">
          {row.active ? (
            <Chip
              icon={<CheckIcon />}
              label="Active "
              color="success"
              size="small"
            />
          ) : (
            <Chip
              icon={<CloseIcon />}
              label="Inactive"
              color="default"
              size="small"
            />
          )}
        </TableCell>
        <TableCell>
          <Tooltip title="Actions">
            <IconButton
              onClick={handleMenuClick}
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
        </TableCell>
      </TableRow>
      <TableRow style={{ backgroundColor: "rgba(25, 118, 210, 0.08)" }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom component="div">
                    Details
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" component="div">
                    Name: {row.name}
                  </Typography>
                  <Typography variant="body2" component="div">
                    Gender: {row.gender}
                  </Typography>
                  <Typography variant="body2" component="div">
                    Date of Birth: {row.dateOfBirth}
                  </Typography>
                  <Typography variant="body2" component="div">
                    Phone: {row.phone}
                  </Typography>
                  <Typography variant="body2" component="div">
                    Email: {row.email}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" component="div">
                    Join Date: {row.joinDate}
                  </Typography>
                  <Typography variant="body2" component="div">
                    Leave Date: {row.leaveDate}
                  </Typography>
                  <Typography variant="body2" component="div">
                    Notes: {row.notes}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const personTypes = ["persons", "staffs", "parents", "students"];

export default function CollapsibleTable() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Person>("joinDate");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [value, setValue] = React.useState("persons");
  const { data } = useSWR(`api/${value}`, fetcher);
  const rows = data || [];

  // React.useEffect(() => {
  //   if (data) {
  //     setRows(data);
  //   }
  // }, [data]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Person
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  if (!rows) return <div />;

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="users tabs">
          {personTypes.map((key) => (
            <Tab key={key} value={key} label={key} {...a11yProps(key)} />
          ))}
        </Tabs>
      </Box>
      <Paper sx={{ width: "100%" }}>
        <EnhancedTableToolbar personType={value} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* {rows.map((row) => (
                <Row key={row.id} row={row} />
              ))} */}
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                  rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index: any) => {
                  return <Row key={index} row={row} />;
                })}

              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
