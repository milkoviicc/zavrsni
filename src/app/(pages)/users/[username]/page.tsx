'use client';
import { FriendRequest, Profile, User } from '@/src/app/types/types';
import { Avatar, Flex } from '@radix-ui/themes';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation'
import { Router } from 'next/router';
import React, { useEffect, useState } from 'react'

const UserProfile = () => {

    const path = usePathname();
    const router = useRouter();
    const userName = path.slice(7, 100);
    const [user, setUser] = useState<Profile | null>(null);
    const [loggedUser, setLoggedUser] = useState<User | null>(null);
    const [friendStatus, setFriendStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch logged-in user data from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setLoggedUser(JSON.parse(storedUser));
        }
    }, []);

    // Fetch user profile
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get<Profile[]>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles');
                const profile = res.data.find((p) => p.username === userName);
                if (profile) {
                    setUser(profile);
                }
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
            }
        };

        getUser();
    }, [userName]);

    // Check friendship status
    useEffect(() => {
        const checkFriendship = async () => {
            if (!loggedUser || !user) return;

            try {
                setLoading(true);
                const res = await axios.get<FriendRequest[]>(
                    `https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/${loggedUser.id}`
                );

                const isFriend = res.data.find((friend) => friend.user.id === user.id);
                if (isFriend) {
                    setFriendStatus('friends');
                } else {
                    const sentRequests = await axios.get<FriendRequest[]>(
                        'https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/sent'
                    );

                    const receivedRequests = await axios.get<FriendRequest[]>(
                        'https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/received'
                    );

                    const isFriendRequestSent = sentRequests.data.find((req) => req.user.id === user.id);
                    const isFriendRequestReceived = receivedRequests.data.find((req) => req.user.id === user.id);

                    setFriendStatus(isFriendRequestSent ? 'sent' : isFriendRequestReceived ? 'received' : 'not friends');
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to check friendship status:', err);
            }
        };

        checkFriendship();
    }, [loggedUser, user, friendStatus]);

    // Send friend request
    const sendFriendRequest = async () => {
        if (!user) return;

        try {
            const res = await axios.post(
                `https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/send/${user.id}`
            );

            if (res.status === 200) {
                setFriendStatus('sent');
            }
        } catch (err) {
            console.error('Failed to send friend request:', err);
        }
    };

    const acceptRequest = async () => {
        try {
            const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/accept/${user?.id}`);

            if(res.status === 200) {
                setFriendStatus('friends');
            }
        } catch(err) {
            console.error(err);
        }
    }

    const declineRequest = async () => {
        try {
            const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/decline/${user?.id}`);

            if(res.status === 200) {
                setFriendStatus('not friends');
            }
        } catch(err) {
            console.error(err);
        }
    }

    const unFriend = async () => {
        try {
            const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/delete/${user?.id}`);
            if(res.status === 200) {
                setFriendStatus('not friends');
            }
        } catch(err) {
            console.error(err);
        }
    }

    // Render loading or not found states
    if (!user) return <h1 className="text-center my-40">User not found</h1>;
    

  return (
    <div className='h-full flex flex-col gap-8 justify-center items-center'>
        <div>
            <h1>{user?.username}</h1>
            <Flex gap="2">
                <Avatar src={`${user?.pictureUrl}`} style={{ width: '60px', height: '60px', borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
            </Flex>
            {loading ? 'Loading...'
            : friendStatus === 'sent' ? <h1>Friend request sent</h1>
            : friendStatus === 'received' ? (
                <div className='flex gap-2'>
                    <button onClick={acceptRequest}>Accept</button>
                    <button onClick={declineRequest}>Decline</button>
                </div>
            )
            : friendStatus === 'friends' ? (
                <div>
                    <button onClick={unFriend}>Unfriend</button> 
                </div>
            )
            : <button onClick={() => sendFriendRequest()}>Add friend</button>}
        </div>
    </div>
  )
}

export default UserProfile