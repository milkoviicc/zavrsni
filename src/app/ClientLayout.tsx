'use client';

import "./globals.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

import { usePathname } from "next/navigation";
import AuthRedirect from "./AuthRedirect";
import { useAuth } from "./context/AuthProvider";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();

  const isAuthRoute = pathname === '/login' || pathname === '/register';

  const {fullyRegistered} = useAuth();
  return (
    <AuthRedirect>
      <div className="min-h-[100%] flex flex-col">
        {!isAuthRoute && fullyRegistered && <Navbar />}
        <main className="flex flex-1 justify-center items-center">
            {children}  
        </main>
        {!isAuthRoute && fullyRegistered && <Footer />}
      </div>
    </AuthRedirect>
    
  );
}
