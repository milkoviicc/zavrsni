import React, { useState } from 'react'
import UserComponent from './userComponent'
import { FollowSuggestionStatus, FriendshipStatus } from '../types/types'
import axios from 'axios';

const Suggestion = ({profileSuggestion}: {profileSuggestion: FollowSuggestionStatus}) => {
    const [isFollowed, setIsFollowed] = useState(false);

    const handleFollow = async (id: string) => {
        try {
            const res = await axios.get<FriendshipStatus>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/friendship-status/${id}`);

            if(res.data.isFollowed) {
                const response = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/follows/unfollow/${id}`);

                if(response.status === 200) {
                    setIsFollowed(false);
                }
            } else {
                const response = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/follows/add-follow/${id}`);

                if(response.status === 200) {
                    setIsFollowed(true);
                }
            }
        } catch(err) {
            console.error(err);
        }
    }

  return (
    <div className='relative w-fit flex justify-between items-center gap-2 sm:gap-4 px-1'>
        <UserComponent user={profileSuggestion.user} />
        <button className={`${isFollowed ? 'bg-[#3E3E3E] shadow-[1px_2px_4px_1px_rgba(0,0,0,0.1)] hover:shadow-[0px_0px_2px_2px_rgba(0,0,0,0.3)]' : 'bg-[#1565CE] shadow-[1px_2px_4px_1px_rgba(12,75,156,1)] hover:shadow-[0px_0px_2px_2px_rgba(12,75,156,1)]'} px-2 sm:px-8 w-fit h-fit rounded-2xl font-Roboto text-[#E3E3E3] text-xs sm:text-base transition-all`} onClick={() => handleFollow(profileSuggestion.user.userId)}>{isFollowed ? 'Followed' : 'Follow'}</button>
    </div>
  )
}

export default Suggestion