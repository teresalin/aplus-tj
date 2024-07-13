import { useRouter } from "next/router";
import { Tabs, Tab, Box, Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
import React from "react";

// Layout component that includes a back button and tab navigation
const StaffLayout: React.FC<{
  children: React.ReactNode;
  currentTab: string;
}> = ({ children, currentTab }) => {
  const router = useRouter();
  const { staff_id } = router.query;

  // Define tab navigation
  const tabConfig = [
    { label: "Details", route: "details" },
    { label: "Classes", route: "classes" },
  ];

  // Determine current tab index based on the currentTab prop
  const currentIndex = tabConfig.findIndex((tab) => tab.route === currentTab);

  const handleTabChange = (event, newIndex) => {
    if (staff_id) {
      const selectedTab = tabConfig[newIndex];
      router.push(`/persons/staffs/${staff_id}/${selectedTab.route}`);
    } else {
      console.error("Missing staff_id in router.query");
    }
  };

  return (
    <div>
      {/* Back button */}
      <Box mt={-1} mb={2}>
        <Button
          component={Link}
          href="/persons/staffs"
          startIcon={<ArrowBackIosIcon />}
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          Back
        </Button>
      </Box>

      {/* Tab navigation */}
      <Tabs
        value={currentIndex}
        onChange={handleTabChange}
        aria-label="Staffs Tabs"
      >
        {tabConfig.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {/* Page content */}
      {children}
    </div>
  );
};

export default StaffLayout;
