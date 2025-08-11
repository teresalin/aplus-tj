import useSWR, { mutate } from "swr";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import Alert, { AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CakeIcon from "@mui/icons-material/Cake";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Paper from "@mui/material/Paper";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import utc from "dayjs/plugin/utc";

import { formatDate } from "../../../../../../utils/formatDate";
import fetcher from "../../../../../../utils/fetcher";
import {
  Staff,
  StaffLayout,
  UpdateStaffDialog,
  UpdateStaffDTO,
} from "../../../../../modules/persons/staffs";

dayjs.extend(utc);

export default function DetailsTab() {
  const theme = useTheme();
  const staffId = useRouter().query.staffId;

  const [isUpdateStaffDialogOpen, setIsUpdateStaffDialogOpen] =
    React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    React.useState<AlertColor>("error");

  const { data, isLoading, error } = useSWR<Staff>(
    staffId ? `/api/persons/staffs/${staffId}` : null,
    fetcher,
  );
  const staff = data || null;

  const handleEditClick = () => {
    setIsUpdateStaffDialogOpen(true);
  };

  const handleCloseUpdateStaffDialog = () => {
    setIsUpdateStaffDialogOpen(false);
  };

  const handleUpdateStaff = async (data: UpdateStaffDTO) => {
    const normalizedEmail = data.email?.trim().toLowerCase();

    const normalizedData = {
      ...data,
      email: normalizedEmail,
    };

    const response = await fetch(`/api/persons/staffs/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalizedData),
    });

    const responseData = await response.json();
    if (response.ok) {
      handleCloseUpdateStaffDialog();
      mutate(`/api/persons/staffs/${staffId}`);
      setSnackbarMessage("Staff updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      console.error("Error updating student:", responseData);
      setSnackbarMessage(responseData.error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
      <StaffLayout currentTab="details">
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

        {/* Display LinearProgress inside the layout if still loading */}
        {isLoading && <LinearProgress />}

        {staff && (
          <>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Grid container direction="row" spacing={3}>
                <Grid item>
                  <Box
                    component="img"
                    sx={{
                      height: 80,
                      width: 80,
                      // maxHeight: { xs: 100, md: 180 },
                      // maxWidth: { xs: 100, md: 180 },
                    }}
                    alt="User profile picture"
                    src={`${
                      staff.gender === "Male"
                        ? "/student-boy.png"
                        : staff.gender === "Female"
                          ? "/student-girl.png"
                          : "/student-other.png"
                    }`}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h6">{staff.name}</Typography>
                  <Typography variant="subtitle2">{staff.role.name}</Typography>
                  <Grid container>
                    <Grid item>
                      <Button
                        startIcon={<EmailIcon />}
                        sx={{
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                          "& .MuiButton-startIcon": {
                            "& > *:first-of-type": { fontSize: 15 },
                          },
                          fontSize: 12,
                        }}
                      >
                        {staff.email}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        startIcon={<LocalPhoneIcon />}
                        sx={{
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                          "& .MuiButton-startIcon": {
                            "& > *:first-of-type": { fontSize: 15 },
                          },
                          fontSize: 12,
                        }}
                      >
                        {staff.phone}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        startIcon={<CakeIcon />}
                        sx={{
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                          "& .MuiButton-startIcon": {
                            "& > *:first-of-type": { fontSize: 15 },
                          },
                          fontSize: 12,
                        }}
                      >
                        {formatDate(staff.dateOfBirth)}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <Typography variant="h6" gutterBottom>
              A Plus Enrollment
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={3}>
                <Grid item sm={12} md={4}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                  >
                    Join Date
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(staff.hireDate)}
                  </Typography>
                </Grid>
                <Grid item sm={12} md={4}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                  >
                    Leave Date
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(staff.leaveDate)}
                  </Typography>
                </Grid>
                <Grid item sm={12} md={4}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                  >
                    Status
                  </Typography>
                  <Typography variant="body2">
                    {staff.active ? "Active" : "Inactive"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            <Typography variant="h6" gutterBottom>
              Other
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: theme.palette.primary.main }}
              >
                Notes
              </Typography>
              <Typography variant="body2">{staff.notes || "N/A"}</Typography>
            </Paper>
          </>
        )}
      </StaffLayout>
      <UpdateStaffDialog
        existingStaff={staff}
        open={isUpdateStaffDialogOpen}
        onClose={handleCloseUpdateStaffDialog}
        onSubmit={handleUpdateStaff}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
