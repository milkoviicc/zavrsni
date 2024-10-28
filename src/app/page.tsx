'use client'

import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthProvider";
import { useRouter } from "next/navigation";


export default function Home() {

  const {user, logout, isAuthenticated } = useAuth();
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if(!isAuthenticated) {
      setShowMessage(true);

      const timer = setTimeout(() => {
        router.push('/login');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router])

  if(!isAuthenticated && showMessage) {
    return (
      <div className="h-full flex items-center justify-center">
        <h1>You have to login to view the page content. Redirecting to Login page.</h1>  
      </div>
      )
  }
  

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <button onClick={logout}></button>
    </div>
  );
}
