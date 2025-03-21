import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import ClientSideScrollRestorer from "../useScrollRestorer";
import { AuthProvider } from "../context/AuthProvider";
import { Theme }  from '@radix-ui/themes';
import { Toaster } from "sonner";
import QueryProvider from "../components/providers/QueryProvider";

import LayoutContent from "./LayoutContent";

export const metadata: Metadata = {
  title: "SNET | Connect with people",
  description: "SNET | Social network connecting people internationally.",
  authors: [{name: "Marko Milković"}],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <Theme>
              <LayoutContent>{children}</LayoutContent>
              <Toaster />
            </Theme>
          </AuthProvider>
        </QueryProvider>
        <Suspense>
          <ClientSideScrollRestorer/>
        </Suspense>
      </body>
    </html>
  );
}
