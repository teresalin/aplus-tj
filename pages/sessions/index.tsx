import * as React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Session } from "../api/sessions";
import { styled } from "@mui/material/styles";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import dayjs from "dayjs";
import fetcher from "../../utils/fetcher";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

function a11yProps(key: string) {
  return {
    id: `simple-tab-${key}`,
    "aria-controls": `simple-tabpanel-${key}`,
  };
}

const StyledCard = styled(Card)(() => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#ecf5fc",
  },
  marginTop: "1em",
  marginBottom: "1em",
}));

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

const sessionTypes = ["all", "upcoming", "past"];

export default function CustomFilterPanelPosition() {
  const { data } = useSWR("api/sessions", fetcher);
  const [selectedTab, setSelectedTab] = React.useState("all");
  const [sessions, setSessions] = React.useState(data || []);

  React.useEffect(() => {
    setSessions(data);
  }, [data]);

  React.useEffect(() => {
    fetch(`/api/sessions?tab=${selectedTab}`)
      .then((response) => response.json())
      .then((data) => setSessions(data));
  }, [selectedTab]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <Box style={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="sessions tabs"
        >
          {sessionTypes.map((key) => (
            <Tab key={key} value={key} label={key} {...a11yProps(key)} />
          ))}
        </Tabs>
      </Box>
      <Box>
        {sessions &&
          sessions.map((row: Session) => (
            <StyledLink href={`sessions/${row.id}`} key={row.id}>
              <StyledCard key={row.id}>
                <StyledCardContent>
                  <Grid
                    container
                    spacing={2}
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
                    <Grid container item xs="auto" justifyContent="flex-end">
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          paddingX: 1.5,
                        }}
                        xs="auto"
                        alignItems="center"
                      >
                        <Tooltip title="Start time">
                          <AccessTimeIcon sx={{ marginRight: "0.2em" }} />
                        </Tooltip>
                        <TimePicker
                          readOnly
                          value={dayjs(row.startTime, "HH:mm:ss")}
                          sx={{
                            width: "6em",
                            "& .MuiInput-input": {
                              padding: 0,
                            },
                            "& .MuiInput-root:before": {
                              borderBottom: "none",
                            },
                            "&& .MuiInput-root:hover::before": {
                              borderBottom: "none",
                            },
                          }}
                          slotProps={{
                            textField: { size: "small", variant: "standard" },
                          }}
                          disableOpenPicker
                        />
                      </Grid>
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          paddingX: 1.5,
                        }}
                        xs="auto"
                        alignItems="center"
                      >
                        <Tooltip title="End time">
                          <AccessTimeFilledIcon sx={{ marginRight: "0.2em" }} />
                        </Tooltip>
                        <TimePicker
                          readOnly
                          value={dayjs(row.endTime, "HH:mm:ss")}
                          sx={{
                            width: "6em",
                            "& .MuiInput-input": {
                              padding: 0,
                            },
                            "& .MuiInput-root:before": {
                              borderBottom: "none",
                            },
                            "&& .MuiInput-root:hover::before": {
                              borderBottom: "none",
                            },
                          }}
                          slotProps={{
                            textField: { size: "small", variant: "standard" },
                          }}
                          disableOpenPicker
                        />
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
