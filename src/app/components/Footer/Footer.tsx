'use client'

import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {

    return (
        <div className="bg-[#222222] h-[75px] w-full hidden">
            <div className="flex justify-evenly items-center h-full">
                <p className="text-sm font-bold flex items-center text-[#D0D0D0]">milkoviicc <span className="mt-1 px-2">©</span> 2024</p>
                <div className="flex gap-4"> 
                    <a href="https://instagram.com" className="text-2xl hover:text-blue-800 text-[#D0D0D0] transition-all"><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="https://x.com" className="text-2xl hover:text-blue-800 text-[#D0D0D0] transition-all"><FontAwesomeIcon icon={faTwitter} /></a>
                    <a href="https://linkedin.com" className="text-2xl hover:text-blue-800 text-[#D0D0D0] transition-all"><FontAwesomeIcon icon={faLinkedin} /></a>
                </div>
            </div>
        </div>
    )
}