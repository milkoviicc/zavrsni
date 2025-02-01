'use client';
import React, { useEffect, useState } from 'react'
import { FollowSuggestionStatus, Profile, User } from '../types/types'
import { useRouter } from 'next/navigation';
import {Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';

const UserComponent = ({user, handleRoute}: {user: User | undefined, handleRoute: (null | ((user: User) => void))}) => {
  const router = useRouter();
  const [shortUsername, setShortUsername] = useState('');

  const routeToUser = () => {
    if(handleRoute !== null) {
      if(user) {
        handleRoute(user);
      }
    } else if (handleRoute === null) {
      router.push(`/users/${user?.username}`);
      
    }
  }

  useEffect(() => {
      if(user && user.firstName && user.lastName) {
          const firstLetter = user.firstName.slice(0, 1);
          const secondLetter = user.lastName.slice(0, 1);
          setShortUsername(firstLetter + secondLetter);
      }
  }, []);

  if(!user) {
    return null;
  }
  return (
    <div>
      <div className="hover:cursor-pointer hidden gap-2 py-2 items-center sm:flex" onClick={() => routeToUser()}>
          <Avatar className='w-[55px] h-[55px] rounded-full'>
              <AvatarImage src={`${user?.pictureUrl}?${new Date().getTime()}`} className="w-fit h-fit aspect-auto rounded-full" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{shortUsername}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col h-full items-start justify-center w-[120px]">
              <h1 className="text-[#EFEFEF] font-[400] font-Roboto text-base max-w-[120px] truncate whitespace-nowrap" title={`${user?.firstName} ${user?.lastName}`}>{user?.firstName} {user?.lastName}</h1>
              <p className="text-[#888888] max-w-[120px] text-base truncate whitespace-nowrap">@{user?.username}</p>
          </div>    
      </div>
      <div className="hover:cursor-pointer flex gap-2 py-2 items-center sm:hidden" onClick={() => routeToUser()}>
          <Avatar className='w-[35px] h-[35px] rounded-full'>
              <AvatarImage src={`${user?.pictureUrl}?${new Date().getTime()}`} className="w-fit h-fit aspect-auto rounded-full" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{shortUsername}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col h-full items-start justify-center w-[100px]">
              <h1 className="text-[#EFEFEF] font-[400] font-Roboto text-xs max-w-[100px] truncate whitespace-nowrap" title={`${user?.firstName} ${user?.lastName}`}>{user?.firstName} {user?.lastName}</h1>
              <p className="text-[#888888] max-w-[100px] text-xs truncate whitespace-nowrap">@{user?.username}</p>
          </div>    
      </div>
    </div>
    
  )
}

export default UserComponent