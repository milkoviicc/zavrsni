/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import "./globals.css";
import { AuthProvider, useAuth } from "./context/AuthProvider";
import ClientLayout from './ClientLayout'
import { Metadata } from "next";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Theme }  from '@radix-ui/themes';

import {motion, AnimatePresence} from 'framer-motion';
import QueryProvider from "./components/QueryProvider";
import { Toaster } from "../components/ui/toaster";

/*
export const metadata: Metadata = {
  title: "Društvena mreža",
  description: "Društvena mreža u nextjs-u.",
};
*/

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
    </html>
  );
}
