import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CakeIcon from "@mui/icons-material/Cake";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import EmailIcon from "@mui/icons-material/Email";
import Grid from "@mui/material/Grid";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Paper from "@mui/material/Paper";
import React from "react";
import Typography from "@mui/material/Typography";

import { Student } from "../../../../pages/api/persons/students";

type DetailsTabProps = {
  details: Student;
};

const DetailsTab: React.FC<DetailsTabProps> = ({ details }) => {
  const theme = useTheme();

  if (!details) {
    return <CircularProgress />;
  }

  return (
    <>
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
              alt="The house from the offer."
              src={`${
                details.gender === "Male"
                  ? "/student-boy.png"
                  : details.gender === "Female"
                  ? "/student-girl.png"
                  : "/student-other.png"
              }`}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6">{details.name}</Typography>
            <Typography variant="subtitle2">{details.englishName}</Typography>
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
                  {details.email}
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
                  {details.phone}
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
                  {/* TODO format date correctly */}
                  {new Date(details.dateOfBirth).toDateString()}
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
            <Typography variant="body2">{details.currentSchool}</Typography>
          </Grid>
          <Grid item sm={12} md={4}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              Grade
            </Typography>
            <Typography variant="body2">{details.grade.name}</Typography>
          </Grid>
          <Grid item sm={12} md={4}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              Textbook Publisher
            </Typography>
            <Typography variant="body2">{details.textbookPublisher}</Typography>
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
              {/* TODO format date correctly */}
              {details.joinDate.toString()}
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
              {/* TODO format date correctly */}
              {details.leaveDate?.toString()}
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
              {details.active ? "Active" : "Inactive"}
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
        <Typography variant="body2">{details.notes || "N/A"}</Typography>
      </Card>
    </>
  );
};

export default DetailsTab;
