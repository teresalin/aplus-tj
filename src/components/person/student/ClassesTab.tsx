import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import fetcher from "../../../../utils/fetcher";
import Grid from "@mui/material/Grid";
import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

const ClassesTab = ({ id }) => {
  const theme = useTheme();
  const { data } = useSWR(`/api/persons/students/${id}/classes`, fetcher);
  const classes = data || [];

  if (!classes) {
    return <CircularProgress />;
  }

  const renderChip = (params) => {
    return params ? (
      <Chip
        label="Active"
        size="small"
        sx={{ height: "20px", paddingX: 1 }}
        style={{ backgroundColor: "#bef0cc", color: "#507b67" }}
      />
    ) : (
      <Chip
        label="Inactive"
        size="small"
        sx={{ height: "20px" }}
        style={{ backgroundColor: "#f9e8e8", color: "#9f3d49" }}
      />
    );
  };

  return (
    <>
      {classes.map((classData) => (
        <>
          <Stack direction="row" alignItems="center">
            <Typography variant="h6" gutterBottom mr={1}>
              {classData.name}
            </Typography>
            <Box sx={{ pb: "7px" }}>{renderChip(classData.active)}</Box>
          </Stack>
          <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={3}>
              <Grid item sm={12} md={4}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                >
                  Started On
                </Typography>
                <Typography variant="body2">{classData.startDate}</Typography>
              </Grid>
              <Grid item sm={12} md={4}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                >
                  Ended On
                </Typography>
                <Typography variant="body2">{classData.endDate}</Typography>
              </Grid>
              <Grid item sm={12} md={4}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                >
                  Recent Attendance
                </Typography>
                {classData.sessionDates.map((date) => (
                  <Typography variant="body2">{date}</Typography>
                ))}
              </Grid>
            </Grid>
          </Card>
        </>
      ))}
    </>
  );
};

export default ClassesTab;
