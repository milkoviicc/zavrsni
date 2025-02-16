/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react'

import { useAuth } from '@/src/app/context/AuthProvider'
import { Friendship, Profile, User } from '@/src/app/types/types';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { profile } from 'console';
import ProfileUserComponent from '../../../components/ProfileUserComponent';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import PreviousMap_ from 'postcss/lib/previous-map';
import UserSkeleton from '../../../components/UserSkeleton';
import UserComponent from '../../../components/userComponent';
import FullPosts from '../../../components/fullPosts';
import ProfilePosts from '../../../components/ProfilePosts';
import { useToast } from '@/hooks/use-toast';
import {Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';

const UserProfile = () => {
  const {addImage, deleteAccount} = useAuth();
  const router = useRouter();
  const [editable, setEditable] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(false);
  const [friendsList, setFriendsList] = useState<Profile[]>([]);
  const [myProfile, setMyProfile] = useState(false);
  const [user, setUser] = useState<Profile>();
  const loggedUser = localStorage.getItem('user');
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // KAD UDJEM TREBA MI LOGGEDUSER I PATHUSER, AKO JE LOGGEDUSER ISTI KO PATHUSER STAVI DA JE MOJ PROFIL AKO NIJE ONDA OSTAVI FALSE
   useEffect(() => {
    if(loggedUser) {
      const loggedUserData = JSON.parse(loggedUser);
      if(pathname === `/users/${loggedUserData?.username}`) {
        setMyProfile(true);
      }
    }
  }, [loggedUser, pathname]);

  const getUserData = async () => {
    try {

      const getUserByUsername = pathname.replace('/users', '');
      const res = await axios.get<Profile>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/username/${getUserByUsername}`);

      if(res.status === 200) {
        setUser(res.data);
        return res.data;
      }
    } catch(err) {
      console.error(err);
    }
  }

  const getUserQuery = useQuery({queryKey: ["getUser"], queryFn: () => getUserData()});

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


  const getFriendsQuery = useQuery({queryKey: ["getFriends"], queryFn: () => getFriends(), enabled: user !== undefined});
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (getFriendsQuery.data) {
      const timeout = setTimeout(() => setIsRendering(false), 500);
      return () => clearTimeout(timeout);
    }
    if(getUserQuery.data) {
      const timeout = setTimeout(() => setIsRendering(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [getFriendsQuery.data, getUserQuery.data]);


  function splitFullName(fullName: string): {firstName: string; lastName: string} {
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const [firstNamePart, ...lastNamePart] = fullName.split(' ');
    const lastName = lastNamePart.join(' ');

    return {firstName, lastName};
  }

  const {toast} = useToast();
  
  const editProfile = async (username: string, fullName: string, description: string | null, occupation: string | null) => {
    try {
      const { firstName, lastName } = splitFullName(fullName);

      const res = await axios.put('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/update-profile', {username, firstName, lastName, description, occupation});

      if(res.status === 200) {
        const updatedUser: User = res.data;
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast({description: "Profile details successfully updated!", duration: 1000});
        if(user?.username === updatedUser.username) {
          queryClient.invalidateQueries({queryKey: ["getUser"]});
          return;
        } else {
          router.push(`/users/${updatedUser.username}`);
        }
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

  const [columns, setColumns] = useState(0);

  useEffect(() => {
    const updateColumns = () => {
      if(window.innerWidth >= 768) {
        setColumns(4);
      } else {
        setColumns(3);
      }
    }

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  if(!user) {
    return null;
  }

  return (
    <div className='flex-col mt-[35px] sm:mt-[80px] xl:mt-[35px] min-h-[829px] h-full 2k:min-h-[1200px] bg-[#222222]'>
      <div className='flex-col shadow-[0px_0.1px_15px_0px_rgba(0_0_0_0.26)] min-h-[829px] h-full pt-0 sm:pt-6 xl:pt-24 2xl:pt-16'>
        <div className='flex flex-col relative w-screen justify-center items-center 2xl:px-4 xl:px-14 lg:px-4 gap-4'>
          <ProfileUserComponent pathUser={user} editProfile={editProfile}/>
          <div className='w-full'>
            <div className='flex justify-center px-12'>
              <div className='xl:hidden group h-full flex flex-col gap-2 bg-transparent px-4 rounded-lg shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0_,_0.26)]'>
                <h1 className='font-Roboto text-[#DFDEDE] text-2xl text-center'>Their friends</h1>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
                  {getFriendsQuery.isLoading || isRendering ? <UserSkeleton /> : getFriendsQuery.data?.map((user, index, array) => {
                    const itemsInLastRow = array.length % columns; // Defaulting to 4 when possible
                    const isLastOdd = itemsInLastRow !== 0 && index >= array.length - itemsInLastRow;
                    return (
                    <div key={user.user.userId} className={`hover:cursor-pointer flex gap-2 py-2 items-center ${isLastOdd && itemsInLastRow === 1 ? 'col-span-full justify-center w-full' : ' w-[170px]'}`} onClick={() => router.push(`/users/${user.user.userId}`)}>
                      <Avatar className='w-[35px] h-[35px] 2xl:w-[55px] 2xl:h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full'>
                          <AvatarImage src={`${user.user.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{user.user.username.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col h-full items-start justify-center">
                          <h1 className={`text-[#EFEFEF] font-[400] font-Roboto text-sm sm:text-base 2k:text-lg truncate whitespace-nowrap ${isLastOdd && itemsInLastRow === 1 ? 'max-w-full' : 'max-w-[85px] sm:max-w-[100px] lg:max-w-full'}`} title={`${user.user.firstName} ${user.user.lastName}`}>{user.user.firstName} {user.user.lastName}</h1>
                          <p className={`text-[#888888]  text-sm sm:text-base ${isLastOdd && itemsInLastRow === 1 ? 'max-w-full' : 'max-w-[75px] sm:max-w-[100px] lg:max-w-full'} 2k:text-lg truncate whitespace-nowrap`}>@{user.user.username}</p>
                      </div>    
                    </div>
                  )})}
                </div>
              </div>
            </div>
          </div>
          <div className='flex-grow w-screen xl:max-w-[768px] 2xl:max-w-[836px]'>
            <ProfilePosts pathUser={user} />
          </div>
          <div className="xl:flex hidden flex-col fixed top-32 3k:right-80 2k:right-64 2xl:right-12 xl:right-3 gap-0 xl:w-[200px] w-[180px] 2xl:w-[240px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] 2k:h-[800px] 3k:h-[900px] text-center rounded-lg py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525] xl:translate-x-[-20px] 2xl:translate-x-0 2k:translate-x-[-40px] 2xl:translate-y-[10px]">
              <h1 className="font-Roboto text-xl xl:text-2xl 2k:text-3xl pb-4 px-4 text-[#EFEFEF] font-normal">{myProfile ? 'Your Friends' : 'Their Friends'}</h1>
              <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
              <div className='group w-full h-full lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px] 2k:max-h-[800px] flex flex-col gap-2 bg-transparent px-4 overflow-y-hidden hover:overflow-y-scroll scrollbar'>
                {getFriendsQuery.isLoading || isRendering ? <UserSkeleton /> : getFriendsQuery.data?.map((user, index) => <UserComponent user={user.user} key={index} handleRoute={null}/>)}
              </div>
              <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile;