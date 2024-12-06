
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './context/AuthProvider';

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, fullyRegistered } = useAuth();
  const router = useRouter();

  const pathname = usePathname();

  const isAuthRoute = pathname === '/auth';
  const isProfileRoute = pathname === '/profile' || pathname === '/people';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth'); // Preusmjerava na login page ako korisnik nije prijavljen
      window.location.reload();
    }
  }, [isAuthenticated, router, isAuthRoute, isProfileRoute, fullyRegistered]);

  return (
    <>
      {isAuthenticated === !isAuthRoute && children}
    </>
    
  ) // Rendera children ako je prijavljen, a nije na login ili register pageu
};

export default AuthRedirect;
