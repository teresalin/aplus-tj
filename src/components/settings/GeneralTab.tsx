import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CakeIcon from "@mui/icons-material/Cake";
import EmailIcon from "@mui/icons-material/Email";
import Grid from "@mui/material/Grid";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Paper from "@mui/material/Paper";
import React from "react";
import Typography from "@mui/material/Typography";
import SettingsTabs from "./SettingsTabs";

const GeneralTab = () => {
  const theme = useTheme();

  return (
    <>
      <div>
        <SettingsTabs currentTab="general" />
      </div>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Grid container direction="row" spacing={3}>
          <Grid item>
            <Box
              component="img"
              sx={{
                height: 80,
                width: 80,
              }}
              alt="The house from the offer."
              src="/student-other.png"
            />
          </Grid>
          <Grid item>
            <Typography variant="h6">test</Typography>
            <Typography variant="subtitle2">test</Typography>
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
                  test
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
                  test
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
                  test
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
        <Grid container direction="row" spacing={3}>
          <Grid item xs={4}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              Current School
            </Typography>
            <Typography variant="body2">test</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              Grade
            </Typography>
            <Typography variant="body2">test</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              Textbook Publisher
            </Typography>
            <Typography variant="body2">test</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Typography variant="h6" gutterBottom>
        A Plus Enrollment
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={4}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              Joined On
            </Typography>
            <Typography variant="body2">test</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              Leave Date
            </Typography>
            <Typography variant="body2">test</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            >
              Status
            </Typography>
            <Typography variant="body2">test</Typography>
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
        <Typography variant="body2">test</Typography>
      </Paper>
    </>
  );
};

export default GeneralTab;
