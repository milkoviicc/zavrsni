'use client';
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { usePathname } from "next/navigation";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  // Koristi useAuth za pristup korisničkim podacima i statusu registracije
  const { user, ignoreDefaultPic, fullyRegistered } = useAuth();

  // Koristi usePathname za dobijanje trenutne putanje
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [show, setShow] = useState(false);

  // Provjerava da li je korisnik prijavljen i da li je u potpunosti registriran

  useEffect(() => {
    setIsAuthenticated(!!user);

    if(pathname === '/auth') {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [user, pathname, ignoreDefaultPic]);
  
  // Postavlja da li se prikazuje navbar i footer na osnovu korisničkog statusa
  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && fullyRegistered && show ? <Navbar /> : null}
      <main className="flex-grow flex">{children}</main>
      {isAuthenticated && fullyRegistered && show ? <Footer /> : null}
    </div>
  );
};

export default LayoutContent;
