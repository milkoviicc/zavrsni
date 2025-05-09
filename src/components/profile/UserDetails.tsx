/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FriendshipStatus, Profile, User } from '@/src/types/types';
import { followsApi, friendsApi } from '@/src/lib/utils';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthProvider';

const UserDetails = ({pathUser, friendship, mutualFriends, popular}: {pathUser: Profile, friendship: FriendshipStatus | null, mutualFriends: User[] | null, popular: User[]}) => {

  const [shortUsername, setShortUsername] = useState('');
  const [friendshipStatus, setFriendshipStatus] = useState(0);
  const [isFollowed, setIsFollowed] = useState(false);
  const [popularUsers, setPopularUsers] = useState<User[]>([]);
  const {user} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(pathUser && pathUser.firstName && pathUser.lastName) {
      setShortUsername(pathUser.firstName.slice(0,1) + pathUser.lastName.slice(0,1));
    }

    if(friendship) {
      setFriendshipStatus(friendship.friendshipStatus);
      setIsFollowed(friendship.isFollowed);
    }

    if(popular && user) {
      const fillUsers = popular.filter(popularUser => popularUser.userId !== pathUser.userId);
      const newPopularUsers = fillUsers.filter(filledUser => filledUser.userId !== user.userId).slice(0,4);
      setPopularUsers(newPopularUsers);
    }
  }, [pathUser, friendship, popular]);

  const handleFollow = async (id: string) => {
    if(isFollowed) {
      setIsFollowed(false);
      pathUser.followers--;
    } else {
      setIsFollowed(true);
      pathUser.followers++;
    }
    try {
        if(isFollowed) {
          const res = await followsApi.unfollow(id);
        } else {
          const res = await followsApi.addFollow(id);
        }
    } catch(err) {
        console.error(err);
    }
  }

  const acceptRequest = async () => {

    setFriendshipStatus(3);
    try {
      const res = await friendsApi.acceptFriendRequest(pathUser.userId);
    } catch(err) {
      console.error(err);
    }
  }

  const declineRequest = async () => {
      setFriendshipStatus(0);
      try {
        const res = await friendsApi.declineFriendRequest(pathUser.userId);
      } catch(err) {
          console.error(err);
      }
  }

  const addFriend = async () => {
    setFriendshipStatus(1);
    try {
      const res = await friendsApi.sendFriendRequest(pathUser.userId);
    } catch(err) {
      console.error(err);
    }
  }

  const unfriend = async () => {
    setFriendshipStatus(0);
    try {
      const res = await friendsApi.deleteFriend(pathUser.userId);
    } catch(err) {
      console.error(err);
    }
  }

  const unsendFriendReq = async () => {
    setFriendshipStatus(0);
    try {
      const res = await friendsApi.declineFriendRequest(pathUser.userId);
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className='xl:hidden flex justify-center w-screen pt-8'>
        <div className='flex w-screen relative justify-center gap-10 px-4 py-4'>
          <div className='w-[350px] sm:w-[580px] md:w-[716px] lg:w-[765px] xl:hidden flex flex-col justify-center items-center gap-2 px-2 lg:px-8 py-4 rounded-lg shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0_,_0.26)]'>
            <div className='flex items-center justify-center gap-1'>
              <Avatar className='w-[125px] h-[125px] relative shrink-0 overflow-x-hidden rounded-full shadow-[0px_5px_5px_0px_rgba(0,_0,_0_,_0.25)]'>
                <AvatarImage src={`${pathUser?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" /><AvatarFallback>{shortUsername}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col justify-center pl-4'>
                <h1 className='text-[#DFDEDE] font-Roboto text-2xl'>{pathUser.firstName} {pathUser.lastName}</h1>
                <p className='text-[#888888] font-Roboto text-xl'>@{pathUser.username}</p>
              </div>
            </div>
            <div className='flex flex-col w-full'>
              <div className='flex flex-col gap-2 justify-center'>
                <div className='flex flex-col items-center px-4 py-2 gap-4'>
                  <p className='text-center break-words hyphens-auto text-[#888888] font-Roboto text-sm w-[80%]'>{pathUser.description ? `${pathUser.description}` : 'No description yet! You can add one down below.'}</p>
                </div>
                <div className='flex items-center justify-evenly gap-4'>
                  <p className='text-[#888888] text-center font-Roboto text-sm'>{pathUser.occupation ? `${pathUser.occupation}` : 'No occupation yet!'}</p>
                  <div className='flex gap-4'>
                    <div className='flex items-center gap-2'>
                      <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm'>Followers</p>
                      <span className='text-[#888888] text-lg'>{pathUser.followers}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm'>Following</p>
                      <span className='text-[#888888] text-lg'>{pathUser.following}</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className='bg-[#515151] h-[1px] w-full mt-2'></span>
            </div>
            <div className='flex w-full items-center gap-2'>
              <div className='flex flex-col w-full h-full gap-2'>
                <p className='text-[#808080] text-[11px] sm:text-sm font-Roboto text-center'>{friendshipStatus && friendshipStatus === 0 ? 'You are not friends' : friendshipStatus === 1 ? 'You sent a friend request' : friendshipStatus === 2 ? 'Sent you a friend request' : 'Friends'}</p>
                {friendshipStatus === 0 ? (
                  <div className='w-full px-2 flex justify-center gap-4'>
                    <button onClick={() => addFriend()} className='px-4 py-1 w-fit rounded-full font-Roboto font-normal text-sm bg-[#1565CE] transition-all shadow-[0px_1px_2px_0px_rgba(110, 122, 248, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)] hover:opacity-90 text-[#E3E3E3] cursor-pointer'>Add friend</button>
                  </div>
                ) : friendshipStatus === 1 ? (
                  <div className='w-full px-2 flex justify-center gap-4'>
                    <button onClick={() => unsendFriendReq()} className='px-4 py-1 w-fit h-full rounded-full font-Roboto font-normal text-sm bg-[#CA3C3C] transition-all shadow-[1px_1px_3px_0px_rgba(202, 60, 60, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(202,60,60,0.4)] hover:opacity-90 text-[#E3E3E3] cursor-pointer'>Unsend</button>
                  </div>
                ) : friendshipStatus === 2 ? (
                  <div className='w-full px-2 flex flex-col gap-4'>
                    <div className='w-full flex justify-between gap-4'>
                      <button onClick={() => acceptRequest()} className='px-4 py-1 w-full h-fit rounded-full font-Roboto font-normal text-sm bg-[#1565CE] transition-all shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)] hover:opacity-90 text-[#E3E3E3]'>Accept</button>
                      <button onClick={() => declineRequest()} className='px-4 py-1 w-full h-fit rounded-full font-Roboto font-normal text-sm bg-[#CA3C3C] transition-all shadow-[1px_1px_3px_0px_rgba(202, 60, 60, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(202,60,60,0.4)]  hover:opacity-90 text-[#E3E3E3] cursor-pointer'>Decline</button>
                    </div>
                  </div>
                ) : (
                  <div className='w-full px-2 flex justify-center gap-4'>
                    <button onClick={() => unfriend()} className='px-4 py-1 w-fit h-fit rounded-full font-Roboto font-normal text-sm bg-[#CA3C3C] transition-all shadow-[1px_1px_3px_0px_rgba(202, 60, 60, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(202,60,60,0.4)] hover:opacity-90 text-[#E3E3E3] cursor-pointer'>Unfriend</button>
                  </div>
                )}
              </div>
              <div className='w-full flex flex-col justify-center items-center gap-2'>
                <p className={`font-Roboto text-[#808080] text-[11px] sm:text-sm `}>{isFollowed ? `You are following ` : `You're not following `}{pathUser.firstName}</p>
                <button className={`${isFollowed ? 'bg-[#CA3C3C] shadow-[1px_1px_3px_0px_rgba(202, 60, 60, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(202,60,60,0.4)]' : 'bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)]'} px-4 sm:px-4 py-1 w-fit h-fit rounded-2xl font-Roboto text-[#E3E3E3] text-sm transition-all hover:opacity-90 cursor-pointer`} onClick={() => handleFollow(pathUser.userId)}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
              </div>
            </div>
            <span className='bg-[#515151] h-[1px] w-full mt-2'></span>
            <div className='w-full h-full py-2 flex flex-col items-center'>
              <h3 className='font-Roboto text-[#808080] mt-2'>{mutualFriends?.length !== 0 ? 'Mutual friends' : 'You might know'}</h3>
              <div className='grid grid-cols-2 gap-2 px-1 w-full place-items-center'>
                {mutualFriends?.length !== 0 ? mutualFriends?.map((profile, index) => (
                  <div key={profile.userId} className="hover:cursor-pointer flex gap-2 py-2 items-center " onClick={() => router.push(`/users/${profile.username}`)}>
                    <Avatar className='w-[45px] h-[45px] 2k:w-[55px] 2k:h-[55px] rounded-full shadow-[0px_5px_5px_0px_rgba(0,_0,_0_,_0.25)]'>
                        <AvatarImage src={`${profile.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover"  /><AvatarFallback>{profile.username.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col h-full items-start justify-center w-full">
                        <h1 className="text-[#EFEFEF] font-[400] font-Roboto text-sm 2xl:text-base 2k:text-lg truncate whitespace-nowrap" title={`${profile.firstName} ${profile.lastName}`}>{profile.firstName} {profile.lastName}</h1>
                        <p className="text-[#888888] text-sm 2xl:text-base 2k:text-lg truncate whitespace-nowrap">@{profile.username}</p>
                    </div>    
                  </div>
                )) : 
                popularUsers?.map((profile, index, array) => {
                  const isLastOdd = array.length % 2 !== 0 && index === array.length -1;
                  return (
                    <div key={profile.userId} className={`hover:cursor-pointer flex gap-2 py-2 items-center ${isLastOdd ? "col-span-2 justify-center" : "w-fit"}`} onClick={() => router.push(`/users/${profile.username}`)}>
                        <Avatar className='w-[45px] h-[45px] 2xl:w-[55px] 2xl:h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full'>
                            <AvatarImage src={`${profile.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{profile.username.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col h-full items-start justify-center w-fit">
                            <h1 className="text-[#EFEFEF] font-[400] font-Roboto text-sm 2xl:text-base 2k:text-lg max-w-[80px] sm:max-w-full truncate whitespace-nowrap" title={`${profile.firstName} ${profile.lastName}`}>{profile.firstName} {profile.lastName}</h1>
                            <p className="text-[#888888] text-sm 2xl:text-base 2k:text-lg truncate whitespace-nowrap">@{profile.username}</p>
                        </div>    
                    </div>
                  )})}
              </div>
            </div>
        </div>
      </div>
    </div>
    <div className="xl:flex hidden flex-col fixed 2xl:left-24 xl:left-0 self-start gap-0 xl:w-[225px] w-[180px] 2xl:w-[245px] lg:h-[400px] xl:h-[520px] 2xl:h-[600px] text-center rounded-lg py-4 xl:translate-x-[20px] 2xl:translate-x-0 2k:translate-x-[40px] xl:translate-y-0 2xl:translate-y-[40px] userDetails2k">
      <div className='w-full flex flex-col justify-center items-center shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525]'>
        <div className='flex flex-col py-1 gap-2 w-full'>
          <div className='flex px-3'>
            <Avatar className='w-[45px] h-[45px] 2xl:w-[65px] 2xl:h-[65px] rounded-full shadow-[0px_5px_5px_0px_rgba(0,_0,_0_,_0.25)] myProfileAvatar2k'>
              <AvatarImage src={`${pathUser?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover"  /><AvatarFallback>{shortUsername}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col justify-center items-start px-2 2k:px-4'>
              <h1 className='text-[#DFDEDE] font-Roboto text-sm 2xl:text-base myProfileUser'>{pathUser.firstName} {pathUser.lastName}</h1>
              <p className='text-[#888888] font-Roboto text-sm 2xl:text-base myProfileUser'>@{pathUser.username}</p>
            </div>
          </div>
          <div className='flex flex-col px-3 py-2 gap-4'>
            <p className='text-left break-words hyphens-auto text-[#888888] px-[5px] font-Roboto text-xs 2xl:text-sm myProfileText'>{pathUser.description ? `${pathUser.description}` : 'No description yet! You can add one down below.'}</p>
            <p className='text-[#888888] text-center font-Roboto text-xs 2xl:text-sm myProfileText'>{pathUser.occupation ? `${pathUser.occupation}` : 'No occupation yet!'}</p>
          </div>
          <div className='flex justify-evenly gap-4'>
            <div className='flex items-center gap-2'>
            <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm myProfileText'>Followers</p>
            <span className='text-[#888888] text-lg'>{pathUser.followers}</span>
            </div>
            <div className='flex items-center gap-2'>
            <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm myProfileText'>Following</p>
            <span className='text-[#888888] text-lg'>{pathUser.following}</span>
            </div>
          </div>
          <span className="bg-[#515151] h-[1px] w-full"></span>
        </div>
        <div className='w-full pt-2 pb-4'>
          <p className='text-[#808080] font-Roboto myProfileUser'>{friendshipStatus === 0 ? 'You are not friends' : friendshipStatus === 1 ? 'You sent a friend request' : friendshipStatus === 2 ? 'Sent you a friend request' : 'Friends'}</p>
          {friendshipStatus === 0 ? (
            <div className='w-full px-2 flex justify-between gap-4 pt-2 text-sm 2xl:text-base'>
              <button onClick={() => addFriend()} className='px-2 py-0 w-full rounded-full font-Roboto font-normal bg-[#1565CE] transition-all shadow-[0px_1px_2px_0px_rgba(110, 122, 248, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)] hover:opacity-90 text-[#E3E3E3] cursor-pointer'>Add friend</button>
              <button className={`${isFollowed ? 'bg-[#CA3C3C] shadow-[1px_1px_3px_0px_rgba(202, 60, 60, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(202,60,60,0.4)]' : 'bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)]'} px-2 sm:px-4 w-full h-fit rounded-2xl font-Roboto text-[#E3E3E3] transition-all  hover:opacity-90 cursor-pointer`} onClick={() => handleFollow(pathUser.userId)}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
            </div>
          ) : friendshipStatus === 1 ? (
            <div className='w-full px-2 flex justify-between gap-4 pt-2'>
              <button onClick={() => unsendFriendReq()} className='px-2 py-0 w-full h-full rounded-full font-Roboto font-normal bg-[#CA3C3C] transition-all shadow-[1px_1px_3px_0px_rgba(202, 60, 60, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(0,0,0,0.2)] hover:opacity-90 text-[#E3E3E3] cursor-pointer'>Unsend</button>
              <button className={`${isFollowed ? 'bg-[#CA3C3C] shadow-[1px_1px_3px_0px_rgba(202, 60, 60, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(202,60,60,0.4)]' : 'bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)]'} px-2 sm:px-4 w-full h-fit rounded-2xl font-Roboto text-[#E3E3E3] transition-all  hover:opacity-90 cursor-pointer`} onClick={() => handleFollow(pathUser.userId)}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
            </div>
          ) : friendshipStatus === 2 ? (
            <div className='w-full px-2 flex flex-col gap-4 pt-2'>
              <div className='w-full flex justify-between gap-4'>
                <button onClick={() => acceptRequest()} className='px-2 py-0 w-full h-fit rounded-full font-Roboto font-normal bg-[#1565CE] transition-all shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)] hover:opacity-90 text-[#E3E3E3] cursor-pointer'>Accept</button>
                <button onClick={() => declineRequest()} className='px-2 py-0 w-full h-fit rounded-full font-Roboto font-normal bg-[#CA3C3C] transition-all shadow-[1px_1px_3px_0px_rgba(202, 60, 60, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(202,60,60,0.4)]  hover:opacity-90 text-[#E3E3E3] cursor-pointer'>Decline</button>
              </div>
              <div>
                <button className={`${isFollowed ? 'bg-[#CA3C3C] shadow-[1px_1px_3px_0px_rgba(202, 60, 60, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(202,60,60,0.4)]' : 'bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)]'} px-2 sm:px-4 w-full h-fit rounded-2xl font-Roboto text-[#E3E3E3] transition-all  hover:opacity-90 cursor-pointer`} onClick={() => handleFollow(pathUser.userId)}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
              </div>
            </div>
          ) : (
            <div className='w-full px-2 flex justify-between gap-4 pt-2 text-sm 2xl:text-base'>
              <button onClick={() => unfriend()} className='px-2 py-0 w-full h-fit rounded-full font-Roboto font-normal bg-[#CA3C3C] transition-all shadow-[1px_1px_3px_0px_rgba(202, 60, 60, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(202,60,60,0.4)] hover:opacity-90 text-[#E3E3E3] cursor-pointer'>Unfriend</button>
              <button className={`${isFollowed ? 'bg-[#CA3C3C] shadow-[1px_1px_3px_0px_rgba(202,60,60, 0.25)] hover:shadow-[1px_1px_5px_3px_rgba(202,60,60,0.4)]' : 'bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,1)]'} px-2 sm:px-4 w-full h-fit rounded-2xl font-Roboto text-[#E3E3E3] transition-all hover:opacity-90 cursor-pointer`} onClick={() => handleFollow(pathUser.userId)}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
            </div>
          )}
        </div>
      </div>
      <div className='bg-[#252525] mt-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)]'>
        <h3 className='font-Roboto text-[#808080] mt-2 myProfileUser'>{mutualFriends?.length !== 0 ? 'Mutual friends' : 'You might know'}</h3>
        <span className="bg-[#515151] h-[1px] w-full block my-1"></span>
        <div className='flex flex-col px-6 w-full'>
          {mutualFriends?.length !== 0 ? mutualFriends?.map((profile, index) => (
            <div key={profile.userId} className="hover:cursor-pointer flex gap-2 py-2 items-center " onClick={() => router.push(`/users/${profile.username}`)}>
              <Avatar className='w-[45px] h-[45px] 2xl:w-[45px] 2xl:h-[45px] rounded-full shadow-[0px_5px_5px_0px_rgba(0,_0,_0_,_0.25)] mutualFriends2k'>
                  <AvatarImage src={`${profile.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover"  /><AvatarFallback>{profile.username.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col h-full items-start justify-center w-full">
                  <h1 className="text-[#EFEFEF] font-[400] font-Roboto text-sm 2xl:text-base myProfileUserg truncate whitespace-nowrap" title={`${profile.firstName} ${profile.lastName}`}>{profile.firstName} {profile.lastName}</h1>
                  <p className="text-[#888888] text-sm 2xl:text-base myProfileUser truncate whitespace-nowrap">@{profile.username}</p>
              </div>    
            </div>
          )) : 
          popularUsers?.map((profile, index) => (
            <div key={profile.userId} className="hover:cursor-pointer flex gap-2 py-2 items-center " onClick={() => router.push(`/users/${profile.username}`)}>
                <Avatar className='w-[45px] h-[45px] 2xl:w-[45px] 2xl:h-[45px] 2k:w-[55px] 2k:h-[55px] rounded-full shadow-[0px_5px_5px_0px_rgba(0,_0,_0_,_0.25)]'>
                    <AvatarImage src={`${profile.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" /><AvatarFallback>{profile.username.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col h-full items-start justify-center w-full">
                    <h1 className="text-[#EFEFEF] font-[400] font-Roboto text-sm 2xl:text-base 2k:text-lg truncate whitespace-nowrap" title={`${profile.firstName} ${profile.lastName}`}>{profile.firstName} {profile.lastName}</h1>
                    <p className="text-[#888888] text-sm 2xl:text-base 2k:text-lg truncate whitespace-nowrap">@{profile.username}</p>
                </div>    
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default UserDetails;