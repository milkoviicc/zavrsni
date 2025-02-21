'use client';
import React, { useEffect, useState } from 'react'
import { User } from '../../types/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import UserSkeleton from '../../components/UserSkeleton';
import Suggestion from '../../components/suggestion';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { useSearchParams } from 'next/navigation';

const People = () => {
  const [isRendering, setIsRendering] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get("searchTerm") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const getUsersQuery = useQuery({queryKey: ["getUsers"], queryFn: () => getUsers()});
  const getUsersBySearchQuery = useQuery({queryKey: ["getSearchedUsers"], queryFn: () => getUsersBySearch(), enabled: searchTerm !== ""});

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const getUsersBySearch = async () => {
    try {
      const res = await axios.get<User[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/search?searchTerm=${searchTerm}`);

      if(res.status === 200) {
        return res.data;
      }
      return [];
    } catch(err) {
      console.error(err);
    }
  }

  const getUsers = async () => {
    try {
      const res = await axios.get<User[]>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles');

      if(res.status === 200) {
        return res.data;
      }
      return [];
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (getUsersQuery.data) {
      const timeout = setTimeout(() => setIsRendering(false), 500);
      return () => clearTimeout(timeout);
    }

    if (getUsersBySearchQuery.data) {
      const timeout = setTimeout(() => setIsRendering(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [getUsersQuery.data, getUsersBySearchQuery.data]);

  return (
    <div className='flex-grow bg-[#252525]'>
      <div className='flex flex-col justify-center items-center h-full'>
        <div className='flex flex-col gap-4 w-[500px] py-36'>
          {searchTerm ? <h1 className='text-[#808080] font-Roboto text-2xl text-center'>You searched "{searchTerm}"</h1> : null}
          {isRendering && searchTerm ? <UserSkeleton /> : getUsersBySearchQuery.data?.map((user) => (
            <div key={user.userId} className='bg-[#515151] flex justify-between rounded-lg px-2 py-1'>
              <div className='flex gap-2'>
                <Avatar className='w-[45px] h-[45px] rounded-full'>
                  <AvatarImage src={user.pictureUrl} className="w-fit h-fit aspect-square rounded-full object-cover"/><AvatarFallback>{user.firstName?.slice(0,1)} {user.lastName?.slice(0,1)}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-1'>
                  <h3 className='text-[#DFDEDE] font-Roboto'>{user.firstName} {user.lastName}</h3>
                  <p className='text-[#888888] font-Roboto text-sm'>@{user.username}</p>
                </div>
              </div>
              <div>
                <button className='px-12 py-2 text-[#DFDEDE] font-Roboto bg-blue-800 rounded-full w-fit'>Follow</button>
              </div>
            </div>
          ))}
          {isRendering ? <UserSkeleton /> : getUsersQuery.data?.map((user) => (
            <div key={user.userId} className='bg-[#515151] flex justify-between rounded-lg'>
              <div className='flex gap-2'>
                <Avatar className='w-[45px] h-[45px] rounded-full'>
                  <AvatarImage src={user.pictureUrl} className="w-fit h-fit aspect-square rounded-full object-cover"/><AvatarFallback>{user.firstName?.slice(0,1)} {user.lastName?.slice(0,1)}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-1'>
                  <h3 className='text-[#DFDEDE] font-Roboto'>{user.firstName} {user.lastName}</h3>
                  <p className='text-[#888888] font-Roboto text-sm'>@{user.username}</p>
                </div>
              </div>
              <div>
                <button className='px-12 py-2 text-[#DFDEDE] font-Roboto bg-blue-800 rounded-full w-fit'>Follow</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default People