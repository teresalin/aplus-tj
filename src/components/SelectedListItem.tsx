import * as React from "react";
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

export default function SelectedListItem() {
  const router = useRouter();
  const { pathname } = router;

  const isActive = (path: string) => pathname === path;

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <List component="nav" aria-label="main navigations">
        <Link href="/overview">
          <ListItemButton selected={isActive("/overview")}>
            <ListItemIcon>
              <GridViewIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </Link>
        <Link href="/classes">
          <ListItemButton selected={isActive("/classes")}>
            <ListItemIcon>
              <ClassIcon />
            </ListItemIcon>
            <ListItemText primary="Classes" />
          </ListItemButton>
        </Link>
        <Link href="/assignments">
          <ListItemButton selected={isActive("/assignments")}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Assignments" />
          </ListItemButton>
        </Link>
        <Link href="/persons">
          <ListItemButton selected={isActive("/persons")}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemButton>
        </Link>
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
