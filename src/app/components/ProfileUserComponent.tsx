/* eslint-disable @typescript-eslint/no-unused-expressions */
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FriendshipStatus, Profile, User } from '../types/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Ellipsis, EllipsisVertical, MousePointerClick, Pencil, Router, Trash2, Trash2Icon } from 'lucide-react';
import axios from 'axios';
import { CommandGroup } from 'cmdk';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { Command, CommandItem, CommandList } from '@/src/components/ui/command';
import { useAuth } from '../context/AuthProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import Suggestion from './suggestion';
import UserComponent from './userComponent';
import PreviousMap_ from 'postcss/lib/previous-map';

const ProfileUserComponent = ({pathUser, editProfile}: {pathUser: Profile, editProfile: (username: string, fullName: string, description: string | null, occupation: string | null) => void}) => {

  const user = localStorage.getItem('user');
  const [myProfile, setMyProfile] = useState(false);
  const [shortUsername, setShortUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState<string | null>('');
  const [occupation, setOccupation] = useState<string | null>('');
  const [allowSaving, setAllowSaving] = useState(false);
  const [editableName, setEditableName] = useState(false);
  const [editableUsername, setEditableUsername] = useState(false);
  const [editableDescription, setEditableDescription] = useState(false);
  const [editableOccupation, setEditableOccupation] = useState(false);
  const {deleteAccount} = useAuth();

  const router = useRouter();
  
  useEffect(() => {
    if(user) {
      const userData: User = JSON.parse(user);
      if(userData.username === pathUser.username) {
        setMyProfile(true);
      }
    }
  }, [pathUser.username, user]);

  useEffect(() => {
      if(pathUser && pathUser.firstName && pathUser.lastName) {
          const firstLetter = pathUser.firstName.slice(0, 1);
          const secondLetter = pathUser.lastName.slice(0, 1);
          setShortUsername(firstLetter + secondLetter);
          setFullName(`${pathUser.firstName} ${pathUser.lastName}`);
          setLastName(pathUser.lastName);
          setUsername(pathUser.username);
          if(pathUser.description) {
            setDescription(pathUser.description);
          } else {
            setDescription(null);
          }

          if(pathUser.occupation) {
            setOccupation(pathUser.occupation);
          } else {
            setOccupation(null);
          }
          
      }
  }, [pathUser]);

  const handleEditProfile = () => {
    editProfile(username, fullName, description, occupation);
    setAllowSaving(false);
    setEditableName(false);
    setEditableUsername(false);
    setEditableDescription(false);
    setEditableOccupation(false);
  }

  const [deleteAccDialogOpen, setDeleteAccDialogOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  
  const [isFollowed, setIsFollowed] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState(0);

  const getFriendshipStatus = async () => {
    try {
      const res = await axios.get<FriendshipStatus>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/friendship-status/${pathUser.userId}`);

      if(res.status === 200) {
        setIsFollowed(res.data.isFollowed);
        setFriendshipStatus(res.data.friendshipStatus);
        return res.data;
      }
    } catch (err) {
      console.error(err);
    }
  }

  const getFriendshipStatusQuery = useQuery({queryKey: ["getFriendshipStatus"], queryFn: () => getFriendshipStatus(), enabled: !myProfile});

  const handleFollow = async (id: string) => {
    if(isFollowed) {
      setIsFollowed(false);
    } else {
      setIsFollowed(true);
    }
    try {
        if(isFollowed) {
            const response = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/follows/unfollow/${id}`);
        } else {
            const response = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/follows/add-follow/${id}`);
        }
    } catch(err) {
        console.error(err);
    }
  }

  const acceptRequest = async () => {

    setFriendshipStatus(3);
    try {
        const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/accept/${pathUser.userId}`);
    } catch(err) {
        console.error(err);
    }
  }

  const declineRequest = async () => {
      setFriendshipStatus(0);
      try {
          const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/decline/${pathUser.userId}`);
      } catch(err) {
          console.error(err);
      }
  }

  const addFriend = async () => {
    setFriendshipStatus(1);
    try {
      const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/send/${pathUser.userId}`);
    } catch(err) {
      console.error(err);
    }
  }

  const unfriend = async () => {
    setFriendshipStatus(0);
    try {
      const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/delete/${pathUser.userId}`);
    } catch(err) {
      console.error(err);
    }
  }

  const unsendFriendReq = async () => {
    setFriendshipStatus(0);
    try {
      const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/decline/${pathUser.userId}`);
    } catch(err) {
      console.error(err);
    }
  }

  const [popularUsers, setPopularUsers] = useState<Profile[]>([]);
  const [isRendering, setIsRendering] = useState(true);

  const getPopularUsers = async () => {
    try {
      const res = await axios.get<Profile[]>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/popular?limit=10');
      if(res.status === 200) {
        const resData = res.data.filter((profile) => profile.firstName != null);
        const noPathUser = resData.filter((profile) => profile.userId !== pathUser.userId);
        if(user) {
          const userData: User = JSON.parse(user);
          const noLoggedUser = noPathUser.filter((profile) => profile.userId !== userData.userId).slice(0, 3);
          setPopularUsers(noLoggedUser);
          return noLoggedUser;
        }
      }

    } catch(err) {
      console.error(err);
    }
  }
  const getPopularUsersQuery = useQuery({queryKey: ["getPopularUsersQuery"], queryFn: () => getPopularUsers()});

  useEffect(() => {
    if (getPopularUsersQuery.data) {
      const timeout = setTimeout(() => setIsRendering(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [getPopularUsersQuery.data]);


  if(myProfile) {
    return (
      <div >
        <div className='xl:hidden pt-8 md:pb-4 flex justify-center px-4 w-screen'>
          <div className='w-fit sm:gap-10'>
            <div className='w-full relative rounded-lg flex flex-col sm:hidden justify-center items-center gap-5 px-2 lg:px-8 py-4 shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0,_0.26)]'>
            <Popover>
              <PopoverTrigger className='absolute top-2 right-2 z-50'><Ellipsis className='text-[#DFDEDE]' size={24}/></PopoverTrigger>
              <PopoverContent className='w-fit mr-4'>
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem><button onClick={() => setDeleteAccDialogOpen((prev) => !prev)} className='text-[#DFDEDE] flex gap-2 items-center text-base'><Trash2Icon size={20}/>Delete Your Account</button></CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
              <div className='flex items-center justify-center gap-1'>
                <Avatar className='w-[65px] h-[65px] rounded-full'>
                  <AvatarImage src={`${pathUser?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{shortUsername}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col justify-center px-2'>
                  <h1 className='text-[#DFDEDE] font-Roboto text-lg min-w-full'>{pathUser.firstName} {pathUser.lastName}</h1>
                  <p className='text-[#888888] font-Roboto text-sm'>@{pathUser.username}</p>
                </div>
              </div>
              <div className='flex flex-col'>
                <div className='flex flex-col items-center px-1 py-2 gap-4'>
                  <p className='text-center text-[#EDEDED] font-Roboto text-sm w-[55%]'>{pathUser.description ? `${pathUser.description}` : 'No description yet! You can add one down below.'}</p>
                  <p className='text-[#DFDEDE] font-Roboto text-sm'>{pathUser.occupation ? `${pathUser.occupation}` : 'No occupation yet!'}</p>
                  <div className='flex justify-evenly gap-4'>
                    <div className='flex items-center gap-2'>
                      <p className='text-[#888888] font-Roboto text-sm'>Followers</p>
                      <span className='text-[#888888] text-lg'>{pathUser.followers}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <p className='text-[#888888] font-Roboto text-sm'>Following</p>
                      <span className='text-[#888888] text-lg'>{pathUser.following}</span>
                    </div>
                  </div>
                </div>
                <span className="bg-[#515151] h-[1px] w-full"></span>
              </div>
              <div className='flex flex-col justify-center'>
                <div className='flex flex-col gap-4'>
                  <div className='flex gap-2 justify-center items-center'>
                    <button className='flex gap-2 bg-[#363636] px-4 py-2 rounded-md text-center font-Roboto text-[#A0A0A0] text-sm 2xl:text-lg font-semibold shadow-[0_2px_3px_0_rgba(0,0,0,0.3)]' onClick={() => setEditProfileOpen((prev) => !prev)}>EDIT PROFILE <MousePointerClick size={20}/></button>
                  </div>
                  <div className={`${editProfileOpen ? 'flex' : 'hidden'} gap-2 w-full`}>
                    <div className='flex flex-col items-start h-fit w-full'>
                      <label htmlFor="profileName" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Name</label>
                      <div className='flex items-center relative w-full'>
                        {editableName ? (<input type="text" id="profileName" value={fullName} onChange={(e) => {`${pathUser.firstName} ${pathUser.lastName}` === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setFullName(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="profileName" value={fullName} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none cursor-not-allowed'/>}
                        <label htmlFor="profileName" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableName((prev) => !prev)}/></label>
                      </div>
                    </div>
                    <div className='flex flex-col items-start h-fit w-full'>
                      <label htmlFor="username" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Username</label>
                      <div className='flex items-center relative w-full'>
                        {editableUsername ? (<input type="text" id="username" value={username} onChange={(e) => {pathUser.username === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setUsername(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="username" value={username} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none cursor-not-allowed'/>}
                        <label htmlFor="username" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableUsername((prev) => !prev)}/></label>
                      </div>
                    </div>
                  </div>
                  <div className={`${editProfileOpen ? 'flex' : 'hidden'} gap-2 w-full`}>
                    <div className='flex flex-col items-start h-fit w-full'>
                      <label htmlFor="description" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Description</label>
                      <div className='flex items-center relative w-full'>
                        {editableDescription ? <textarea id="description" value={description !== null ? description : ''} onChange={(e) => {pathUser.description === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setDescription(e.target.value)}} rows={4} maxLength={100} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none'/>: <textarea id="description" value={description ? `${description}` : 'Set a description'} rows={4} maxLength={100} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none cursor-not-allowed'/>}
                        <label htmlFor="description" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableDescription((prev) => !prev)}/></label>
                      </div>
                    </div>
                    <div className='flex flex-col items-start h-fit w-full'>
                      <label htmlFor="occupation" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Occupation</label>
                      <div className='flex items-center relative w-full'>
                        {editableOccupation ? <input type="text" id="occupation" value={occupation !== null ? occupation : ''} onChange={(e) => {pathUser.occupation === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setOccupation(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none'/> : <input type="text" id="occupation" value={occupation ? `${occupation}` : 'Set an occupation'} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none cursor-not-allowed'/>}
                        <label htmlFor="occupation" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableOccupation((prev) => !prev)}/></label>
                      </div>
                      <div className='flex w-full justify-center py-4'>
                        {allowSaving ? <button className='text-[#EDEDED] font-light rounded-full bg-[#1565CE] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-pointer' onClick={() =>  handleEditProfile()}>Save changes</button> :<button className='text-[#7D7D7D] font-light rounded-full bg-[#2C2C2C] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-not-allowed'>Save changes</button>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full relative rounded-lg hidden sm:flex md:hidden justify-center gap-10 px-2 lg:px-8 py-4 shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0,_0.26)]'>
              <Popover>
                <PopoverTrigger className='absolute top-2 right-2 z-50'><Ellipsis className='text-[#DFDEDE]' size={24}/></PopoverTrigger>
                <PopoverContent className='w-fit mr-4'>
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        <CommandItem><button onClick={() => setDeleteAccDialogOpen((prev) => !prev)} className='text-[#DFDEDE] flex gap-2 items-center text-base'><Trash2Icon size={20}/>Delete Your Account</button></CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className='flex flex-col'>
                <div className='flex items-center justify-center gap-1'>
                  <Avatar className='w-[45px] h-[45px] rounded-full'>
                    <AvatarImage src={`${pathUser?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{shortUsername}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col justify-center px-2'>
                    <h1 className='text-[#DFDEDE] font-Roboto text-xs md:text-sm min-w-full'>{pathUser.firstName} {pathUser.lastName}</h1>
                    <p className='text-[#888888] font-Roboto text-xs md:text-sm'>@{pathUser.username}</p>
                  </div>
                </div>
                <div className='flex flex-col justify-center px-1 py-2 gap-4'>
                  <p className='text-left text-[#EDEDED] font-Roboto text-xs 2xl:text-sm max-w-[150px]'>{pathUser.description ? `${pathUser.description}` : 'No description yet! You can add one down below.'}</p>
                  <p className='text-[#DFDEDE] font-Roboto text-xs 2xl:text-sm'>{pathUser.occupation ? `${pathUser.occupation}` : 'No occupation yet!'}</p>
                  <div className='flex justify-evenly gap-4'>
                    <div className='flex items-center gap-2'>
                      <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm'>Followers</p>
                      <span className='text-[#888888] text-lg'>{pathUser.followers}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm'>Following</p>
                      <span className='text-[#888888] text-lg'>{pathUser.following}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col justify-center'>
                <div className='flex flex-col gap-4'>
                  <div className='flex gap-2 justify-center items-center'>
                    <h1 className='text-center font-Roboto text-[#A0A0A0] text-sm 2xl:text-lg font-semibold'>EDIT PROFILE</h1>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <div className='flex gap-2'>
                      <div className='flex flex-col items-start h-fit w-full'>
                        <label htmlFor="profileName" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Name</label>
                        <div className='flex items-center relative w-full'>
                          {editableName ? (<input type="text" id="profileName" value={fullName} onChange={(e) => {`${pathUser.firstName} ${pathUser.lastName}` === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setFullName(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="profileName" value={fullName} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none cursor-not-allowed'/>}
                          <label htmlFor="profileName" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableName((prev) => !prev)}/></label>
                        </div>
                      </div>
                      <div className='flex flex-col items-start h-fit w-full'>
                        <label htmlFor="username" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Username</label>
                        <div className='flex items-center relative w-full'>
                          {editableUsername ? (<input type="text" id="username" value={username} onChange={(e) => {pathUser.username === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setUsername(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="username" value={username} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none cursor-not-allowed'/>}
                          <label htmlFor="username" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableUsername((prev) => !prev)}/></label>
                        </div>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <div className='flex flex-col items-start h-fit w-full'>
                        <label htmlFor="description" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Description</label>
                        <div className='flex items-center relative w-full'>
                          {editableDescription ? <textarea id="description" value={description !== null ? description : ''} onChange={(e) => {pathUser.description === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setDescription(e.target.value)}} rows={4} maxLength={100} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none'/>: <textarea id="description" value={description ? `${description}` : 'Set a description'} rows={4} maxLength={100} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none cursor-not-allowed'/>}
                          <label htmlFor="description" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableDescription((prev) => !prev)}/></label>
                        </div>
                      </div>
                      <div className='flex flex-col gap-2 w-full'>
                        <div className='flex flex-col items-start h-fit w-full'>
                          <label htmlFor="occupation" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Occupation</label>
                          <div className='flex items-center relative w-full'>
                            {editableOccupation ? <input type="text" id="occupation" value={occupation !== null ? occupation : ''} onChange={(e) => {pathUser.occupation === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setOccupation(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none'/> : <input type="text" id="occupation" value={occupation ? `${occupation}` : 'Set an occupation'} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none cursor-not-allowed'/>}
                            <label htmlFor="occupation" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableOccupation((prev) => !prev)}/></label>
                          </div>
                          <div className='flex w-full justify-center py-4'>
                            {allowSaving ? <button className='text-[#EDEDED] font-light rounded-full bg-[#1565CE] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-pointer' onClick={() =>  handleEditProfile()}>Save changes</button> :<button className='text-[#7D7D7D] font-light rounded-full bg-[#2C2C2C] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-not-allowed'>Save changes</button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full relative rounded-lg hidden md:flex justify-center gap-10 px-2 lg:px-8 py-4 shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0,_0.26)]'>
              <Popover>
                <PopoverTrigger className='absolute top-2 right-2 z-50'><Ellipsis className='text-[#DFDEDE]' size={24}/></PopoverTrigger>
                <PopoverContent className='w-fit mr-4'>
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        <CommandItem><button onClick={() => setDeleteAccDialogOpen((prev) => !prev)} className='text-[#DFDEDE] flex gap-2 items-center text-base'><Trash2Icon size={20}/>Delete Your Account</button></CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className='flex flex-col items-center justify-center px-2 gap-2'>
                <Avatar className='w-[65px] h-[65px] rounded-full'>
                  <AvatarImage src={`${pathUser?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{shortUsername}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col justify-center items-center'>
                  <h1 className='text-[#DFDEDE] font-Roboto text-xs md:text-sm min-w-full'>{pathUser.firstName} {pathUser.lastName}</h1>
                  <p className='text-[#888888] font-Roboto text-xs md:text-sm'>@{pathUser.username}</p>
                </div>
              </div>
              <div className='flex flex-col justify-center px-1 py-2 gap-4'>
                <p className='text-left text-[#EDEDED] font-Roboto text-xs 2xl:text-sm max-w-[150px]'>{pathUser.description ? `${pathUser.description}` : 'No description yet! You can add one down below.'}</p>
                <p className='text-[#DFDEDE] font-Roboto text-xs 2xl:text-sm'>{pathUser.occupation ? `${pathUser.occupation}` : 'No occupation yet!'}</p>
                <div className='flex justify-evenly gap-4'>
                  <div>
                    <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm'>Followers</p>
                    <span className='text-[#888888] text-lg'>{pathUser.followers}</span>
                  </div>
                  <div>
                    <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm'>Following</p>
                    <span className='text-[#888888] text-lg'>{pathUser.following}</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col'>
                <h1 className='text-center font-Roboto text-[#A0A0A0] text-sm 2xl:text-lg font-semibold'>EDIT PROFILE</h1>
                <div className='flex gap-4'>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-col items-start h-fit'>
                      <label htmlFor="profileName" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Name</label>
                      <div className='flex items-center relative w-full'>
                        {editableName ? (<input type="text" id="profileName" value={fullName} onChange={(e) => {`${pathUser.firstName} ${pathUser.lastName}` === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setFullName(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="profileName" value={fullName} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none cursor-not-allowed'/>}
                        <label htmlFor="profileName" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableName((prev) => !prev)}/></label>
                      </div>
                    </div>
                    <div className='flex flex-col items-start h-fit'>
                      <label htmlFor="description" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Description</label>
                      <div className='flex items-center relative w-full'>
                        {editableDescription ? <textarea id="description" value={description !== null ? description : ''} onChange={(e) => {pathUser.description === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setDescription(e.target.value)}} rows={4} maxLength={100} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none'/>: <textarea id="description" value={description ? `${description}` : 'Set a description'} rows={4} maxLength={100} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none cursor-not-allowed'/>}
                        <label htmlFor="description" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableDescription((prev) => !prev)}/></label>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-col items-start h-fit'>
                      <label htmlFor="username" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Username</label>
                      <div className='flex items-center relative w-full'>
                        {editableUsername ? (<input type="text" id="username" value={username} onChange={(e) => {pathUser.username === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setUsername(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="username" value={username} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none cursor-not-allowed'/>}
                        <label htmlFor="username" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableUsername((prev) => !prev)}/></label>
                      </div>
                    </div>
                    <div className='flex flex-col items-start h-fit'>
                      <label htmlFor="occupation" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Occupation</label>
                      <div className='flex items-center relative w-full'>
                        {editableOccupation ? <input type="text" id="occupation" value={occupation !== null ? occupation : ''} onChange={(e) => {pathUser.occupation === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setOccupation(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none'/> : <input type="text" id="occupation" value={occupation ? `${occupation}` : 'Set an occupation'} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none cursor-not-allowed'/>}
                        <label htmlFor="occupation" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableOccupation((prev) => !prev)}/></label>
                      </div>
                      <div className='flex w-full justify-center py-4'>
                        {allowSaving ? <button className='text-[#EDEDED] font-light rounded-full bg-[#1565CE] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-pointer' onClick={() =>  handleEditProfile()}>Save changes</button> :<button className='text-[#7D7D7D] font-light rounded-full bg-[#2C2C2C] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-not-allowed'>Save changes</button>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:flex hidden flex-col fixed 3k:left-80 2k:left-64 2xl:left-12 xl:left-0 self-start gap-0 xl:w-[245px] 2xl:w-[300px] 2k:w-[275px] xl:h-[500px] 2xl:h-[600px] 2k:h-[800px] 3k:h-[900px] text-center rounded-lg py-2 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525] xl:translate-x-[20px] 2xl:translate-x-0 2k:translate-x-[40px] xl:translate-y-0 2xl:translate-y-[40px]">
          <Popover>
            <PopoverTrigger className='absolute top-2 right-2 cursor-pointer'><Ellipsis className='text-[#DFDEDE]' size={24}/></PopoverTrigger>
            <PopoverContent className='w-fit'>
              <Command>
                <CommandList>
                  <CommandGroup>
                    <CommandItem><button onClick={() => setDeleteAccDialogOpen((prev) => !prev)} className='text-[#DFDEDE] flex gap-2 items-center text-base'><Trash2Icon size={20}/>Delete Your Account</button></CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className='w-full relative flex flex-col justify-evenly items-center mt-2 2xl:mt-4'>
            <div className='flex flex-col py-1 gap-2 w-full'>
              <div className='flex justify-center px-2'>
                <Avatar className='w-[45px] h-[45px] 2xl:w-[65px] 2xl:h-[65px] 2k:w-[100px] 2k:h-[100px] rounded-full'>
                  <AvatarImage src={`${pathUser?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{shortUsername}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col justify-center items-start px-2'>
                  <h1 className='text-[#DFDEDE] font-Roboto text-sm 2xl:text-base'>{pathUser.firstName} {pathUser.lastName}</h1>
                  <p className='text-[#888888] font-Roboto text-sm 2xl:text-base'>@{pathUser.username}</p>
                </div>
              </div>
              <div className='flex flex-col px-4 py-2 gap-4'>
                <p className='text-center text-[#DFDEDE] font-Roboto text-xs 2xl:text-sm px-3'>{pathUser.description ? `${pathUser.description}` : 'No description yet! You can add one down below.'}</p>
                <p className='text-[#DFDEDE] text-center font-Roboto text-xs 2xl:text-sm'>{pathUser.occupation ? `${pathUser.occupation}` : 'No occupation yet!'}</p>
              </div>
              <div className='flex justify-evenly gap-4'>
                <div className='flex items-center gap-2'>
                  <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm'>Followers</p>
                  <span className='text-[#888888] text-lg'>{pathUser.followers}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm'>Following</p>
                  <span className='text-[#888888] text-lg'>{pathUser.following}</span>
                </div>
              </div>
              <span className="bg-[#515151] h-[1px] w-full"></span>
              <div className='flex flex-col w-full px-4'>
                <div className='flex gap-2 justify-center items-center'>
                  <h1 className='text-center font-Roboto text-[#A0A0A0] text-sm 2xl:text-lg font-semibold'>EDIT PROFILE</h1>
                  <Dialog open={deleteAccDialogOpen} onOpenChange={setDeleteAccDialogOpen}>
                    <DialogContent className='bg-[#515151] border-none max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'>
                      <DialogHeader>
                        <DialogTitle className='text-[#DFDEDE] text-left'>Would you like to delete your account?</DialogTitle>
                      </DialogHeader>
                      <div className='flex gap-4'>
                        <Button onClick={() => deleteAccount()} className='px-8 bg-[#1565CE] transition-all shadow-[1px_1px_3px_1px_rgba(0,0,0,0.4)] hover:shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)] hover:opacity-90'>Yes</Button>
                        <Button variant="destructive" onClick={() => setDeleteAccDialogOpen(false)} className='px-8 transition-all shadow-[1px_1px_3px_1px_rgba(0,0,0,0.4)] hover:shadow-[1px_2px_5px_1px_rgba(0,0,0,0.5)]'>No</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className='flex flex-col gap-1'>
                  <div className='flex flex-col items-start'>
                    <label htmlFor="profileName" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Name</label>
                    <div className='flex items-center relative w-full'>
                      {editableName ? (<input type="text" id="profileName" value={fullName} onChange={(e) => {`${pathUser.firstName} ${pathUser.lastName}` === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setFullName(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="profileName" value={fullName} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none cursor-not-allowed'/>}
                      <label htmlFor="profileName" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableName((prev) => !prev)}/></label>
                    </div>
                  </div>
                  <div className='flex flex-col items-start'>
                    <label htmlFor="username" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Username</label>
                    <div className='flex items-center relative w-full'>
                      {editableUsername ? (<input type="text" id="username" value={username} onChange={(e) => {pathUser.username === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setUsername(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="username" value={username} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none cursor-not-allowed'/>}
                      <label htmlFor="username" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableUsername((prev) => !prev)}/></label>
                    </div>
                  </div>
                  <div className='flex flex-col items-start'>
                    <label htmlFor="description" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Description</label>
                    <div className='flex items-center relative w-full'>
                      {editableDescription ? <textarea id="description" value={description !== null ? description : ''} onChange={(e) => {pathUser.description === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setDescription(e.target.value)}} rows={4} maxLength={100} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none'/>: <textarea id="description" value={description ? `${description}` : 'Set a description'} rows={4} maxLength={100} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none cursor-not-allowed'/>}
                      <label htmlFor="description" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableDescription((prev) => !prev)}/></label>
                    </div>
                  </div>
                  <div className='flex flex-col items-start'>
                    <label htmlFor="occupation" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Occupation</label>
                    <div className='flex items-center relative w-full'>
                      {editableOccupation ? <input type="text" id="occupation" value={occupation !== null ? occupation : ''} onChange={(e) => {pathUser.occupation === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setOccupation(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none'/> : <input type="text" id="occupation" value={occupation ? `${occupation}` : 'Set an occupation'} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none cursor-not-allowed'/>}
                      <label htmlFor="occupation" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableOccupation((prev) => !prev)}/></label>
                    </div>
                  </div>
                  <div className='flex justify-center py-2'>
                    {allowSaving ? <button className='text-[#EDEDED] font-light rounded-full bg-[#1565CE] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-pointer' onClick={() =>  handleEditProfile()}>Save changes</button> :<button className='text-[#7D7D7D] font-light rounded-full bg-[#2C2C2C] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-not-allowed'>Save changes</button>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="xl:flex hidden flex-col fixed 3k:left-80 2k:left-64 2xl:left-12 xl:left-0 self-start gap-0 xl:w-[200px] w-[180px] 2xl:w-[245px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] 2k:h-[800px] 3k:h-[900px] text-center rounded-lg py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525] xl:translate-x-[20px] 2xl:translate-x-0 2k:translate-x-[40px] xl:translate-y-0 2xl:translate-y-[40px]">
        <div className='w-full flex flex-col justify-center items-center'>
          <div className='flex flex-col py-1 gap-2 w-full'>
            <div className='flex px-2'>
              <Avatar className='w-[45px] h-[45px] 2xl:w-[65px] 2xl:h-[65px] 2k:w-[100px] 2k:h-[100px] rounded-full'>
                <AvatarImage src={`${pathUser?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{shortUsername}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col justify-center items-start px-2'>
                <h1 className='text-[#DFDEDE] font-Roboto text-sm 2xl:text-base'>{pathUser.firstName} {pathUser.lastName}</h1>
                <p className='text-[#888888] font-Roboto text-sm 2xl:text-base'>@{pathUser.username}</p>
              </div>
            </div>
            <div className='flex flex-col px-4 py-2 gap-4'>
              <p className='text-left text-[#DFDEDE] font-Roboto text-xs 2xl:text-sm'>{pathUser.description ? `${pathUser.description}` : 'No description yet! You can add one down below.'}</p>
              <p className='text-[#DFDEDE] text-left font-Roboto text-xs 2xl:text-sm'>{pathUser.occupation ? `${pathUser.occupation}` : 'No occupation yet!'}</p>
            </div>
            <div className='flex justify-evenly gap-4'>
              <div className='flex items-center gap-2'>
              <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm'>Followers</p>
              <span className='text-[#888888] text-lg'>{pathUser.followers}</span>
              </div>
              <div className='flex items-center gap-2'>
              <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm'>Following</p>
              <span className='text-[#888888] text-lg'>{pathUser.following}</span>
              </div>
            </div>
            <span className="bg-[#515151] h-[1px] w-full"></span>
          </div>
          <div className='w-full pt-4'>
          <p className='text-[#808080] font-Roboto'>{friendshipStatus === 0 ? 'You are not friends' : friendshipStatus === 1 ? 'You sent a friend request' : friendshipStatus === 2 ? 'Sent you a friend request' : 'Friends'}</p>
            {friendshipStatus === 0 ? (
              <div className='w-full px-2 flex justify-between gap-4 pt-2'>
                <button onClick={() => addFriend()} className='px-2 sm:px-4 py-0 w-full rounded-full font-Roboto font-normal text-xs sm:text-base bg-[#1565CE] transition-all shadow-[0px_1px_2px_0px_rgba(110, 122, 248, 0.25)] hover:shadow-[0px_1px_2px_2px_rgba(110, 122, 248, 0.5)] hover:opacity-90 text-[#E3E3E3]'>Add friend</button>
                <button className={`${isFollowed ? 'bg-[#CA3C3C] shadow-[1px_1px_3px_1px_rgba(0,0,0,0.1)] hover:shadow-[1px_1px_5px_3px_rgba(0,0,0,0.2)]' : 'bg-[#1565CE] shadow-[1px_1px_3px_1px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)]'} px-2 sm:px-4 w-full h-fit rounded-2xl font-Roboto text-[#E3E3E3] text-xs sm:text-base transition-all  hover:opacity-90`} onClick={() => handleFollow(pathUser.userId)}>{isFollowed ? 'Followed' : 'Follow'}</button>
              </div>
            ) : friendshipStatus === 1 ? (
              <div className='w-full px-2 flex justify-between gap-4 pt-2'>
                <button onClick={() => unsendFriendReq()} className='px-2 sm:px-4 py-0 w-full h-full rounded-full font-Roboto font-normal text-xs sm:text-base bg-[#CA3C3C] transition-all shadow-[1px_1px_3px_1px_rgba(0,0,0,0.1)] hover:shadow-[1px_1px_5px_3px_rgba(0,0,0,0.2)] hover:opacity-90 text-[#E3E3E3]'>Unsend</button>
                <button className={`${isFollowed ? 'bg-[#CA3C3C] shadow-[1px_1px_3px_1px_rgba(0,0,0,0.1)] hover:shadow-[1px_1px_5px_3px_rgba(0,0,0,0.2)]' : 'bg-[#1565CE] shadow-[1px_1px_3px_1px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)]'} px-2 sm:px-4 w-full h-fit rounded-2xl font-Roboto text-[#E3E3E3] text-xs sm:text-base transition-all  hover:opacity-90`} onClick={() => handleFollow(pathUser.userId)}>{isFollowed ? 'Followed' : 'Follow'}</button>
              </div>
            ) : friendshipStatus === 2 ? (
              <div className='w-full px-2 flex flex-col gap-4 pt-2'>
                <div className='w-full flex justify-between gap-4'>
                  <button onClick={() => acceptRequest()} className='px-2 sm:px-4 py-0 w-full h-fit rounded-full font-Roboto font-normal text-xs sm:text-base bg-[#1565CE] transition-all shadow-[0px_1px_2px_0px_rgba(110, 122, 248, 0.25)] hover:shadow-[0px_1px_2px_2px_rgba(110, 122, 248, 0.5)] hover:opacity-90 text-[#E3E3E3]'>Accept</button>
                  <button onClick={() => declineRequest()} className='px-2 sm:px-4 py-0 w-full h-fit rounded-full font-Roboto font-normal text-xs sm:text-base bg-[#CA3C3C] transition-all shadow-[1px_1px_3px_1px_rgba(0,0,0,0.1)] hover:shadow-[1px_1px_5px_3px_rgba(0,0,0,0.2)]  hover:opacity-90 text-[#E3E3E3]'>Decline</button>
                </div>
                <div>
                  <button className={`${isFollowed ? 'bg-[#CA3C3C] shadow-[1px_1px_3px_1px_rgba(0,0,0,0.1)] hover:shadow-[1px_1px_5px_3px_rgba(0,0,0,0.2)]' : 'bg-[#1565CE] shadow-[1px_1px_3px_1px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)]'} px-2 sm:px-4 w-full h-fit rounded-2xl font-Roboto text-[#E3E3E3] text-xs sm:text-base transition-all  hover:opacity-90`} onClick={() => handleFollow(pathUser.userId)}>{isFollowed ? 'Followed' : 'Follow'}</button>
                </div>
              </div>
            ) : (
              <div className='w-full px-2 flex justify-between gap-4 pt-2'>
                <button onClick={() => unfriend()} className='px-2 sm:px-4 py-0 w-full h-fit rounded-full font-Roboto font-normal text-xs sm:text-base bg-[#CA3C3C] transition-all shadow-[0px_1px_2px_0px_rgba(110, 122, 248, 0.25)] hover:shadow-[0px_1px_2px_2px_rgba(110, 122, 248, 0.5)] hover:opacity-90 text-[#E3E3E3]'>Unfriend</button>
                <button className={`${isFollowed ? 'bg-[#CA3C3C] shadow-[1px_1px_3px_1px_rgba(0,0,0,0.1)] hover:shadow-[1px_1px_5px_3px_rgba(0,0,0,0.2)]' : 'bg-[#1565CE] shadow-[1px_1px_3px_1px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)]'} px-2 sm:px-4 w-full h-fit rounded-2xl font-Roboto text-[#E3E3E3] text-xs sm:text-base transition-all hover:opacity-90`} onClick={() => handleFollow(pathUser.userId)}>{isFollowed ? 'Followed' : 'Follow'}</button>
              </div>
            )}
          </div>
          <span className="bg-[#515151] h-[1px] w-full mt-8"></span>
          <h3 className='font-Roboto text-[#808080] mt-2'>You might know</h3>
          <div className='flex flex-col px-6 w-full'>
            {getPopularUsersQuery.data?.map((profile, index) => (
              <UserComponent key={profile.userId} user={profile} handleRoute={null}/>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileUserComponent