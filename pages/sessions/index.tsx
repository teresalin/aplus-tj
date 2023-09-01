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
import { styled } from "@mui/material/styles";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

import fetcher from "../../utils/fetcher";
import NewPersonDialog from "../../src/components/NewPersonDialog";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import { Session } from "../api/sessions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { display } from "@mui/system";
import TextField from "@mui/material/TextField";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

function a11yProps(key: string) {
  return {
    id: `simple-tab-${key}`,
    "aria-controls": `simple-tabpanel-${key}`,
  };
}

const FlexGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
}));

const StyledCard = styled(Card)(() => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#ecf5fc",
  },
  marginTop: "1em",
  marginBottom: "1em",
}));

// const StyledCardContent = styled(CardContent)(({ theme }) => ({
//   padding: "24px", // mui defaults CardContent bottom-padding to 24px
// }));

// const StyledCardContent = styled(CardContent)(`
//   padding: 0;
//   &:last-child {
//     padding-bottom: 0;
//   };
//   align-content: 'center';
// `);
const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: 18, // mui defaults CardContent bottom-padding to 24px
  "&:last-child": {
    paddingBottom: 18,
  },
  alignContent: "center",
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: "inherit",
}));

const sessionTypes = ["upcoming", "past", "all"];

export default function CustomFilterPanelPosition() {
  const [value, setValue] = React.useState("upcoming");
  const { data } = useSWR("api/sessions", fetcher);
  const sessions = data || [];

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
    <Box style={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="users tabs">
          {sessionTypes.map((key) => (
            <Tab key={key} value={key} label={key} {...a11yProps(key)} />
          ))}
        </Tabs>
      </Box>
      <Box>
        {sessions.map((row: Session) => (
          <StyledLink href={`sessions/${row.id}`} key={row.id}>
            <StyledCard key={row.id}>
              <StyledCardContent>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid container item xs="auto" alignItems="center">
                    <Button
                      style={{
                        backgroundColor: "#59addd",
                        color: "#fff",
                        marginRight: "0.8em",
                      }}
                    >
                      {dayjs(row.sessionDate).format("MMM DD")}
                    </Button>
                    <Typography>{row.className}</Typography>
                  </Grid>
                  <Grid container item xs="auto" alignItems="center">
                    <Grid item sx={{ paddingX: 1.5 }} xs={12} md={6}>
                      <Tooltip title="Students">
                        <SupportAgentIcon />
                      </Tooltip>
                      <TimePicker
                        readOnly
                        value={dayjs(row.startTime, "HH:mm:ss")}
                        sx={{ width: "50%" }}
                        slotProps={{
                          textField: { size: "small", variant: "standard" },
                        }}
                      />
                    </Grid>
                    <Grid item sx={{ paddingX: 1.5 }} xs={12} md={6}>
                      <Tooltip title="Assignments">
                        <SupportAgentIcon />
                      </Tooltip>
                      <TextField value={dayjs(row.endTime).toString()} />
                    </Grid>
                  </Grid>
                </Grid>
              </StyledCardContent>
            </StyledCard>
          </StyledLink>
        ))}
      </Box>
    </Box>
  );
}
