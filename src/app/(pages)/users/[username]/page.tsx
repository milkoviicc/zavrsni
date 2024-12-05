'use client';
import { Friendship, Profile, User } from '@/src/app/types/types';
import { Avatar, Flex } from '@radix-ui/themes';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation'
import { Router } from 'next/router';
import React, { useEffect, useState } from 'react'

const UserProfile = () => {

    const path = usePathname();
    const router = useRouter();
    const userName = path.slice(7, 100);
    const [user, setUser] = useState<Profile | null>();
    const [loggedUser, setLoggedUser] = useState<User | null>(null);
    const [friendStatus, setFriendStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [followStatus, setFollowStatus] = useState('');

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
                const res = await axios.get<User[]>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles');
                const profile = res.data.find((p) => p.username === userName);
                const response = await axios.get<Profile>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/${profile?.userId}`)
                if (response.status === 200) {
                    setUser(response.data);
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
                const res = await axios.get<Friendship[]>(
                    `https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/${loggedUser.userId}`
                );

                const isFriend = res.data.find((friend) => friend.user.userId === user.userId);
                if (isFriend) {
                    setFriendStatus('friends');
                } else {
                    const sentRequests = await axios.get<Friendship[]>(
                        'https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/sent'
                    );

                    const receivedRequests = await axios.get<Friendship[]>(
                        'https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/received'
                    );

                    const isFriendRequestSent = sentRequests.data.find((req) => req.user.userId === user.userId);
                    const isFriendRequestReceived = receivedRequests.data.find((req) => req.user.userId === user.userId);

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
                `https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/send/${user.userId}`
            );

            if (res.status === 200) {
                setFriendStatus('sent');
                follow();
            }
        } catch (err) {
            console.error('Failed to send friend request:', err);
        }
    };

    const acceptRequest = async () => {
        try {
            const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/accept/${user?.userId}`);

            if(res.status === 200) {
                setFriendStatus('friends');
                follow();
            }
        } catch(err) {
            console.error(err);
        }
    }

    const declineRequest = async () => {
        try {
            const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/friend-requests/decline/${user?.userId}`);

            if(res.status === 200) {
                setFriendStatus('not friends');
            }
        } catch(err) {
            console.error(err);
        }
    }

    const unFriend = async () => {
        try {
            const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/delete/${user?.userId}`);
            if(res.status === 200) {
                setFriendStatus('not friends');
                unfollow();
                window.location.reload();
            }
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const checkFollowing = async () => {
            if(!user) return;
            try {

                const res = await axios.get(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/friendship-status/${user?.userId}`);

                const resData: { userId: string; isFollowed: boolean; friendshipStatus: number } = res.data;
    
                if (resData.isFollowed) {
                    setFollowStatus('following');
                } else {
                    setFollowStatus('not following');
                }
            } catch (err) {
                console.error('Failed to fetch following status:', err);
            }
        };
        checkFollowing();
    }, [user]);
    

    const follow = async () => {
        try {
            const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/follows/add-follow/${user?.userId}`);

            if(res.status === 200) {
                setFollowStatus('following');
                setUser((prevUserData) => prevUserData  ? {...prevUserData, followers: prevUserData.followers + 1} : prevUserData);
            }
            
        } catch(err) {
            console.error(err);
        }
    }

    const unfollow = async () => {
        try {

            const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/follows/unfollow/${user?.userId}`);
            
            if(res.status === 200) {
                setFollowStatus('not following');
                setUser((prevUserData) => prevUserData  ? {...prevUserData, followers: prevUserData.followers - 1} : prevUserData);
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
            {followStatus === 'following' ? (
                <div>
                    <button onClick={() => unfollow()}>Unfollow</button>
                </div>
            ) : (
                <div>
                    <button onClick={() => follow()}>Follow</button>
                </div>
            )}
            <h1>Followers: {user.followers}</h1>
            <h1>Following: {user.following}</h1>
        </div>
    </div>
  )
}

export default UserProfile