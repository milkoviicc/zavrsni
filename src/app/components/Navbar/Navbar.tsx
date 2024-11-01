/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, {useEffect, useState} from "react"
import { useAuth } from '@/app/context/AuthProvider';
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Navbar() {

    const {user, logout} = useAuth();


    const router = useRouter();

    if(!user) return null
    
    return (
        <div className="border-1 border-black bg-[#f5f4f4] rounded-md shadow-lg h-[75px]">
            <div className="flex justify-evenly items-center h-full">
                <h1>Social network</h1>
                <div>
                    <button onClick={logout}>Logout</button>
                    <button className="mx-2" onClick={() => router.push(`/profile/${user.id}`)}>{user.username}</button>
                </div>
            </div>
        </div>
    )
};