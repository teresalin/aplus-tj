import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { SessionDetail } from "../../api/sessions/[session_id]";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import ClassIcon from "@mui/icons-material/Class";
import EventIcon from "@mui/icons-material/Event";
import fetcher from "../../../utils/fetcher";
import Grid from "@mui/material/Grid";
import HailIcon from "@mui/icons-material/Hail";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";

const FlexGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  marginTop: "0.7em",
  marginBottom: "0.7em",
  border: "2px solid",
  borderColor: "#f3f2f0",
  borderRadius: 7,
  padding: 10,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: "24px", // mui defaults CardContent bottom-padding to 24px
}));

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "姓名",
    minWidth: 100,
    flex: 1,
  },
  {
    field: "gender",
    headerName: "性別",
    minWidth: 100,
    flex: 1,
  },
  {
    field: "englishName",
    headerName: "英文名",
    minWidth: 100,
    flex: 1,
  },
  {
    field: "currentSchool",
    headerName: "現讀學校",
    minWidth: 300,
    flex: 1,
  },
];

function not(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function SessionDetails() {
  const sessionID = useRouter().query.session_id;
  const [checked, setChecked] = React.useState<readonly number[]>([]);
  const [left, setLeft] = React.useState<readonly number[]>([0, 1, 2, 3]);
  const [right, setRight] = React.useState<readonly number[]>([4, 5, 6, 7]);
  const { data } = useSWR(
    sessionID ? `/api/sessions/${sessionID}` : null,
    fetcher
  );
  const details = data as SessionDetail | null;

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const customList = (items: readonly number[]) => (
    <Paper sx={{ width: 200, height: 230, overflow: "auto" }}>
      <List dense component="div" role="list">
        {items.map((value: number) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`List item ${value + 1}`} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={12}>
        <StyledCard>
          <StyledCardContent>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
            </Grid>
            <Grid container spacing={{ xs: 1, sm: 2, md: 2, lg: 3 }}>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <Card variant="outlined">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: "8px",
                      paddingLeft: "16px",
                      paddingRight: "8px",
                    }}
                  >
                    <EventIcon sx={{ fontSize: "2.8em" }} />
                    <CardContent>
                      <Box>
                        {/* <Typography variant="subtitle1">Date</Typography> */}
                        <Typography>Aug 22</Typography>
                        <Typography variant="caption">18:00 - 20:00</Typography>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <Card variant="outlined">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: "8px",
                      paddingLeft: "16px",
                      paddingRight: "8px",
                    }}
                  >
                    <ClassIcon sx={{ fontSize: "2.8em" }} />
                    <CardContent>
                      <Box>
                        {/* <Typography variant="subtitle1">Class</Typography> */}
                        <Typography>{details?.className}</Typography>
                        <Typography variant="caption">
                          {details?.teacher}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <Card variant="outlined">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: "8px",
                      paddingLeft: "16px",
                      paddingRight: "8px",
                    }}
                  >
                    <HailIcon sx={{ fontSize: "2.8em" }} />
                    <CardContent>
                      <Box>
                        <Typography variant="subtitle1">Attended</Typography>
                        <Typography variant="h5">
                          {details
                            ? details.attended.length
                            : "Info not available"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={3}>
                <Card variant="outlined">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: "8px",
                      paddingLeft: "16px",
                      paddingRight: "8px",
                    }}
                  >
                    <HelpCenterIcon sx={{ fontSize: "2.8em" }} />
                    <CardContent>
                      <Box>
                        <Typography variant="subtitle1">Absent</Typography>
                        <Typography variant="h5">
                          {details
                            ? details.absent.length
                            : "Info not available"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </StyledCardContent>
        </StyledCard>
      </Grid>
      <Grid item md={6}></Grid>
      <Grid item md={6}></Grid>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        columns={16}
      >
        <Grid item xs={7}>
          {details && (
            <DataGrid
              rows={details.attended}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              autoHeight={true}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
              density="compact"
            />
          )}
        </Grid>
        <Grid item xs="auto">
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllRight}
              disabled={left.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllLeft}
              disabled={right.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={7}>
          {details && (
            <DataGrid
              rows={details.absent}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              autoHeight={true}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
              density="compact"
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
