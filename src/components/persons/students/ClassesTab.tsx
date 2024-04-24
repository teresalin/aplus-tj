import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import fetcher from "../../../../utils/fetcher";

const ClassesTab = ({ id }) => {
  const theme = useTheme();

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = React.useState(false);
  const { data } = useSWR(`/api/persons/students/${id}/classes`, fetcher);
  const classes = data || [];

  const handleEditClick = () => {
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
  };

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

  if (!classes) {
    return <CircularProgress />;
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row-reverse" }} m={1}>
        <Button
          variant="text"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleEditClick}
        >
          Edit
        </Button>
      </Box>
      {classes.map((classData) => (
        <Box key={classData.id}>
          <Stack direction="row" alignItems="center">
            <Typography variant="h6">{classData.name}</Typography>
            <Box sx={{ pb: "7px", ml: "0.5em" }}>
              {renderChip(classData.active)}
            </Box>
          </Stack>
          <Card variant="outlined" sx={{ p: 2, my: 1 }}>
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
                {/* {classData.sessionDates.map((index, date) => (
                  <Typography key={index} variant="body2">
                    {date}
                  </Typography>
                ))} */}
              </Grid>
            </Grid>
          </Card>
        </Box>
      ))}
    </>
  );
};

export default ClassesTab;
