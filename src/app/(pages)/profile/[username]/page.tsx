'use client'
import React, { useState } from 'react'

import { useAuth } from '@/src/app/context/AuthProvider'
import { User } from '@/src/app/types/types';
import axios from 'axios';

const Profile = () => {

  const {deleteAccount} = useAuth();

  const user = localStorage.getItem('user');

  const [editable, setEditable] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');


  if(!user) return;

  const userData: User = JSON.parse(user);

  const handleChange = async () => {
    try {
      const res = await axios.put('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/update-profile', {username, firstName, lastName});

      const newUserProfile = res.data;
      const newUserData: User = {id: userData.id, email: userData.email, username: username, token: userData.token, profile: newUserProfile };
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div className='h-full flex justify-center items-center'>
      <div className='flex w-fit h-fit gap-4'>
        <div>
          <p>First name:</p>
          <input type="text" value={userData.profile.firstName} readOnly={!editable} className='px-1' onChange={(e) => setFirstName(e.target.value)}/>
        </div>
        <div>
          <p>Last name:</p>
          <input type="text" value={userData.profile.lastName} readOnly={!editable} className='px-1'/>
        </div>
        <div>
          <p>Username:</p>
          <input type="text" value={userData.username} readOnly={!editable} className='px-1'/>
        </div>
        <button className='bg-blue-500 px-12 rounded-full' onClick={() => setEditable(true)}>Edit</button>
        <button className='bg-blue-500 px-12 rounded-full' onClick={handleChange}>Change</button>
      </div>
    </div>
    
  )
}

export default Profile