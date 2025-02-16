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
  Student,
  StudentLayout,
  UpdateStudentDialog,
  UpdateStudentDTO,
} from "../../../../../modules/persons/students";

dayjs.extend(utc);

export default function DetailsTab() {
  const theme = useTheme();
  const studentID = useRouter().query.student_id;

  const [isUpdateStudentDialogOpen, setIsUpdateStudentDialogOpen] =
    React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    React.useState<AlertColor>("error");

  const { data, isLoading, error } = useSWR<Student>(
    studentID ? `/api/persons/students/${studentID}` : null,
    fetcher
  );
  const student = data || null;

  const handleEditClick = () => {
    setIsUpdateStudentDialogOpen(true);
  };

  const handleCloseUpdateStudentDialog = () => {
    setIsUpdateStudentDialogOpen(false);
  };

  const handleUpdateStudent = async (data: UpdateStudentDTO) => {
    const normalizedEmail = data.email?.trim().toLowerCase();

    const normalizedData = {
      ...data,
      email: normalizedEmail,
    };

    const response = await fetch(`/api/persons/students/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalizedData),
    });

    const responseData = await response.json();
    if (response.ok) {
      handleCloseUpdateStudentDialog();
      mutate(`/api/persons/students/${studentID}`);
      setSnackbarMessage("Student updated successfully");
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
      <StudentLayout currentTab="details">
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

        {student && (
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
                      student.gender === "Male"
                        ? "/student-boy.png"
                        : student.gender === "Female"
                        ? "/student-girl.png"
                        : "/student-other.png"
                    }`}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h6">{student.name}</Typography>
                  <Typography variant="subtitle2">
                    {student.englishName}
                  </Typography>
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
                        {student.email}
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
                        {student.phone}
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
                        {formatDate(student.dateOfBirth)}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <Typography variant="h6" gutterBottom>
              School Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={3}>
                <Grid item sm={12} md={4}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                  >
                    Current School
                  </Typography>
                  <Typography variant="body2">
                    {student.currentSchool}
                  </Typography>
                </Grid>
                <Grid item sm={12} md={4}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                  >
                    Grade
                  </Typography>
                  <Typography variant="body2">{student.grade.name}</Typography>
                </Grid>
                <Grid item sm={12} md={4}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                  >
                    Textbook Publisher
                  </Typography>
                  <Typography variant="body2">
                    {student.textbookPublisher}
                  </Typography>
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
                    {formatDate(student.joinDate)}
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
                    {formatDate(student.leaveDate)}
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
                    {student.active ? "Active" : "Inactive"}
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
              <Typography variant="body2">{student.notes || "N/A"}</Typography>
            </Paper>
          </>
        )}
      </StudentLayout>
      <UpdateStudentDialog
        existingStudent={student}
        open={isUpdateStudentDialogOpen}
        onClose={handleCloseUpdateStudentDialog}
        onSubmit={handleUpdateStudent}
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
