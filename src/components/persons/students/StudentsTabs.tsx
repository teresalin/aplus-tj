import { Tabs, Tab } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

// The component allows navigation between different tabs and updates the URL accordingly.
const StudentsTabs = ({ currentTab }) => {
  const router = useRouter();
  const { student_id } = router.query;

  // Define the available tabs and their corresponding routes.
  const tabConfig = [
    { label: "Details", route: "details" },
    { label: "Classes", route: "classes" },
    { label: "Billing", route: "billing" },
  ];

  // Determine the current tab index based on the currentTab prop.
  const currentIndex = tabConfig.findIndex((tab) => tab.route === currentTab);

  const handleTabChange = (event, newIndex) => {
    const selectedTab = tabConfig[newIndex]; // Get the selected tab
    // router.push(`/persons/students/[student_id]/${selectedTab.route}`); // Update the URL based on the selected tab
    if (student_id) {
      router.push(`/persons/students/${student_id}/${selectedTab.route}`); // Build the correct URL with student_id
    } else {
      console.error("Missing student_id in router.query"); // Log an error if student_id is missing
    }
  };

  return (
    <Tabs
      value={currentIndex}
      onChange={handleTabChange}
      aria-label="Students Tabs"
    >
      {tabConfig.map((tab, index) => (
        <Tab key={index} label={tab.label} />
      ))}
    </Tabs>
  );
};

export default StudentsTabs;
