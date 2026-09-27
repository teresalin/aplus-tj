import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import BackButton from "@/components/BackButton";
import LinkTabs from "@/components/navigation/LinkTabs";
import { isUuid } from "@/lib/ids";

/** Back button and tab navigation shared by a staff member's detail pages. */
export default function StaffLayout({
  params,
  children,
}: {
  params: { staffId: string };
  children: ReactNode;
}) {
  if (!isUuid(params.staffId)) notFound();

  const base = `/persons/staffs/${params.staffId}`;
  const tabs = [
    { label: "Details", href: `${base}/details` },
    { label: "Classes", href: `${base}/classes` },
  ];

  return (
    <div>
      <BackButton href="/persons/staffs" />
      <LinkTabs tabs={tabs} ariaLabel="Staffs Tabs" />
      {children}
    </div>
  );
}
