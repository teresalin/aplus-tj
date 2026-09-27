"use client";

import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import ImageIcon from "@mui/icons-material/Image";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import WorkIcon from "@mui/icons-material/Work";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  color: theme.palette.text.secondary,
}));

// Static overview; not yet backed by real data.
export default function DashboardOverview() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid container item spacing={2} xs={12} md lg>
          <Grid item xs={12} lg={8}>
            <Item>
              <Typography variant="h4" gutterBottom>
                Today&apos;s Classes:
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                3rd Grade English
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                4th Grade English
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Item>
              <Typography variant="subtitle1" gutterBottom>
                Students
              </Typography>
              <Typography variant="h6" gutterBottom>
                86
              </Typography>
            </Item>
          </Grid>
        </Grid>
        <Grid container item xs={12} md="auto" lg="auto">
          <Grid item xs={12}>
            <Item>
              <DateCalendar />
              <Divider variant="middle" component="li" />
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="3rd Grade English"
                    secondary="Jan 9, 2024"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="4th Grade English"
                    secondary="Jan 10, 2024"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <BeachAccessIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="5th Grade English"
                    secondary="July 20, 2024"
                  />
                </ListItem>
              </List>
            </Item>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
