import { Tabs, Tab } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

// The component allows navigation between different tabs and updates the URL accordingly.
const SettingsTabs = ({ currentTab }) => {
  const router = useRouter();

  // Define the available tabs and their corresponding routes.
  const tabConfig = [
    { label: "General", route: "general" },
    { label: "Classes", route: "classes" },
    { label: "Billing", route: "billing" },
  ];

  // Determine the current tab index based on the currentTab prop.
  const currentIndex = tabConfig.findIndex((tab) => tab.route === currentTab);

  const handleTabChange = (event, newIndex) => {
    const selectedTab = tabConfig[newIndex]; // Get the selected tab
    router.push(`/settings/${selectedTab.route}`); // Update the URL based on the selected tab
  };

  return (
    <Tabs
      value={currentIndex}
      onChange={handleTabChange}
      aria-label="Settings Tabs"
    >
      {tabConfig.map((tab, index) => (
        <Tab key={index} label={tab.label} />
      ))}
    </Tabs>
  );
};

export default SettingsTabs;
