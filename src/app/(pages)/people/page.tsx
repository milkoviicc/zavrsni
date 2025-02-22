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
  const searchParams = useSearchParams();
  const query = searchParams.get("searchTerm") || "";
  const [isRendering, setIsRendering] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const getUsersQuery = useQuery({queryKey: ["getUsers"], queryFn: () => getUsers(), enabled: suggestions.length < 2});
  const getUsersBySearchQuery = useQuery({queryKey: ["getSearchedUsers"], queryFn: () => getUsersBySearch(), enabled: searchTerm !== ""});
  const getSuggestionsQuery = useQuery({queryKey: ["getSuggestions"], queryFn: () => getSuggestions()});
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    if(getSuggestionsQuery.data) {
      setUsers(getSuggestionsQuery.data);

      if(getUsersQuery.data) {
        setUsers((prev) => [...prev, ...getUsersQuery.data?.slice(0,6) ?? []]);
      }
    }
  }, [getSuggestionsQuery.data, getUsersQuery.data]);

  useEffect(() => {
    console.log(users);
  }, [users]);

  const getSuggestions = async () => {
    try {
      const res = await axios.get<User[]>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/follow-suggestions');

      if(res.status === 200) {
        setSuggestions(res.data);
        return res.data;
      }

      return [];
    } catch(err) {
      console.error(err);
    }
  }

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

    if (getSuggestionsQuery.data) {
      const timeout = setTimeout(() => setIsRendering(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [getUsersQuery.data, getUsersBySearchQuery.data, getSuggestionsQuery.data]);

  return (
    <div className='flex-grow bg-[#252525]'>
      <div className='flex flex-col justify-center items-center h-full'>
        <div className='flex flex-col gap-4 max-w-[600px] w-full px-6 sm:px-0 py-32'>
          {searchTerm ? <h1 className='text-[#808080] font-Roboto text-2xl text-center'>You searched "{searchTerm}"</h1> : null}
          {isRendering && searchTerm ? <UserSkeleton /> : getUsersBySearchQuery.data?.map((user) => (
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
                <button className='px-4 sm:px-6 py-1 text-[#DFDEDE] font-Roboto bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)] transition-all rounded-full w-fit'>Check out</button>
              </div>
            </div>
          ))}
          <h1 className='font-Roboto text-center text-[#888888] text-2xl pt-4'>You might like</h1>
          {isRendering ? <UserSkeleton /> : getSuggestionsQuery.data?.map((user) => (
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
                <button className='px-4 sm:px-6 py-1 text-[#DFDEDE] font-Roboto bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)] transition-all rounded-full w-fit'>Check out</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default People