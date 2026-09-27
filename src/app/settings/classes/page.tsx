import type { Metadata } from "next";

import { requirePageAccess } from "@/lib/authz";

export const metadata: Metadata = { title: "Class settings" };

export default async function ClassesSettingsPage() {
  await requirePageAccess();
  return (
    <div>
      <h1>Classes Tab Content</h1>
      {/* Add more content and functionality as needed */}
    </div>
  );
}
