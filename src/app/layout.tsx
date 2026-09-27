import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@/styles/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import AppProviders from "@/components/providers/AppProviders";
import AppShell from "@/components/layout/AppShell";
import { getSession } from "@/lib/authz";

export const metadata: Metadata = {
  title: { default: "A Plus", template: "%s | A Plus" },
  description: "Cram school management for classes, students, and staff.",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <AppProviders>
          <AppShell user={session?.user ?? null}>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
