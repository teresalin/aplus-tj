import useSWR, { mutate } from "swr";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CakeIcon from "@mui/icons-material/Cake";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import Grid from "@mui/material/Grid";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import React from "react";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";

import { Student } from "../../../../../src/components/persons/students/types";
import UpdateStudentDialog from "../../../../../src/components/persons/students/forms/UpdateStudentDialog";
import StudentsTabs from "../../../../../src/components/persons/students/StudentsTabs";
import fetcher from "../../../../../utils/fetcher";

type DetailsTabProps = {
  student: Student;
};

function formatDate(date: Date): string | null {
  if (date) {
    const isoString = new Date(date).toISOString();
    return isoString.split(/[T ]/i, 1)[0];
  }
  return null;
}

export default function DetailsTab() {
  const theme = useTheme();
  const studentID = useRouter().query.student_id;

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = React.useState(false);
  const { data } = useSWR(
    studentID ? `/api/persons/students/${studentID}` : null,
    fetcher
  );
  const student = data || null;

  const handleEditClick = () => {
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
  };

  const handleUpdateStudent = async (data: Student) => {
    const response = await fetch(`/api/persons/students/${data.studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setIsUpdateDialogOpen(false);
      mutate({ ...data });
    } else {
      console.error("Error updating student:", response.statusText);
    }
  };

  if (!student) {
    return <CircularProgress />;
  }

  return (
    <>
      <StudentsTabs currentTab="details" />
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
      <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
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
            <Typography variant="subtitle2">{student.englishName}</Typography>
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
      </Card>
      <Typography variant="h6" gutterBottom>
        School Information
      </Typography>
      <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={4}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              Current School
            </Typography>
            <Typography variant="body2">{student.currentSchool}</Typography>
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
            <Typography variant="body2">{student.textbookPublisher}</Typography>
          </Grid>
        </Grid>
      </Card>
      <Typography variant="h6" gutterBottom>
        A Plus Enrollment
      </Typography>
      <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
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
      </Card>
      <Typography variant="h6" gutterBottom>
        Other
      </Typography>
      <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: theme.palette.primary.main }}
        >
          Notes
        </Typography>
        <Typography variant="body2">{student.notes || "N/A"}</Typography>
      </Card>
      <UpdateStudentDialog
        student={student}
        open={isUpdateDialogOpen}
        onClose={handleCloseUpdateDialog}
        onSubmit={handleUpdateStudent}
      />
    </>
  );
}
