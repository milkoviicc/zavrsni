
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './context/AuthProvider';

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const pathname = usePathname();

  const isAuthRoute = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Redirect to login if not authenticated
    }

    if(isAuthenticated && isAuthRoute) {
      router.push('/');
    }
  }, [isAuthenticated, router, isAuthRoute]);

  return (
    <>
      {isAuthenticated === !isAuthRoute && children}
    </>
    
  ) // Render children if not authenticated and pathname is '/login' or '/register'
};

export default AuthRedirect;
