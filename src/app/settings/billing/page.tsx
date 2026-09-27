import type { Metadata } from "next";

import { requirePageAccess } from "@/lib/authz";

export const metadata: Metadata = { title: "Billing settings" };

export default async function BillingSettingsPage() {
  await requirePageAccess();
  return (
    <div>
      <h1>Billing Tab Content</h1>
      {/* Add more content and functionality as needed */}
    </div>
  );
}
