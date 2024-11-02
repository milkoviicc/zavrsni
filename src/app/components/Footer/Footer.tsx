'use client'

import React from "react"
import {useRouter} from 'next/navigation'

export default function Footer() {

    const router = useRouter();
    return (
        <div className="border-1 border-black bg-[#f5f4f4] rounded-md shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]  h-[75px]">
            <div className="flex justify-evenly items-center h-full">
                <div className="flex gap-2">
                    <button onClick={() => router.push('/')} className="text-blue-600 hover:text-blue-800 transition-all">Home</button>
                    <button onClick={() => router.push('/')} className="text-blue-600 hover:text-blue-800 transition-all">Profile</button>
                </div>
                <p className="text-sm font-bold flex items-center"><span className="mt-1 px-2">©</span> milkoviicc//novosel 2024</p>
                <div className="flex gap-2"> 
                    <a href="https://instagram.com" className="text-blue-600 hover:text-blue-800 transition-all">Instagram</a>
                    <a href="https://x.com" className="text-blue-600 hover:text-blue-800 transition-all">Twitter</a>
                    <a href="https://linkedin.com" className="text-blue-600 hover:text-blue-800 transition-all">Linkedin</a>
                </div>
            </div>
        </div>
    )
}