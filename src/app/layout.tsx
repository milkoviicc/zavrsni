/* eslint-disable @typescript-eslint/no-unused-vars */
import "./globals.css";
import { AuthProvider, useAuth } from "./context/AuthProvider";
import ClientLayout from './ClientLayout'
import { Metadata } from "next";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Theme }  from '@radix-ui/themes';

import {motion, AnimatePresence} from 'framer-motion';
import QueryProvider from "./components/QueryProvider";
import { Toaster } from "../components/ui/toaster";
import ClientSideScrollRestorer from "../useScrollRestorer";


export const metadata: Metadata = {
  title: "SNET | Connect with people",
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
      <QueryProvider>
          <AuthProvider>
              <Theme>
                <ClientLayout>
                  <Toaster />
                  {children}
                </ClientLayout>
              </Theme>
            </AuthProvider>
      </QueryProvider>
          
      </body>
      <Suspense>
        <ClientSideScrollRestorer/>
      </Suspense>
    </html>
  );
}
