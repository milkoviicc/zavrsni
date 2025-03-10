/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react'

import { useAuth } from '@/src/app/context/AuthProvider'
import { Friendship, Profile, User } from '@/src/app/types/types';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { profile } from 'console';
import ProfileUserComponent from '../../../components/profile/ProfileUserComponent';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import PreviousMap_ from 'postcss/lib/previous-map';
import UserSkeleton from '../../../components/skeletons/UserSkeleton';
import UserComponent from '../../../components/ui/UserComponent';
import ProfilePosts from '../../../components/profile/ProfilePosts';
import { useToast } from '@/hooks/use-toast';
import {Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import ProfileSkeleton from '@/src/app/components/skeletons/ProfileSkeleton';
import ProfileFriendsSkeleton from '@/src/app/components/skeletons/ProfileFriendsSkeleton';

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
  const [isRendering, setIsRendering] = useState(false);
  const [isDataRendering, setIsDataRendering] = useState(false);
  const [user, setUser] = useState<Profile>();
  const loggedUser = localStorage.getItem('user');
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const getFriendsQuery = useQuery({queryKey: ["getFriends"], queryFn: () => getFriends(), enabled: user !== undefined});
  const getUserQuery = useQuery({queryKey: ["getUser"], queryFn: () => getUserData()});

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
      const getUserByUsername = pathname.replace('/users', '').slice(1);
      const res = await axios.get<Profile>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/username/${getUserByUsername}`);

      if(res.status === 200) {
        setUser(res.data);
        return res.data;
      }
    } catch(err) {
      console.error(err);
    }
  }

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


  useEffect(() => {
    if (getFriendsQuery.data) {
      const timeout = setTimeout(() => setIsRendering(false), 500);
      return () => clearTimeout(timeout);
    }
    if(getUserQuery.data) {
      const timeout = setTimeout(() => setIsDataRendering(false), 500);
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
        toast({description: "Profile details successfully updated!", duration: 1500});
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
      } else if(window.innerWidth < 768 && window.innerWidth >= 640) {
        setColumns(3);
      } else {
        setColumns(2);
      }
    }

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  
  const handleChangeImage = async (selectedImage: File) => {
    await addImage(selectedImage);
    queryClient.invalidateQueries({queryKey: ["getUser"]});
  };

  if(!user) {
    return null;
  }

  return (
    <div className='flex-grow 2k:min-h-[1220px] bg-[#222222]'>
      <div className='shadow-[0px_0.1px_15px_0px_rgba(0_0_0_0.26)] min-h-[824px] h-full pt-0 sm:pt-6 xl:pt-24 2xl:pt-16'>
        <div className='flex flex-col relative w-screen justify-center items-center 2xl:px-4 xl:px-14 lg:px-4 gap-4'>
          <div className='xl:flex hidden w-fit h-fit fixed xl:top-10 2xl:top-4 translate-y-[100px] xl:left-0'>
            {getFriendsQuery.isLoading ? <ProfileSkeleton myProfile={myProfile}/> : <ProfileUserComponent pathUser={user} editProfile={editProfile} changeImage={handleChangeImage}/>}
          </div>
          <div className='xl:hidden flex flex-col pt-16'>
            {getFriendsQuery.isLoading ? <ProfileSkeleton myProfile={myProfile}/> : <ProfileUserComponent pathUser={user} editProfile={editProfile} changeImage={handleChangeImage}/>}
          </div>
          {getFriendsQuery.data?.length === 0 ? <div className='px-4 py-4'></div> : (
            <div>
              <div className='flex justify-center w-screen px-4 py-4'>
                <div className={`xl:hidden group max-w-[350px] sm:max-w-[580px] md:max-w-[716px] lg:max-w-[765px] w-full h-full flex flex-col items-center gap-2 bg-transparent px-2 rounded-lg shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0_,_0.26)] py-4 mb-6 lg:mb-10`}>
                  <h1 className='font-Roboto text-[#DFDEDE] text-2xl text-center'>{myProfile ? 'Your friends' : `${user.firstName?.slice(0,1).toUpperCase()}${user.firstName?.slice(1)}'s friends`}</h1>
                  {isRendering ? <ProfileFriendsSkeleton /> : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                      {getFriendsQuery.data?.map((user, index, array) => {
                        const itemsInLastRow = array.length % columns || columns; // Defaulting to 4 when possible
                        const isLastOdd = index >= array.length - itemsInLastRow;
                        return (
                        <div key={user.user.userId} className={`hover:cursor-pointer flex py-2 gap-2 ${isLastOdd && itemsInLastRow === 1 && array.length !== 1 ? 'col-span-full justify-center w-full' : 'w-fit'}`} onClick={() => router.push(`/users/${user.user.username}`)}>
                          <Avatar className='w-[45px] h-[45px] md:w-[35px] md:h-[35px] xl:w-[55px] xl:h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full'>
                              <AvatarImage src={`${user.user.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{user.user.username.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col h-full items-start justify-center">
                              <h1 className={`text-[#EFEFEF] font-[400] font-Roboto text-sm sm:text-base 2k:text-lg truncate whitespace-nowrap max-w-full`} title={`${user.user.firstName} ${user.user.lastName}`}>{user.user.firstName} {user.user.lastName}</h1>
                              <p className={`text-[#888888]  text-sm sm:text-base ${isLastOdd && itemsInLastRow === 1 ? 'max-w-full' : 'max-w-[100px]'} 2k:text-lg truncate whitespace-nowrap`}>@{user.user.username}</p>
                          </div>    
                        </div>
                      )})}
                    </div>
                    )}
                  </div>
                </div>
              </div>
          )}
          <div className='flex-grow w-screen xl:max-w-[768px] 2xl:max-w-[836px] '>
            <ProfilePosts pathUser={user} />
          </div>
          {getFriendsQuery.data?.length === 0 ? null : (
            <div className="xl:flex hidden flex-col fixed top-36 3k:right-80 2k:right-64 2xl:right-24 xl:right-0 gap-0 xl:w-[200px] w-[180px] 2xl:w-[240px] 2k:w-[300px] lg:h-[400px] xl:h-[500px] 2xl:h-[550px] 2k:h-[800px] text-center rounded-lg py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525] xl:translate-x-[-20px] 2xl:translate-x-0 2k:translate-x-[-40px] 2xl:translate-y-[10px]">
                <h1 className="font-Roboto text-lg xl:text-xl 2k:text-3xl pb-4 px-4 text-[#EFEFEF] font-normal">{myProfile ? 'Your Friends' : `${user.firstName?.slice(0,1).toUpperCase()}${user.firstName?.slice(1)}'s friends`}</h1>
                <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
                <div className='group w-full h-full lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px] 2k:max-h-[800px] flex flex-col gap-2 bg-transparent px-4 overflow-y-hidden hover:overflow-y-scroll scrollbar'>
                  {getFriendsQuery.isLoading || isRendering ? <UserSkeleton /> : getFriendsQuery.data?.map((user, index) => <UserComponent user={user.user} key={index} handleRoute={null}/>)}
                </div>
                <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile;
