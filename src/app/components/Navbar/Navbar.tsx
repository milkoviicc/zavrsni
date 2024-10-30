'use client';

import React, {useEffect, useState} from "react"
import { useAuth } from '@/app/context/AuthProvider';
import axios from "axios";
import { User } from "@/app/types/types";

export default function Navbar() {

    const {isAuthenticated, fullyRegistered} = useAuth();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if(token && fullyRegistered && isAuthenticated) {
            axios.get<User>('/api/user', {
                headers: {Authorization: `Bearer ${token}`},
            }).then((res) => {
                setUser(res.data);
            }).catch((err) => {
                console.log('Error: ',err);
            });
        } else {
            console.log('User is not authenticated or token is missing');
        }
    }, [fullyRegistered, isAuthenticated])
    
    return (
        <div className="border-1 border-black bg-[#f5f4f4] rounded-md shadow-lg h-[75px]">
            <div className="flex justify-evenly items-center h-full">
                <h1>Social network</h1>
                <div>
                    <button>Logout</button>
                    <button>{user?.username}</button>
                </div>
            </div>
        </div>
    )
};