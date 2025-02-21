'use client';

import "./globals.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

import { usePathname, useRouter } from "next/navigation";
import AuthRedirect from "./AuthRedirect";
import { useAuth } from "./context/AuthProvider";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const {isAuthenticated} = useAuth();

  const router = useRouter();

  const pathname = usePathname();

  const isAuthRoute = pathname === '/auth';
  const [loading, setLoading] = useState(true);
  const {fullyRegistered, defaultPicture, ignoreDefaultPic} = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if(!isAuthenticated) {
      router.push('/auth');
      setLoading(false);
    } else if(isAuthenticated && isAuthRoute) {
      router.push('/');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isAuthRoute, router]);

  if(loading) return null;

  
  return (
    <div className="min-h-screen flex flex-col flex-grow">
      {!isAuthRoute && <Navbar />}
      <div className="flex flex-grow overflow-x-hidden overflow-y-hidden relative">
        {children}  
      </div>
      {!isAuthRoute && <Footer />}
    </div>
  );
}
