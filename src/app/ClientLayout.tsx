'use client';

import "./globals.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthProvider";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();

  const isAuthRoute = pathname === '/login' || pathname === '/register';

  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);



  return (
    <div className="min-h-[100%] flex flex-col">
        {!isAuthRoute && <Navbar />}
        <main className="flex flex-1 justify-center items-center">
            {children}  
        </main>
        
        {!isAuthRoute && <Footer />}
    </div>
  );
}
