/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react'

import { useAuth } from '@/src/app/context/AuthProvider'
import { User } from '@/src/app/types/types';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, Flex } from '@radix-ui/themes';
import Image from 'next/image';
import { profile } from 'console';

const Profile = () => {
  const {addImage, user, deleteAccount} = useAuth();
  const router = useRouter();
  const [editable, setEditable] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      try {
        // Initialize the state with user data
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setUsername(user.username || '');
        setProfilePicture(user.pictureUrl);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, [user]);

  if(!user) return null;


  const editProfileDetails = async () => {
    try {
      const res = await axios.put('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/update-profile', {username, firstName, lastName});

      if(res.status === 200) {
        const updatedUser: User = res.data;

        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      }
    } catch(err) {
      console.error(err);
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedImage(file);

      // Generate a temporary image URL for preview
      const imageUrl = URL.createObjectURL(file);

      // Set the profile picture to the temporary URL for preview
      setProfilePicture(imageUrl);
    }
  };

  const handleSubmitImage = async () => {
    if (selectedImage) {
      setLoading(true);
      await addImage(selectedImage);
      // After image is uploaded and state is updated, set the new profile picture URL
      setProfilePicture(user?.pictureUrl || ''); // Update the image in local state
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
      <label htmlFor="file-input" className='w-2'>
        {selectedImage != null  ? (
        <img
          src={profilePicture}// This ensures no caching
          alt="Profile"
          style={{ borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040' }}
          className="w-[60px] h-[60px] object-cover"
        />
      ) : (
        <img
          src={`${profilePicture}`} // This ensures no caching
          alt="Profile"
          style={{ borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040' }}
          className="w-[60px] h-[60px] object-cover"
        />
      )}
      </label>

      <input id="file-input" type="file" accept="image/*" className='hidden' onChange={handleImageChange} />
        <button onClick={handleSubmitImage}>Change image</button>
      </div>
      <button onClick={() => deleteAccount()}>Delete account</button>
    </div>
    
  )
}

export default Profile