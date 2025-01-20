import { Avatar, Flex } from '@radix-ui/themes'
import React from 'react'
import { Profile } from '../types/types'
import { useRouter } from 'next/navigation';

const UserComponent = ({user}: {user: Profile}) => {
  const router = useRouter();
  return (
    <button className="hover:cursor-pointer flex gap-2 py-2 items-center" onClick={() => router.push(`/users/${user.username}`)}>
        <Flex gap="2">
            <Avatar src={`${user.pictureUrl}?${new Date().getTime()}`} style={{ width: '60px', height: '60px', borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
        </Flex>
        <div className="flex flex-col h-full items-start justify-center gap-3">
            <h1 className="text-[#EFEFEF] font-[400] font-Roboto leading-[8.23px] text-lg">{user.firstName} {user.lastName}</h1>
            <p className="text-[#888888] leading-[5.66px]">@{user.username}</p>
        </div>    
    </button>
  )
}

export default UserComponent