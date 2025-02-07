/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react'

import { useAuth } from '@/src/app/context/AuthProvider'
import { Friendship, Profile, User } from '@/src/app/types/types';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, Flex } from '@radix-ui/themes';
import Image from 'next/image';
import { profile } from 'console';
import ProfileUserComponent from '../../components/ProfileUserComponent';
import { useQuery } from '@tanstack/react-query';
import PreviousMap_ from 'postcss/lib/previous-map';
import UserSkeleton from '../../components/UserSkeleton';
import UserComponent from '../../components/userComponent';
import FullPosts from '../../components/fullPosts';
import ProfilePosts from '../../components/ProfilePosts';

const MyProfile = () => {
  const {addImage, user, deleteAccount} = useAuth();
  const router = useRouter();
  const [editable, setEditable] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(false);
  const [friendsList, setFriendsList] = useState<Profile[]>([]);

  const getFriends = async () => {
    try {
      const res = await axios.get<Friendship[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/${user?.userId}`);

      const resData = res.data.filter((profile) => profile.user.firstName != null);

      if(res.status === 200) {
        resData.map((user) => {
          setFriendsList((prev) => [...prev, user.user]);
        })
        return resData;
      }
    } catch(err) {
      console.error(err);
      return [];
    }
  };

  const getFriendsQuery = useQuery({queryKey: ["getFriends"], queryFn: () => getFriends()});
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (getFriendsQuery.data) {
      const timeout = setTimeout(() => setIsRendering(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [getFriendsQuery.data]);

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

  const [cacheBuster, setCacheBuster] = useState(Date.now());
  
  useEffect(() => {
    setCacheBuster(Date.now()); // Update only when `profilePicture` changes
  }, [profilePicture]);

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
    <div className='h-full flex flex-col gap-8 mt-[80px] py-0 sm:py-6 md:py-16 bg-[#222222]'>
      <div className='flex'>
        <ProfileUserComponent />
        <div className='flex-grow'>
          <h1 className='text-[#EDEDED] text-center font-Roboto text-3xl 2xl:translate-y-[40px]'>Your posts</h1>
          <ProfilePosts />
        </div>
        <div className="xl:flex hidden flex-col fixed 3k:right-80 2k:right-64 2xl:right-24 xl:right-0 gap-0 xl:w-[200px] w-[180px] 2xl:w-[240px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] 2k:h-[800px] 3k:h-[900px] text-center rounded-lg py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525] xl:translate-x-[-20px] 2xl:translate-x-0 2k:translate-x-[-40px] xl:translate-y-0 2xl:translate-y-[40px]">
            <h1 className="font-Roboto text-xl xl:text-2xl 2k:text-3xl pb-4 px-4 text-[#EFEFEF] font-normal">Your Friends</h1>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
            <div className='group w-full h-full lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px] 2k:max-h-[800px] flex flex-col gap-2 bg-transparent px-4 overflow-y-hidden hover:overflow-y-scroll scrollbar '>
              {getFriendsQuery.isLoading || isRendering ? <UserSkeleton /> : getFriendsQuery.data?.map((user, index) => <UserComponent user={user.user} key={index} handleRoute={null}/>)}
            </div>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
        </div>
      </div>
    </div>
    
  )
}

export default MyProfile;