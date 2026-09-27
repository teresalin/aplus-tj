import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import type { ReactNode } from "react";

import SideNav, { type SideNavUser } from "./SideNav";

const DRAWER_WIDTH = 250;

/** Permanent side navigation plus the main content area. */
export default function AppShell({
  user,
  children,
}: {
  user: SideNavUser | null;
  children: ReactNode;
}) {
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{ width: DRAWER_WIDTH, flexShrink: 0 }}
        PaperProps={{ sx: { width: DRAWER_WIDTH } }}
      >
        <Box sx={{ overflow: "auto" }}>
          <SideNav user={user} />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, overflowX: "hidden", p: 3 }}>
        <Box sx={{ p: 3, overflowX: "hidden" }}>{children}</Box>
      </Box>
    </Box>
  );
}
