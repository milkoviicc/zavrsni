
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './context/AuthProvider';

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, fullyRegistered } = useAuth();
  const router = useRouter();

  const pathname = usePathname();

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isProfileRoute = pathname === '/profile' || pathname === '/people';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }

    if(isAuthenticated && isAuthRoute) {
      router.push('/');
    }

    if(isAuthenticated && isProfileRoute && !fullyRegistered) {
      router.push('/');
    }
  }, [isAuthenticated, router, isAuthRoute, isProfileRoute, fullyRegistered]);

  return (
    <>
      {isAuthenticated === !isAuthRoute && children}
    </>
    
  ) // Render children if not authenticated and pathname is '/login' or '/register'
};

export default AuthRedirect;
