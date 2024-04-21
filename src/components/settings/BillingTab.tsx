import React from "react";
import SettingsTabs from "./SettingsTabs";

const BillingTab = () => {
  return (
    <>
      <div>
        <SettingsTabs currentTab="billing" />
      </div>
      <div>
        <h1>Billing Tab Content</h1>
        {/* Add more content and functionality as needed */}
      </div>
    </>
  );
};

export default BillingTab;
