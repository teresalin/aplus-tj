// src/components/SettingsLayout.tsx
import { ReactNode } from "react";
import { useRouter } from "next/router";
import { Box, Tabs, Tab } from "@mui/material";

interface TabItem {
  label: string;
  href: string;
}

const tabList: TabItem[] = [
  { label: "General", href: "/settings/general" },
  { label: "Grades", href: "/settings/grades" },
  { label: "Profile", href: "/settings/profile" },
  // add more tabs here as you spin them up
];

export function SettingsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  // find the index of the current tab based on URL
  const currentPath = router.asPath.split("/")[2] || "general"; // e.g. "general" or "grades"
  const currentTab = tabList.findIndex((t) =>
    t.href.endsWith(`/${currentPath}`),
  );

  const handleChange = (_: React.SyntheticEvent, newIndex: number) => {
    router.push(tabList[newIndex].href);
  };

  return (
    <Box>
      <Tabs
        value={currentTab < 0 ? 0 : currentTab}
        onChange={handleChange}
        aria-label="Settings tabs"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {tabList.map((t) => (
          <Tab key={t.href} label={t.label} />
        ))}
      </Tabs>
      <Box mt={3}>{children}</Box>
    </Box>
  );
}
