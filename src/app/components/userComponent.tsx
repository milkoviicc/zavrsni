'use client';
import React, { useEffect, useState } from 'react'
import { Profile, User } from '../types/types'
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
    router.prefetch(`/users/${user?.username}`);
  }, [router, user?.username]);

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
    <div className='w-fit'>
      <div className="hover:cursor-pointer hidden gap-2 py-2 items-center lg:flex" onClick={() => routeToUser()}>
          <Avatar className='w-[55px] h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full'>
              <AvatarImage src={`${user?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{shortUsername}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col h-full items-start justify-center lg:w-[100px] xl:w-[100px] 2xl:max-w-[150px]">
              <h1 className="text-[#EFEFEF] font-[400] font-Roboto text-base 2k:text-lg lg:max-w-[100px] xl:max-w-[100px] 2xl:max-w-[150px] truncate whitespace-nowrap" title={`${user?.firstName} ${user?.lastName}`}>{user?.firstName} {user?.lastName}</h1>
              <p className="text-[#888888] lg:max-w-[100px] xl:max-w-[100px] 2xl:max-w-[150px] text-base 2k:text-lg truncate whitespace-nowrap">@{user?.username}</p>
          </div>    
      </div>
      <div className="hover:cursor-pointer flex gap-2 py-2 items-center lg:hidden" onClick={() => routeToUser()}>
          <Avatar className='w-[45px] h-[45px] sm:w-[55px] sm:h-[55px] rounded-full'>
              <AvatarImage src={`${user?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{shortUsername}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col h-full items-start justify-center w-[150px]">
              <h1 className="text-[#EFEFEF] font-[400] font-Roboto text-sm max-w-[150px] truncate whitespace-nowrap" title={`${user?.firstName} ${user?.lastName}`}>{user?.firstName} {user?.lastName}</h1>
              <p className="text-[#888888] max-w-[150px] text-sm truncate whitespace-nowrap">@{user?.username}</p>
          </div>    
      </div>
    </div>
    
  )
}

export default UserComponent