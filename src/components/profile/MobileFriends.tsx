'use client';
import { Friendship, User } from '@/src/types/types';
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';

const MobileFriends = ({friends, currentUser, loggedUserData}: {friends: Friendship[], currentUser: User, loggedUserData: User}) => {

  const [columns, setColumns] = useState(0);

  // funkcija za postavljanje broja kolona na osnovu širine ekrana
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

  const router = useRouter();

  return (
    <div>
      <div className='flex justify-center w-screen px-4 py-4'>
        <div className={`xl:hidden group max-w-[350px] sm:max-w-[580px] md:max-w-[716px] lg:max-w-[765px] w-full h-full flex flex-col items-center gap-2 bg-transparent px-2 rounded-lg shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0_,_0.26)] py-4 mb-6 lg:mb-10`}>
          <h1 className='font-Roboto text-[#DFDEDE] text-2xl text-center'>{currentUser.username === loggedUserData.username ? 'Your friends' : `${currentUser.firstName?.slice(0,1).toUpperCase()}${currentUser.firstName?.slice(1)}'s friends`}</h1>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {friends?.map((user, index, array) => {
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
        </div>
      </div>
    </div>
  )
}

export default MobileFriends