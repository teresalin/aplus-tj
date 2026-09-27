import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import BackButton from "@/components/BackButton";
import LinkTabs from "@/components/navigation/LinkTabs";
import { isUuid } from "@/lib/ids";

/** Back button and tab navigation shared by a student's detail pages. */
export default function StudentLayout({
  params,
  children,
}: {
  params: { studentId: string };
  children: ReactNode;
}) {
  if (!isUuid(params.studentId)) notFound();

  const base = `/persons/students/${params.studentId}`;
  const tabs = [
    { label: "Details", href: `${base}/details` },
    { label: "Classes", href: `${base}/classes` },
    { label: "Billing", href: `${base}/billing` },
  ];

  return (
    <div>
      <BackButton href="/persons/students" />
      <LinkTabs tabs={tabs} ariaLabel="Students Tabs" />
      {children}
    </div>
  );
}
