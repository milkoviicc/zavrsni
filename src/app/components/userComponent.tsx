import { Avatar, Flex } from '@radix-ui/themes'
import React from 'react'
import { Profile, User } from '../types/types'
import { useRouter } from 'next/navigation';

const UserComponent = ({user}: {user: User}) => {
  const router = useRouter();
  return (
    <button className="hover:cursor-pointer flex gap-2 py-2 items-center" onClick={() => router.push(`/users/${user.username}`)}>
        <Flex gap="2">
            <Avatar src={`${user.pictureUrl}?${new Date().getTime()}`} style={{ width: '45px', height: '45px', borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
        </Flex>
        <div className="flex flex-col h-full items-start justify-center">
            <h1 className="text-[#EFEFEF] font-[400] font-Roboto text-base max-w-[120px] truncate whitespace-nowrap" title={`${user.firstName} ${user.lastName}`}>{user.firstName} {user.lastName}</h1>
            <p className="text-[#888888] max-w-[120px] text-base truncate whitespace-nowrap">@{user.username}</p>
        </div>    
    </button>
  )
}

export default UserComponent