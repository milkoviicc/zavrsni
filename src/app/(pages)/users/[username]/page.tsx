'use client';
import { Profile, User } from '@/src/app/types/types';
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

    const getUser = async () => {
        try {
            const res = await axios.get<Profile[]>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles');

            const user: Profile | undefined = res.data.find((profile) => profile.username === userName);

            if(user) {
                setUser(user);
            }
        } catch(err) {
            console.error(err);
        }
    }
   
    useEffect(() => {
        getUser();
    })

    if(!user) return <h1 className='text-center my-40'>User not found</h1>
    

  return (
    <div className='h-full flex flex-col gap-8 justify-center items-center'>
        <div>
            <h1>{user?.username}</h1>
            <Flex gap="2">
                <Avatar src={`${user?.pictureUrl}`} style={{ width: '60px', height: '60px', borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
            </Flex>
            <button>Add friend</button>
        </div>
    </div>
  )
}

export default UserProfile