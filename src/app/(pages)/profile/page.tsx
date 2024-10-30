'use client'
import React from 'react'
import { useEffect} from "react";
import { useAuth } from "@/app/context/AuthProvider";
import { useRouter } from "next/navigation";

const Profile = () => {
  const {isAuthenticated } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if(!isAuthenticated) {
        router.push('/login');
    }
  }, [isAuthenticated, router])

  return (
    <div className='h-full'>
      {isAuthenticated
      ?
      <div>
        <h1>bok</h1>
      </div>
      :  
      null
      }
    </div>
    
  )
}

export default Profile