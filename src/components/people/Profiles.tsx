/* eslint-disable react/no-unescaped-entities */
'use client';
import { User } from '@/src/types/types'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';

const Profiles = ({searchTerm, searchedUsers, users, suggestions}: {searchTerm: string, searchedUsers: User[], users: User[], suggestions: User[] | null}) => {
  const router = useRouter();

  const [youMightLikeUsers, setYouMightLikeUsers] = useState<User[]>([]);

  // Postavljamo korisnike koje bi korisnik mogao voljeti na temelju prijedloga i preostalih korisnika
  // koji nisu u prijedlozima, a prikazujemo samo prvih 4 korisnika

  useEffect(() => {
    if(suggestions) {
      setYouMightLikeUsers(suggestions);
      const filtered = users.filter((user) => !suggestions.some((suggestion) => suggestion.userId === user.userId));
      setYouMightLikeUsers((prev) => [...prev, ...filtered.slice(0,4)]);
    }
  }, [suggestions, users]);

  return (
    <div className='flex flex-col gap-4 max-w-[600px] w-full px-6 sm:px-0 '>
      {searchTerm ?  <h1 className='text-[#808080] font-Roboto text-2xl text-center'>You searched "{searchTerm}"</h1> : null}
      {searchedUsers?.map((user) => (
        <div key={user.userId} className='bg-[#363636] flex justify-between rounded-lg py-2 px-3 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.2)]'>
          <div className='flex gap-2 items-center'>
            <Avatar className='w-[45px] h-[45px] rounded-full'>
              <AvatarImage src={user.pictureUrl} className="w-fit h-fit aspect-square rounded-full object-cover"/><AvatarFallback>{user.firstName?.slice(0,1)} {user.lastName?.slice(0,1)}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <h3 className='text-[#DFDEDE] font-Roboto text-sm sm:text-base max-w-[100px] sm:max-w-full truncate'>{user.firstName?.charAt(0).toUpperCase()}{user.firstName?.slice(1)} {user.lastName?.charAt(0).toUpperCase()}{user.lastName?.slice(1)}</h3>
              <p className='text-[#888888] font-Roboto text-xs sm:text-sm'>@{user.username}</p>
            </div>
          </div>
          <div className='flex items-center px-2'>
            <button className='cursor-pointer px-4 sm:px-6 py-1 text-[#DFDEDE] font-Roboto bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)] transition-all rounded-full w-fit' onClick={() => router.push(`/users/${user.username}`)}>Check out</button>
          </div>
        </div>
      ))}
      <h1 className='font-Roboto text-center text-[#888888] text-2xl pt-4'>You might like</h1>
      {youMightLikeUsers?.map((user) => (
        <div key={user.userId} className='bg-[#363636] flex justify-between rounded-lg py-2 px-3 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.2)]'>
          <div className='flex gap-2 items-center'>
            <Avatar className='w-[45px] h-[45px] rounded-full'>
              <AvatarImage src={user.pictureUrl} className="w-fit h-fit aspect-square rounded-full object-cover"/><AvatarFallback>{user.firstName?.slice(0,1)} {user.lastName?.slice(0,1)}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <h3 className='text-[#DFDEDE] font-Roboto text-sm sm:text-base max-w-[100px] sm:max-w-full truncate'>{user.firstName?.charAt(0).toUpperCase()}{user.firstName?.slice(1)} {user.lastName?.charAt(0).toUpperCase()}{user.lastName?.slice(1)}</h3>
              <p className='text-[#888888] font-Roboto text-xs sm:text-sm'>@{user.username}</p>
            </div>
          </div>
          <div className='flex items-center px-2'>
            <button className='cursor-pointer px-4 sm:px-6 py-1 text-[#DFDEDE] font-Roboto bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)] transition-all rounded-full w-fit' onClick={() => router.push(`/users/${user.username}`)}>Check out</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Profiles