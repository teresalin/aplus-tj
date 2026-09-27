import type { ReactNode } from "react";
import Box from "@mui/material/Box";

import LinkTabs from "@/components/navigation/LinkTabs";

const settingsTabs = [
  { label: "General", href: "/settings/general" },
  { label: "Classes", href: "/settings/classes" },
  { label: "Billing", href: "/settings/billing" },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <LinkTabs tabs={settingsTabs} ariaLabel="Settings Tabs" />
      </Box>
      {children}
    </Box>
  );
}
