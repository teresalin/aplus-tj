import { GridColDef } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import ClassIcon from "@mui/icons-material/Class";
import EventIcon from "@mui/icons-material/Event";
import Grid from "@mui/material/Grid";
import HailIcon from "@mui/icons-material/Hail";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import { SessionDetail } from "@/modules/sessions";
import fetcher from "@/lib/api/fetcher";

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
    field: "englishName",
    headerName: "英文名",
    minWidth: 100,
    flex: 1,
  },
  // {
  //   field: "gender",
  //   headerName: "性別",
  //   minWidth: 100,
  //   flex: 1,
  // },
  {
    field: "currentSchool",
    headerName: "現讀學校",
    minWidth: 300,
    flex: 1,
  },
];

interface Props {
  sessionId: string;
}

export default function SessionComponent({ sessionId }: Props) {
  const { data } = useSWR(
    sessionID ? `/api/sessions/${sessionID}` : null,
    fetcher,
  );
  const details = (data as SessionDetail) || null;

  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <Box p={3} sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
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
                      <Typography>test</Typography>
                      <Typography variant="caption">test</Typography>
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
                          ? details.present.length
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
                        {details ? details.absent.length : "Info not available"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item sm={12} md={12} lg={6}>
        <Box p={3} sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Attended Students
          </Typography>
          <Stack direction="row" spacing={1}>
            {details &&
              details.present.map((student) => (
                <Chip label={student.name} onClick={handleClick} />
              ))}
          </Stack>
        </Box>
      </Grid>
      <Grid item sm={12} md={12} lg={6}>
        <Box p={3} sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Absent Students
          </Typography>
          <Stack direction="row" spacing={1}>
            {details &&
              details.absent.map((student) => (
                <Chip
                  label={student.name}
                  variant="outlined"
                  onClick={handleClick}
                />
              ))}
          </Stack>
        </Box>
      </Grid>
      {/* <Grid
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
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              disableColumnMenu
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true },
                  csvOptions: { disableToolbarButton: true },
                },
              }}
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
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              disableColumnMenu
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: { disableToolbarButton: true },
                  csvOptions: { disableToolbarButton: true },
                },
              }}
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
      </Grid> */}
    </Grid>
  );
}
