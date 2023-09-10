import * as React from "react";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Box from "@mui/material/Box";
import ClassIcon from "@mui/icons-material/Class";
import Divider from "@mui/material/Divider";
import GridViewIcon from "@mui/icons-material/GridView";
import GroupIcon from "@mui/icons-material/Group";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: "inherit",
}));

const Logo = styled("img")(({ theme }) => ({
  maxWidth: 30,
  marginRight: theme.spacing(1),
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&&.Mui-selected": {
    color: "#4741e0",
    "&&& .MuiTypography-root": {
      // fontWeight: "Montserrat, sans-serif",
      color: "#4741e0",
    },
  },
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  "&&.Mui-selected": {
    color: "red",
    "&:hover": {
      backgroundColor: "yellow",
    },
  },
}));

export default function SelectedListItem() {
  const router = useRouter();
  const { pathname } = router;

  const isActive = (path: string) => pathname === path;

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <List component="nav" aria-label="main navigations">
        <StyledLink href="/">
          <ListItemButton selected={isActive("/")}>
            <ListItemIcon>
              <Logo src="/owl.png" alt="A Plus" />
            </ListItemIcon>
            <ListItemText
              sx={{ my: 1 }}
              primary="A Plus"
              primaryTypographyProps={{
                fontSize: 20,
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontWeight: 800,
                color: "#434260",
                letterSpacing: 0,
              }}
            />
          </ListItemButton>
        </StyledLink>
        <StyledLink
          href="/overview"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton selected={isActive("/overview")}>
            <ListItemIcon>
              <GridViewIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </StyledLink>
        <StyledLink href="/classes">
          <ListItemButton selected={isActive("/classes")}>
            <ListItemIcon>
              <ClassIcon />
            </ListItemIcon>
            <ListItemText primary="Classes" />
          </ListItemButton>
        </StyledLink>
        <StyledLink href="/sessions">
          <ListItemButton selected={isActive("/sessions")}>
            <ListItemIcon>
              <AccessTimeFilledIcon />
            </ListItemIcon>
            <ListItemText primary="Sessions" />
          </ListItemButton>
        </StyledLink>
        <StyledLink href="/assignments">
          <ListItemButton selected={isActive("/assignments")}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Assignments" />
          </ListItemButton>
        </StyledLink>
        <StyledLink href="/billing">
          <ListItemButton selected={isActive("/billing")}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Billing" />
          </ListItemButton>
        </StyledLink>
        <StyledLink href="/persons">
          <ListItemButton selected={isActive("/persons")}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemButton>
        </StyledLink>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary navigations">
        <ListItemButton selected={isActive("/settings")}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
    </Box>
  );
}
