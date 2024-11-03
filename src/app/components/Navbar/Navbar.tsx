/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, {useEffect, useState} from "react"
import { useAuth } from '@/app/context/AuthProvider';
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUserGroup, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {

    const {user, logout} = useAuth();


    const router = useRouter();

    if(!user) return null
    
    return (
        <div className="border-1 border-black bg-[#f5f4f4] rounded-md shadow-lg h-[75px] fixed w-full">
            <div className="flex justify-center items-center gap-2 h-full w-full">
                <Button variant="linkHover1" onClick={() => router.push('/')} className="uppercase"><FontAwesomeIcon icon={faHouse} className="text-md px-1 -mt-1" />Home</Button>
                <Button variant="linkHover1" onClick={() => router.push('/people')} className="uppercase"><FontAwesomeIcon icon={faUserGroup} className="text-md px-1 -mt-1" />People</Button>
                <Button variant="linkHover1" onClick={() => router.push(`/profile/${user.username}`)} className="uppercase"><FontAwesomeIcon icon={faUser} className="text-md px-1 -mt-1" />Profile</Button>
                <Button variant="linkHover1" onClick={logout} className="uppercase"><FontAwesomeIcon icon={faRightFromBracket} className="text-md px-1 -mt-1" />Logout</Button>
            </div>
        </div>
    )
};