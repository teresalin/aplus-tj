import { Tabs, Tab } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

// The component allows navigation between different tabs and updates the URL accordingly.
const AssignmentsTabs = ({ currentTab }) => {
  const router = useRouter();

  // Define the available tabs and their corresponding routes.
  const tabConfig = [
    { label: "Students", route: "students" },
    { label: "Parents", route: "parents" },
    { label: "Staffs", route: "staffs" },
  ];

  // Determine the current tab index based on the currentTab prop.
  const currentIndex = tabConfig.findIndex((tab) => tab.route === currentTab);

  const handleTabChange = (event, newIndex) => {
    const selectedTab = tabConfig[newIndex]; // Get the selected tab
    router.push(`/assignments/${selectedTab.route}`); // Update the URL based on the selected tab
  };

  return (
    <Tabs
      value={currentIndex}
      onChange={handleTabChange}
      aria-label="Assignments Tabs"
    >
      {tabConfig.map((tab, index) => (
        <Tab key={index} label={tab.label} />
      ))}
    </Tabs>
  );
};

export default AssignmentsTabs;
