'use client';
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);
  
  // Track user state and trigger re-render when it changes
  return (
    <>
      {isAuthenticated ? <Navbar /> : null}
      <main>{children}</main>
      {isAuthenticated ? <Footer /> : null}
    </>
  );
};

export default LayoutContent;
