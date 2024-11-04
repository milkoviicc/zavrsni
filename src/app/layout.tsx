/* eslint-disable @typescript-eslint/no-unused-vars */
import "./globals.css";
import { AuthProvider, useAuth } from "./context/AuthProvider";
import ClientLayout from './ClientLayout'
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Theme }  from '@radix-ui/themes';

export const metadata: Metadata = {
  title: "Društvena mreža",
  description: "Društvena mreža u nextjs-u.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
      <html lang="en">
        <body>
          <AuthProvider>
            <Theme>
              <ClientLayout>{children}</ClientLayout>
            </Theme>
          </AuthProvider>
        </body>
      </html>

  );
}
