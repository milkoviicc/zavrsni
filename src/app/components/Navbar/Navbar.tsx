/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, {useEffect, useState} from "react"
import { useAuth } from '@/src/app/context/AuthProvider';
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUserGroup, faUser, faRightFromBracket, faBell, faGear, faComment } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Avatar, Flex } from "@radix-ui/themes";

export default function Navbar() {

    // prosljedjuje mi se user state i funkcija logout iz AuthProvider.tsx

    const {user, logout} = useAuth();

    // nextJs router za mjenjanje path-a
    const router = useRouter();
    const path = usePathname();

    const [search, setSearch] = useState('');

    // ukoliko je user state null vraća se null (kao da navbar ne postoji uopće)
    if(!user) return null;

    // ukoliko je user state User vraća se sve ispod

    return (
        <div className="border-1 border-black bg-[#f5f4f4] rounded-md shadow-lg h-[75px] fixed top-0 w-full">
            <div className="flex justify-between items-center h-full w-full">
                <div className="w-full flex justify-start ml-10">
                    <div className="flex gap-2">
                        <Flex gap="2">
                            <Avatar src={`${user.profile.pictureUrl}`} style={{ width: '60px', height: '60px', borderRadius: '50%'}} fallback="A" />
                        </Flex>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-black font-[400] font-Roboto">{user.profile.firstName} {user.profile.lastName}</h1>
                            <p className="text-[#595959]">@{user.username}</p>
                        </div>                        
                    </div>
                </div>
                <div className="flex w-full justify-evenly">
                    <button className={`px-0 group`} onClick={() => router.push('/')}><svg width="40" height="40" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_85)"><path d="M13.6117 0.753662H0.841309V13.5241H13.6117V0.753662Z" fill="white" fillOpacity="0.01"/><path fillRule="evenodd" clipRule="evenodd" d="M3.23577 11.9278V5.54258L1.90552 6.60678L7.22652 2.34998L12.5475 6.60678L11.2173 5.54258V11.9278H3.23577Z" stroke="#535353" strokeWidth="0.605214" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M5.89636 8.46899V11.9276H8.55686V8.46899H5.89636Z" stroke="#535353" strokeWidth="0.605214" strokeLinejoin="round"/><path d="M3.23572 11.9276H11.2172" stroke="#535353" strokeWidth="0.605214" strokeLinecap="round"/></g><defs><clipPath id="clip0_109_85"><rect width="12.7704" height="12.7704" fill="white" transform="translate(0.841309 0.753662)"/></clipPath></defs></svg>{path === '/' ? <span className="block bg-black border-black h-[1px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-black border-black h-[1px]"></span>}</button>           
                    <button className={`px-0 group`} onClick={() => router.push(`/profile/${user.id}`)}><svg width="40" height="40" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_73)"><path d="M8.44333 9.55808V8.67007C8.44333 8.19904 8.25622 7.7473 7.92315 7.41423C7.59008 7.08116 7.13834 6.89404 6.66731 6.89404H3.11526C2.64423 6.89404 2.19249 7.08116 1.85942 7.41423C1.52635 7.7473 1.33923 8.19904 1.33923 8.67007V9.55808" stroke="#525252" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.89138 5.11797C5.87225 5.11797 6.66741 4.32281 6.66741 3.34194C6.66741 2.36107 5.87225 1.56592 4.89138 1.56592C3.91051 1.56592 3.11536 2.36107 3.11536 3.34194C3.11536 4.32281 3.91051 5.11797 4.89138 5.11797Z" stroke="#525252" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.1074 9.5581V8.67009C11.1071 8.27658 10.9761 7.89431 10.7351 7.5833C10.494 7.27229 10.1564 7.05016 9.77539 6.95178" stroke="#525252" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.99939 1.62366C8.38142 1.72147 8.72003 1.94365 8.96183 2.25517C9.20364 2.56669 9.33489 2.94983 9.33489 3.34418C9.33489 3.73853 9.20364 4.12167 8.96183 4.43319C8.72003 4.74471 8.38142 4.96689 7.99939 5.06471" stroke="#525252" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_109_73"><rect width="10.6561" height="10.6561" fill="white" transform="translate(0.895264 0.234009)"/></clipPath></defs></svg>{path === `/profile/${user.id}` ? <span className="block bg-black border-black h-[1px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-black border-black h-[1px]"></span>}</button>
                    <Input type="text" value={search} placeholder="Search something or someone..." onChange={(e) => setSearch(e.target.value)} className="w-1/2 rounded-3xl shadow-[0px_0px_3px_0.2px_rgba(0,_0,_0,_0.3)]"/>
                    <button className={`px-0 group`} onClick={() => router.push(`/chat`)}><svg width="40" height="40" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_78)"><path d="M9.26445 4.45607C9.26445 3.63705 8.9391 2.85156 8.35996 2.27242C7.78081 1.69328 6.99533 1.36792 6.1763 1.36792C5.35727 1.36792 4.57179 1.69328 3.99264 2.27242C3.4135 2.85156 3.08814 3.63705 3.08814 4.45607C3.08814 8.05892 1.54407 9.08831 1.54407 9.08831H10.8085C10.8085 9.08831 9.26445 8.05892 9.26445 4.45607Z" stroke="#525252" strokeWidth="0.693327" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.0666 11.1471C6.97611 11.3031 6.84623 11.4326 6.68996 11.5226C6.53369 11.6126 6.35652 11.66 6.17618 11.66C5.99585 11.66 5.81867 11.6126 5.6624 11.5226C5.50614 11.4326 5.37625 11.3031 5.28577 11.1471" stroke="#525252" strokeWidth="0.693327" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_109_78"><rect width="12.3526" height="12.3526" fill="white" transform="translate(0 0.338501)"/></clipPath></defs></svg>{path === '/chat' ? <span className="block bg-black border-black h-[1px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-black border-black h-[1px]"></span>}</button>
                    <button className={`px-0 group`} onClick={() => router.push(`/`)}><svg width="40" height="40" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.9622 6.17924C10.9639 6.84958 10.8073 7.51086 10.5051 8.10921C10.1467 8.82622 9.59582 9.4293 8.91408 9.8509C8.23234 10.2725 7.44669 10.496 6.64512 10.4963C5.97477 10.498 5.3135 10.3414 4.71515 10.0392L1.82019 11.0042L2.78518 8.10921C2.48295 7.51086 2.32633 6.84958 2.32808 6.17924C2.32839 5.37767 2.55186 4.59201 2.97346 3.91028C3.39506 3.22854 3.99814 2.67764 4.71515 2.3193C5.3135 2.01707 5.97477 1.86045 6.64512 1.8622H6.89906C7.95768 1.9206 8.95755 2.36742 9.70724 3.11711C10.4569 3.86681 10.9038 4.86668 10.9622 5.92529V6.17924Z" stroke="#525252" strokeWidth="0.653468" strokeLinecap="round" strokeLinejoin="round"/></svg>{path === '/notification' ? <span className="block bg-black border-black h-[1px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-black border-black h-[1px]"></span>}</button>
                </div>
                <div className="w-full flex justify-end">
                    <Button asChild variant="link" size="icon" onClick={logout} className="uppercase mr-10 hover:cursor-pointer"><FontAwesomeIcon icon={faGear} size="xs" className="px-1 -mt-1" /></Button>
                </div>

            </div>
        </div>
    )
};