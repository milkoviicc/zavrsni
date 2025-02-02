'use client';
import React, { useEffect, useRef, useState } from 'react'
import UserComponent from './userComponent'
import {FriendshipStatus, User } from '../types/types'
import axios from 'axios';

const Suggestion = ({profileSuggestion, user, handleRoute}: {profileSuggestion: User | null, user: User | null, handleRoute: (null | ((user: User) => void))}) => {
    
    const [isFollowed, setIsFollowed] = useState(false);

    const isFollowedRef = useRef(false);

    useEffect(() => {
        const checkFollowing = async () => {
            if (isFollowedRef.current) return;  
            isFollowedRef.current = true;
            if(profileSuggestion?.userId) {
                const res = await axios.get<FriendshipStatus>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/friendship-status/${profileSuggestion.userId}`);
                if(res.data.isFollowed) {
                    setIsFollowed(true);
                }
            } else if(user) {
                const res = await axios.get<FriendshipStatus>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/friendship-status/${user.userId}`);
                if(res.data.isFollowed) {
                    setIsFollowed(true);
                }
            }
            

        }

        checkFollowing();
    }, [profileSuggestion, user]);

    console.log("Component re-rendered");

    const handleFollow = async (id: string) => {
        try {
            if(isFollowed) {
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

    if(profileSuggestion !== null && handleRoute === null) {
        return (
            <div className='relative w-full flex justify-around items-center gap-2 sm:gap-4 px-1'>
                <UserComponent user={profileSuggestion} handleRoute={null}/>
                <button className={`${isFollowed ? 'bg-[#3E3E3E] shadow-[1px_2px_4px_1px_rgba(0,0,0,0.1)] hover:shadow-[0px_0px_2px_2px_rgba(0,0,0,0.3)]' : 'bg-[#1565CE] shadow-[1px_2px_4px_1px_rgba(12,75,156,1)] hover:shadow-[0px_0px_2px_2px_rgba(12,75,156,1)]'} px-2 sm:px-8 w-fit h-fit rounded-2xl font-Roboto text-[#E3E3E3] text-xs sm:text-base transition-all`} onClick={() => handleFollow(profileSuggestion.userId)}>{isFollowed ? 'Followed' : 'Follow'}</button>
            </div> 
        )
    }

    if(user !== null && handleRoute !== null) {
        return (
            <div className='relative w-full flex justify-around items-center gap-2 sm:gap-4 px-1'>
                <UserComponent user={user} handleRoute={handleRoute} />
                <button className={`${isFollowed ? 'bg-[#3E3E3E] shadow-[1px_2px_4px_1px_rgba(0,0,0,0.1)] hover:shadow-[0px_0px_2px_2px_rgba(0,0,0,0.3)]' : 'bg-[#1565CE] shadow-[1px_2px_4px_1px_rgba(12,75,156,1)] hover:shadow-[0px_0px_2px_2px_rgba(12,75,156,1)]'} px-2 sm:px-8 w-fit h-fit rounded-2xl font-Roboto text-[#E3E3E3] text-xs sm:text-base transition-all`} onClick={() => handleFollow(user.userId)}>{isFollowed ? 'Followed' : 'Follow'}</button>
            </div> 
        )
    }
}

export default Suggestion