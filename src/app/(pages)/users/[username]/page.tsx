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
import ProfileUserComponent from '../../../components/ProfileUserComponent';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import PreviousMap_ from 'postcss/lib/previous-map';
import UserSkeleton from '../../../components/UserSkeleton';
import UserComponent from '../../../components/userComponent';
import FullPosts from '../../../components/fullPosts';
import ProfilePosts from '../../../components/ProfilePosts';
import { useToast } from '@/hooks/use-toast';

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

  if(!user) {
    return null;
  }

  return (
    <div className='flex-col mt-[35px] sm:mt-[80px] xl:mt-[60px] min-h-[799px] 2k:min-h-[1200px] bg-[#222222]'>
      <div className='flex-col shadow-[0px_0.1px_15px_0px_rgba(0_0_0_0.26)] min-h-[799px] py-0 sm:py-6 xl:pt-24'>
        <div className='flex flex-col xl:flex-row relative w-screen justify-center 2xl:px-4 xl:px-14 lg:px-4 gap-4'>
          <ProfileUserComponent pathUser={user} editProfile={editProfile}/>
          <div className='flex-grow 2xl:w-screen xl:max-w-[768px] 2xl:max-w-[836px]'>
            <ProfilePosts pathUser={user} />
          </div>
          <div className="xl:flex hidden flex-col fixed 3k:right-80 2k:right-64 2xl:right-12 xl:right-0 gap-0 xl:w-[200px] w-[180px] 2xl:w-[240px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] 2k:h-[800px] 3k:h-[900px] text-center rounded-lg py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525] xl:translate-x-[-20px] 2xl:translate-x-0 2k:translate-x-[-40px] xl:translate-y-0 2xl:translate-y-[40px]">
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