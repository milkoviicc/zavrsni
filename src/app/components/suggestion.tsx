/* eslint-disable react/display-name */
'use client';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import UserComponent from './userComponent'
import {FriendshipStatus, User } from '../types/types'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const Suggestion = ({profileSuggestion, handleRoute }: { profileSuggestion: User, handleRoute: (null | ((user: User) => void))}) => {
    
    const [isFollowed, setIsFollowed] = useState(false);

    
    // Define the query function for checking friendship status
    const fetchFriendshipStatus = async (userId: string): Promise<FriendshipStatus> => {
        try {
            const res = await axios.get<FriendshipStatus>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/friendship-status/${userId}`);
            return res.data; // Return the FriendshipStatus
        } catch (error) {
            console.error("Error fetching friendship status:", error);
            throw error; // Rethrow error so it can be handled by React Query
        }
    };

    const {data,error, isLoading} = useQuery({queryKey: ["friendshipStatus", profileSuggestion.userId], queryFn: () => fetchFriendshipStatus(profileSuggestion.userId)});


    useEffect(() => {
        if(data) {
            setIsFollowed(data.isFollowed);
        }
    }, [data]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching friendship status</div>;

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


    return (
        <div className='relative w-full flex justify-around items-center gap-2 sm:gap-4 px-1'>
            <UserComponent user={profileSuggestion} handleRoute={null}/>
            <button className={`${isFollowed ? 'bg-[#3E3E3E] shadow-[1px_2px_4px_1px_rgba(0,0,0,0.1)] hover:shadow-[0px_0px_2px_2px_rgba(0,0,0,0.3)]' : 'bg-[#1565CE] shadow-[1px_2px_4px_1px_rgba(12,75,156,1)] hover:shadow-[0px_0px_2px_2px_rgba(12,75,156,1)]'} px-2 sm:px-8 w-fit h-fit rounded-2xl font-Roboto text-[#E3E3E3] text-xs sm:text-base transition-all`} onClick={() => handleFollow(profileSuggestion.userId)}>{isFollowed ? 'Followed' : 'Follow'}</button>
        </div> 
    )

};

export default Suggestion;