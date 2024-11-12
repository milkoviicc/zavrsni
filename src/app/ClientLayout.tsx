'use client';

import "./globals.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

import { usePathname, useRouter } from "next/navigation";
import AuthRedirect from "./AuthRedirect";
import { useAuth } from "./context/AuthProvider";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const {isAuthenticated} = useAuth();

  const router = useRouter();

  const pathname = usePathname();

  const isAuthRoute = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if(!isAuthenticated && !isAuthRoute) {
      router.push('/login');
    }
  })

  const {fullyRegistered} = useAuth();
  return (
        <div className="min-h-screen flex flex-grow">
          {!isAuthRoute && fullyRegistered && <Navbar />}
          <main className="flex-grow">
              {children}  
          </main>
          {!isAuthRoute && fullyRegistered && <Footer />}
        </div>
  );
}
