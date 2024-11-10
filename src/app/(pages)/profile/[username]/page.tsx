'use client'
import React from 'react'

import { useAuth } from '@/src/app/context/AuthProvider'

const Profile = () => {

  const {deleteAccount} = useAuth();

  return (
    <div className='h-full'>
      <div className=''>
        <button onClick={deleteAccount}>Delete account</button>
      </div>
    </div>
    
  )
}

export default Profile