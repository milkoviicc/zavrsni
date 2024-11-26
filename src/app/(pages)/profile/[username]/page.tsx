'use client'
import React, { useEffect, useState } from 'react'

import { useAuth } from '@/src/app/context/AuthProvider'
import { User } from '@/src/app/types/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Avatar, Flex } from '@radix-ui/themes';
import Image from 'next/image';

const Profile = () => {
  const {addImage} = useAuth();
  const router = useRouter();
  const [editable, setEditable] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData: User = JSON.parse(user);

        // Initialize the state with user data
        setFirstName(userData.profile.firstName || '');
        setLastName(userData.profile.lastName || '');
        setUsername(userData.profile.username || '');
        setProfilePicture(userData.profile.pictureUrl);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const user = localStorage.getItem('user');

  if(!user) return;

  const userData: User = JSON.parse(user);


  const editProfileDetails = async () => {
    try {
      const res = await axios.put('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/update-profile', {username, firstName, lastName});

      if(res.status === 200) {
        userData.profile.firstName = firstName;
        userData.profile.lastName = lastName;
        userData.profile.username = username;

        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.reload();
      }
    } catch(err) {
      console.error(err);
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
    }
  };


  return (
    <div className='h-full flex flex-col gap-8 justify-center items-center'>
      <div className='flex w-fit h-fit gap-4'>
        <div>
          <p>First name:</p>
          <input type="text" value={firstName} readOnly={!editable} className={`${editable ? 'bg-white' : 'bg-gray-500'} px-1 `} onChange={(e) => setFirstName(e.target.value)}/>
        </div>
        <div>
          <p>Last name:</p>
          <input type="text" value={lastName} readOnly={!editable} className={`${editable ? 'bg-white' : 'bg-gray-500'} px-1 `} onChange={(e) => setLastName(e.target.value)}/>
        </div>
        <div>
          <p>Username:</p>
          <input type="text" value={username} readOnly={!editable} className={`${editable ? 'bg-white' : 'bg-gray-500'} px-1 `} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <button className='bg-blue-500 px-12 rounded-full' onClick={() => setEditable((prev) => !prev)}>Edit</button>
        <button className='bg-blue-500 px-12 rounded-full' onClick={editProfileDetails}>Change</button>
      </div>
      <div>
      <label htmlFor="file-input">
        <Flex gap="2" className='cursor-pointer'>
          <Avatar src={profilePicture} style={{ width: '60px', height: '60px', borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
        </Flex>
      </label>

      <input id="file-input" type="file" accept="image/*" className='hidden' onChange={handleImageChange} />
        <button onClick={() => selectedImage && addImage(selectedImage)}>Change image</button>
      </div>
    </div>
    
  )
}

export default Profile