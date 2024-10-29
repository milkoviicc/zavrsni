'use client'
import React from 'react'
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthProvider";
import { useRouter } from "next/navigation";

const Profile = () => {
  const {isAuthenticated } = useAuth();
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

  return (
    <div className='h-full'>
      {isAuthenticated && showMessage
      ?
      <div>
        <h1>bok</h1>
      </div>
      :  
      <div className="h-full flex items-center justify-center">
        <h1>You have to login to view the page content. Redirecting to Login page.</h1>  
      </div> 
      }
    </div>
    
  )
}

export default Profile