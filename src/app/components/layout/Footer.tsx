'use client'

import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {

    return (
        <div className="bg-[#222222] h-[80px] w-full shadow-[0px_-0.5px_20.16px_0px_rgba(0,0,0,0.26)] z-[100]">
            <div className="flex justify-evenly items-center h-full text-center">
                <p className="text-center text-sm font-bold font-Roboto text-[#D0D0D0] px-2 w-full">Developed by Milkovic & Novosel &nbsp;&nbsp;&nbsp;&nbsp;© 2024</p>
                <div className="flex gap-4 w-full justify-center"> 
                    <a href="https://instagram.com" className="text-2xl hover:text-blue-800 text-[#D0D0D0] transition-all"><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="https://x.com" className="text-2xl hover:text-blue-800 text-[#D0D0D0] transition-all"><FontAwesomeIcon icon={faTwitter} /></a>
                    <a href="https://linkedin.com" className="text-2xl hover:text-blue-800 text-[#D0D0D0] transition-all"><FontAwesomeIcon icon={faLinkedin} /></a>
                </div>
            </div>
        </div>
    )
}
