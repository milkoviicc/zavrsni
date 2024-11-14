/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, {useEffect, useState} from "react"
import { useAuth } from '@/src/app/context/AuthProvider';
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUserGroup, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {

    // prosljedjuje mi se user state i funkcija logout iz AuthProvider.tsx

    const {user, logout} = useAuth();

    // nextJs router za mjenjanje path-a
    const router = useRouter();

    // ukoliko je user state null vraća se null (kao da navbar ne postoji uopće)
    if(!user) return null;

    // ukoliko je user state User vraća se sve ispod
    
    return (
        <div className="border-1 border-black bg-[#f5f4f4] rounded-md shadow-lg h-[75px] fixed top-0 w-full">
            <div className="flex justify-center items-center gap-2 h-full w-full">
                <Button variant="linkHover1" onClick={() => router.push('/')} className="uppercase"><svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="home"><rect width="24" height="24" opacity="0"/><path d="M20.42 10.18L12.71 2.3a1 1 0 0 0-1.42 0l-7.71 7.89A2 2 0 0 0 3 11.62V20a2 2 0 0 0 1.89 2h14.22A2 2 0 0 0 21 20v-8.38a2.07 2.07 0 0 0-.58-1.44zM10 20v-6h4v6zm9 0h-3v-7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H5v-8.42l7-7.15 7 7.19z"/></g></g></svg>Home</Button>
                <Button variant="linkHover1" onClick={() => router.push('/people')} className="uppercase"><FontAwesomeIcon icon={faUserGroup} className="text-md px-1 -mt-1" />People</Button>
                <Button variant="linkHover1" onClick={() => router.push(`/profile/${user.username}`)} className="uppercase"><FontAwesomeIcon icon={faUser} className="text-md px-1 -mt-1" />Profile</Button>
                <Button variant="linkHover1" onClick={logout} className="uppercase"><FontAwesomeIcon icon={faRightFromBracket} className="text-md px-1 -mt-1" />Logout</Button>
            </div>
        </div>
    )
};