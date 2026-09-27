"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

export interface LinkTab {
  label: string;
  href: string;
}

interface LinkTabsProps {
  tabs: LinkTab[];
  ariaLabel: string;
  /** Href of the selected tab. Defaults to the tab matching the current path. */
  value?: string;
}

/** MUI tabs rendered as real links, so each tab is its own URL. */
export default function LinkTabs({ tabs, ariaLabel, value }: LinkTabsProps) {
  const pathname = usePathname() ?? "";
  const selected =
    value ?? tabs.find((tab) => pathname.startsWith(tab.href))?.href ?? false;

  return (
    <Tabs value={selected} aria-label={ariaLabel}>
      {tabs.map((tab) => (
        <Tab
          key={tab.href}
          label={tab.label}
          value={tab.href}
          component={Link}
          href={tab.href}
        />
      ))}
    </Tabs>
  );
}
