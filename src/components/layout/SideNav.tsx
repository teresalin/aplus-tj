"use client";

import { usePathname } from "next/navigation";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ClassIcon from "@mui/icons-material/Class";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Divider from "@mui/material/Divider";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GridViewIcon from "@mui/icons-material/GridView";
import GroupIcon from "@mui/icons-material/Group";
import Link from "next/link";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

import { useColorMode } from "@/components/providers/AppProviders";
import { DRAWER_WIDTH } from "./constants";

export interface SideNavUser {
  name?: string | null;
  email?: string | null;
}

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  /** Path prefix that marks the item as selected (defaults to `href`). */
  activePrefix?: string;
}

const mainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <GridViewIcon /> },
  { href: "/schedules", label: "Schedule", icon: <CalendarMonthIcon /> },
  { href: "/classes", label: "Classes", icon: <ClassIcon /> },
  { href: "/attendance", label: "Attendance", icon: <EventAvailableIcon /> },
  { href: "/sessions", label: "Sessions", icon: <AccessTimeFilledIcon /> },
  { href: "/assignments", label: "Assignments", icon: <AssignmentIcon /> },
  { href: "/billing", label: "Billing", icon: <AttachMoneyIcon /> },
  {
    href: "/persons/students",
    label: "Users",
    icon: <GroupIcon />,
    activePrefix: "/persons",
  },
];

const secondaryNavItems: NavItem[] = [
  {
    href: "/settings/general",
    label: "Settings",
    icon: <SettingsIcon />,
    activePrefix: "/settings",
  },
];

export default function SideNav({ user }: { user: SideNavUser | null }) {
  const pathname = usePathname() ?? "";
  const { toggleColorMode } = useColorMode();

  const renderItem = (item: NavItem) => (
    <ListItemButton
      key={item.href}
      component={Link}
      href={item.href}
      selected={pathname.startsWith(item.activePrefix ?? item.href)}
    >
      <ListItemIcon>{item.icon}</ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItemButton>
  );

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <Stack direction="column">
        <List component="nav" aria-label="main navigations">
          <ListItemButton component={Link} href="/">
            <ListItemIcon>
              <Box
                component="img"
                src="/owl.png"
                alt=""
                sx={{ maxWidth: 30, mr: 1 }}
              />
            </ListItemIcon>
            <ListItemText
              sx={{ my: 1 }}
              primary="A Plus"
              primaryTypographyProps={{
                fontSize: 20,
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontWeight: 800,
                letterSpacing: 0,
              }}
            />
          </ListItemButton>
          {mainNavItems.map(renderItem)}
        </List>
        <Divider />
        <List component="nav" aria-label="secondary navigations">
          {secondaryNavItems.map(renderItem)}
        </List>
      </Stack>
      <Stack
        direction="column"
        spacing={1}
        sx={{ position: "fixed", bottom: 0, p: "10px", width: DRAWER_WIDTH }}
      >
        {user && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {user.email ?? user.name}
          </Typography>
        )}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<DarkModeIcon />}
            onClick={toggleColorMode}
          >
            Dark Mode
          </Button>
          <Button
            variant="text"
            href={user ? "/api/auth/signout" : "/api/auth/signin"}
          >
            {user ? "Sign out" : "Sign in"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
