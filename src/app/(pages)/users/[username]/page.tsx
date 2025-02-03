'use client';
import { Friendship, FriendshipStatus, Profile, User } from '@/src/app/types/types';
import { Avatar, Flex } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation'
import { Router } from 'next/router';
import React, { useEffect, useState } from 'react'

const UserProfile = () => {

    const path = usePathname();

    const router = useRouter();

    const [user, setUser] = useState<Profile | null>();
    const [loggedUser, setLoggedUser] = useState<User | null>(null);
    const [friendStatus, setFriendStatus] = useState(0);
    const [loading, setLoading] = useState(false);
    const [followStatus, setFollowStatus] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const userName = path.slice(7, 100);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if(user) {
            const userData: User = JSON.parse(user);
            setLoggedUser(userData);
        }
    }, []);
    
    const getUser = async (userName: string) => {
        try {
            const res = await axios.get<Profile>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/username/${userName}`);
            setUser(res.data);
            return res.data;
        } catch (err) {
            console.error('Failed to fetch user profile:', err);
        }
    };

    const getStatus = async () => {
        try {
            const res = await axios.get<FriendshipStatus>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/friendship-status/${user?.userId}`)
            setFollowStatus(res.data.isFollowed);
            setFriendStatus(res.data.friendshipStatus);
            return res.data;
        } catch(err) {
            console.error('Failed to fetch user status:', err);
        }
    }


    const getUserQuery = useQuery({queryKey: ["userQuery", userName], queryFn:() => getUser(userName)});
    const getUserStatus = useQuery({queryKey: ["userStatus", userName], queryFn:() => getStatus(), enabled: user !== undefined});

    useEffect(() => {
        if (getUserQuery.error) {
            setNotFound(true);
        }
        if (getUserQuery.isLoading) {
            setLoading(true);
        }
    }, [getUserQuery.error, getUserQuery.isLoading]);

    // Send friend request
    const sendFriendRequest = async () => {
        if (!user) return;

        setFriendStatus(1);
        try {
            const res = await axios.post(
                `https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/send/${user.userId}`
            );

        } catch (err) {
            console.error('Failed to send friend request:', err);
        }
    };

    const acceptRequest = async () => {

        setFriendStatus(3);
        try {
            const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/accept/${user?.userId}`);

            if(res.status === 200) {
            }
        } catch(err) {
            console.error(err);
        }
    }

    const declineRequest = async () => {
        setFriendStatus(0);
        try {
            const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/decline/${user?.userId}`);
        } catch(err) {
            console.error(err);
        }
    }

    const unFriend = async () => {
        setFriendStatus(0);
        try {
            const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/delete/${user?.userId}`);
        } catch(err) {
            console.error(err);
        }
    }
    

    const follow = async () => {
        setFollowStatus(true);
        try {
            const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/follows/add-follow/${user?.userId}`);

            if(res.status === 200) {
                setUser((prevUserData) => prevUserData  ? {...prevUserData, followers: prevUserData.followers + 1} : prevUserData);
            }
            
        } catch(err) {
            console.error(err);
        }
    }

    const unfollow = async () => {
        setFollowStatus(false);
        try {

            const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/follows/unfollow/${user?.userId}`);
            
            if(res.status === 200) {

                setUser((prevUserData) => prevUserData  ? {...prevUserData, followers: prevUserData.followers - 1} : prevUserData);
            }
        } catch(err) {
            console.error(err);
        }
    }

  return (
    <div className='h-full flex flex-col gap-8 justify-center items-center'>
        {getUserQuery.isLoading ? <h1>Loading...</h1> : getUserQuery.error || !getUserQuery.data ? <h1>User not found!</h1> : (
            <div>
                <h1>{getUserQuery.data.username}</h1>
                <Flex gap="2">
                    <Avatar src={`${getUserQuery.data.pictureUrl}`} style={{ width: '60px', height: '60px', borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
                </Flex>
                
                {getUserStatus.isLoading ? 'Loading...'
                : friendStatus === 1 ? <h1>Friend request sent</h1>
                : friendStatus === 2 ? (
                    <div className='flex gap-2'>
                        <button onClick={acceptRequest}>Accept</button>
                        <button onClick={declineRequest}>Decline</button>
                    </div>
                )
                : friendStatus === 3 ? (
                    <div>
                        <button onClick={unFriend}>Unfriend</button> 
                    </div>
                )
                : <button onClick={() => sendFriendRequest()}>Add friend</button>}
                { followStatus ? (
                    <div>
                        <button onClick={() => unfollow()}>Unfollow</button>
                    </div>
                ) : (
                    <div>
                        <button onClick={() => follow()}>Follow</button>
                    </div>
                )}
                <h1>Followers: {getUserQuery.data.followers}</h1>
                <h1>Following: {getUserQuery.data.following}</h1>
            </div>
        )}
    </div>
  )
}

export default UserProfile