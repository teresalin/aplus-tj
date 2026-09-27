import type { Metadata } from "next";

import { requirePageAccess } from "@/lib/authz";
import GeneralSettingsForm from "@/modules/settings/components/GeneralSettingsForm";

export const metadata: Metadata = { title: "Settings" };

export default async function GeneralSettingsPage() {
  await requirePageAccess();
  return <GeneralSettingsForm />;
}
