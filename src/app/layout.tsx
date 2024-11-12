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
import { LayoutTransition } from "./components/layout-transitions";
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
  const [hasAnimated, setHasAnimated] = useState(false); 
  const router = usePathname();

  useEffect(() => {
    setTimeout(() => {
      setHasAnimated(true); // Make the content visible after animation
    }, 1000);  // Set this delay based on your animation duration
  }, []);

  return (
    <html lang="en">
      <body>
      <AnimatePresence initial={false} mode="wait">
      {hasAnimated ? (
        <motion.div key={router}>
          <AuthProvider>
            <Theme>
              <ClientLayout>{children}</ClientLayout>
            </Theme>
          </AuthProvider>  
        </motion.div>
      ) : (
        // Empty motion.div to handle slide-in/out animations, content will remain hidden
        <motion.div
          className="slide-in"  // Your slide-in animation styles
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        ></motion.div>
      )}

      {/* Slide-out animation */}
      <motion.div
        className="slide-out"  // Your slide-out animation styles
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      ></motion.div>
    </AnimatePresence>
      </body>
    </html>
  );
}
