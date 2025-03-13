/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react'
import { followsApi, profileApi } from '@/src/lib/utils'
import { Profile, User } from '@/src/types/types';
import UserComponent from './UserComponent';

const Suggestions = ({profileSuggestion}: {profileSuggestion: User[] | null}) => {

    const [isFollowed, setIsFollowed] = useState(false);

    if(!profileSuggestion) {
        return;
    }

    return (
    <div className='min-w-[90%] grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-4 place-items-center w-full'>
        {profileSuggestion.map((suggestion) => (
            <div key={suggestion.userId} className='relative w-full flex justify-between items-center gap-2 sm:gap-4 px-1'>
                <UserComponent key={suggestion.userId} user={suggestion} handleRoute={null}/>
                <button className={`${isFollowed ? 'bg-[#3E3E3E] shadow-[1px_2px_4px_1px_rgba(0,0,0,0.1)] hover:shadow-[0px_0px_2px_2px_rgba(0,0,0,0.3)]' : 'bg-[#1565CE] shadow-[1px_2px_4px_1px_rgba(12,75,156,1)] hover:shadow-[0px_0px_2px_2px_rgba(12,75,156,1)]'} px-2 sm:px-4 w-[125px] h-fit rounded-2xl font-Roboto text-[#E3E3E3] text-base transition-all`} onClick={() => followsApi.addFollow(suggestion.userId)}>{isFollowed ? 'Followed' : 'Follow'}</button>
            </div>
        ))}
    </div>
  )
}

export default Suggestions;