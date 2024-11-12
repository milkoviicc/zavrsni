'use client';
import { motion, AnimatePresence } from "framer-motion";
import "../../globals.css";
import { usePathname } from "next/navigation";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = usePathname();
  
  return (
    <div className="min-h-screen">
        {children}
    </div>
  );
}