/* eslint-disable react/display-name */
'use client';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import UserComponent from './userComponent'
import {FriendshipStatus, User } from '../types/types'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const Suggestion = ({profileSuggestion, handleRoute }: { profileSuggestion: User, handleRoute: (null | ((user: User) => void))}) => {
    
    const [isFollowed, setIsFollowed] = useState(false);

    const {data,error, isLoading} = useQuery({queryKey: ["getFollowedUsers"], queryFn: () => getFollowedUsers()});
    
    // Define the query function for checking friendship status
    const getFollowedUsers = async (): Promise<string[]> => {
        try {
            const user = localStorage.getItem('user');
            if(user) {
                const userData: User = JSON.parse(user);
                const res = await axios.get<string[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/follows/get-followed/${userData.userId}`);
                return res.data; // Return the string[]
            }
            return [];
        } catch (error) {
            console.error("Error fetching friendship status:", error);
            throw error; // Rethrow error so it can be handled by React Query
        }
    };

    useEffect(() => {
        if(Array.isArray(data)) {
            setIsFollowed(data.some((userId) => profileSuggestion.userId === userId));
        }
    }, [data, profileSuggestion.userId]);

    if(error) {
        console.error(error);
    }

    if(isLoading) {
        return (
            <div>Loading...</div>
        )
    }

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
        <div className='relative w-full flex justify-between items-center gap-2 sm:gap-4 px-1'>
            <UserComponent user={profileSuggestion} handleRoute={handleRoute}/>
            <button className={`${isFollowed ? 'bg-[#3E3E3E] shadow-[1px_2px_4px_1px_rgba(0,0,0,0.1)] hover:shadow-[0px_0px_2px_2px_rgba(0,0,0,0.3)]' : 'bg-[#1565CE] shadow-[1px_2px_4px_1px_rgba(12,75,156,1)] hover:shadow-[0px_0px_2px_2px_rgba(12,75,156,1)]'} px-2 sm:px-4 w-[150px] h-fit rounded-2xl font-Roboto text-[#E3E3E3] text-base transition-all`} onClick={() => handleFollow(profileSuggestion.userId)}>{isFollowed ? 'Followed' : 'Follow'}</button>
        </div> 
    )

};

export default Suggestion;