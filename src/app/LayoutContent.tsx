'use client';
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { usePathname } from "next/navigation";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, ignoreDefaultPic, fullyRegistered } = useAuth();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user);

    if(pathname === '/auth') {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [user, pathname, ignoreDefaultPic]);
  
  // Track user state and trigger re-render when it changes
  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && fullyRegistered && show ? <Navbar /> : null}
      <main className="flex-grow flex">{children}</main>
      {isAuthenticated && fullyRegistered && show ? <Footer /> : null}
    </div>
  );
};

export default LayoutContent;
