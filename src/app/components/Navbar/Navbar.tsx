/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, {useEffect, useRef, useState} from "react"
import { useAuth } from '@/src/app/context/AuthProvider';
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUserGroup, faUser, faRightFromBracket, faBell, faGear, faComment } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Avatar, Flex } from "@radix-ui/themes";

import searchOutline from "@/public/search-outline 1.svg"
import { Profile } from "../../types/types";
import { Popover, PopoverTrigger, PopoverContent } from "@/src/components/ui/popover";
export default function Navbar() {

    // prosljedjuje mi se user state i funkcija logout iz AuthProvider.tsx

    const {user, logout} = useAuth()

    // nextJs router za mjenjanje path-a
    const router = useRouter();
    const path = usePathname();

    const [search, setSearch] = useState('');
    const [recievedItems, setReceivedItems] = useState<Profile[]>([]);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const handleSearch = async (search: string) => {
            try {
                if (search.trim() === '' || search.length < 3) {
                    setOpen(false);
                    setReceivedItems([]);
                    return;
                } else {
                    setOpen(true);
                }
                
                const res = await axios.get<Profile[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/search?searchTerm=${search}`);
    
    
                setReceivedItems(res.data);
    
                // Ensure the Input remains focused
                inputRef.current?.focus();
                
            } catch(err) {
                console.error(err);
            }
        }

        const timeoutId = setTimeout(() => {
            handleSearch(search);
        }, 500);

        // Clear the timeout if `search` changes
        return () => clearTimeout(timeoutId);
    }, [search])


    
    const handleRoute = (user: Profile) => {
        router.push(`/users/${user.username}`);
        inputRef.current?.blur();
        setSearch('');
        setReceivedItems([]);
    }

    // ukoliko je user state null vraća se null (kao da navbar ne postoji uopće)
    if(!user) return null;

    // ukoliko je user state User vraća se sve ispod

    return (
        <div className="border-1 border-black bg-[#222222] shadow-[0px_0.5px_20.16px_0px_rgba(0,_0,_0,_0.26)] h-[75px] fixed top-0 w-full">
            <div className="sm:hidden flex flex-col">
                <div className="w-auto max-w-[100%] flex justify-between ml-2">
                    <button className="text-xl md:text-2xl font-Roboto font-[900] italic text-[#D0D0D0]" onClick={() => router.push('/')}>SNET</button>
                    <div className="flex justify-end items-center md:hidden">
                        <button className="hover:cursor-pointer flex" onClick={() => router.push(`/my-profile`)}>
                            <Flex className="mr-2">
                                <Avatar src={`${user.pictureUrl}?${new Date().getTime()}`} className="w-[20px]" style={{borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
                            </Flex> 
                        </button>
                    </div>
                </div>
                <div className="flex py-1 w-auto max-w-[100%] justify-between">
                    <div className="w-auto min-w-[80%] relative py-1 md:hidden">
                        <label htmlFor="searchInput" className="absolute right-2 top-[6px]"><svg width="20" height="20" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="search-outline 1" clipPath="url(#clip0_109_55)"><g id="Layer 2"><g id="search"><path id="Vector" d="M8.8472 8.21306L7.48959 6.85944C7.92761 6.3014 8.16528 5.6123 8.1644 4.90288C8.1644 4.27109 7.97705 3.65349 7.62605 3.12818C7.27505 2.60286 6.77615 2.19343 6.19246 1.95166C5.60876 1.70988 4.96648 1.64662 4.34683 1.76988C3.72718 1.89313 3.15799 2.19737 2.71125 2.64411C2.26451 3.09085 1.96027 3.66004 1.83702 4.27969C1.71376 4.89934 1.77702 5.54162 2.01879 6.12532C2.26057 6.70901 2.67 7.20791 3.19532 7.55891C3.72063 7.90992 4.33823 8.09726 4.97002 8.09726C5.67943 8.09815 6.36854 7.86047 6.92658 7.42245L8.2802 8.78006C8.31732 8.81749 8.36148 8.84719 8.41014 8.86747C8.4588 8.88774 8.51099 8.89817 8.5637 8.89817C8.61641 8.89817 8.6686 8.88774 8.71726 8.86747C8.76592 8.84719 8.81008 8.81749 8.8472 8.78006C8.88463 8.74294 8.91433 8.69878 8.9346 8.65012C8.95488 8.60146 8.96531 8.54927 8.96531 8.49656C8.96531 8.44385 8.95488 8.39166 8.9346 8.343C8.91433 8.29434 8.88463 8.25018 8.8472 8.21306ZM2.57423 4.90288C2.57423 4.42904 2.71474 3.96584 2.97799 3.57185C3.24125 3.17787 3.61542 2.87079 4.05319 2.68946C4.49096 2.50813 4.97268 2.46069 5.43741 2.55313C5.90215 2.64557 6.32904 2.87375 6.6641 3.2088C6.99915 3.54386 7.22733 3.97075 7.31977 4.43549C7.41221 4.90022 7.36477 5.38194 7.18344 5.81971C7.00211 6.25748 6.69503 6.63165 6.30105 6.8949C5.90706 7.15816 5.44386 7.29867 4.97002 7.29867C4.33462 7.29867 3.72524 7.04626 3.27594 6.59696C2.82664 6.14766 2.57423 5.53828 2.57423 4.90288Z" fill="#C7C7C7"/></g></g></g><defs><clipPath id="clip0_109_55"><rect width="9.58315" height="9.58315" fill="white" transform="translate(0.577637 0.51062)"/></clipPath></defs></svg></label>
                        <Input type="text"id="searchInput" autoComplete="off" value={search} placeholder="Search anyone..." onChange={(e) => setSearch(e.target.value)} className="bg-[#363636] font-Roboto h-[25px] md:min-w-[310px] md:w-full text-[#BBBBBB] text-xs rounded-3xl shadow-[0px_0px_3px_0.2px_rgba(0,0,0,0.35)] border focus-visible:ring-0 border-transparent "/>  
                        {recievedItems.length > 0 ? (
                            <div className=" bg-[#222222] w-full h-fit absolute top-[36px] left-0 rounded-sm border text-white border-black">
                                <div className="flex flex-col items-start px-2 gap-2">
                                    {recievedItems.map((item, index) => (<button key={index} onClick={() => handleRoute(item)} className="hover:cursor-pointer hover:underline transition-all">{item.username}</button>))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="flex justify-end items-center">
                        <button className={`px-0 group`} onClick={() => router.push('/')}><svg className="px-0" width="20" height="20" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_73)"><path d="M8.44333 9.55808V8.67007C8.44333 8.19904 8.25622 7.7473 7.92315 7.41423C7.59008 7.08116 7.13834 6.89404 6.66731 6.89404H3.11526C2.64423 6.89404 2.19249 7.08116 1.85942 7.41423C1.52635 7.7473 1.33923 8.19904 1.33923 8.67007V9.55808" stroke="#AFAFAF" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.89138 5.11797C5.87225 5.11797 6.66741 4.32281 6.66741 3.34194C6.66741 2.36107 5.87225 1.56592 4.89138 1.56592C3.91051 1.56592 3.11536 2.36107 3.11536 3.34194C3.11536 4.32281 3.91051 5.11797 4.89138 5.11797Z" stroke="#AFAFAF" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.1074 9.5581V8.67009C11.1071 8.27658 10.9761 7.89431 10.7351 7.5833C10.494 7.27229 10.1564 7.05016 9.77539 6.95178" stroke="#AFAFAF" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.99939 1.62366C8.38142 1.72147 8.72003 1.94365 8.96183 2.25517C9.20364 2.56669 9.33489 2.94983 9.33489 3.34418C9.33489 3.73853 9.20364 4.12167 8.96183 4.43319C8.72003 4.74471 8.38142 4.96689 7.99939 5.06471" stroke="#AFAFAF" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_109_73"><rect width="10.6561" height="10.6561" fill="white" transform="translate(0.895264 0.234009)"/></clipPath></defs></svg>{path === '/people' ? <span className="block bg-[#AFAFAF] border-[#AFAFAF] h-[2px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-[#535252] border-[#535252] h-[2px]"></span>}</button>           
                        <Button asChild variant="link" onClick={logout} className="hover:cursor-pointer text-[#AFAFAF] px-2 py-0"><FontAwesomeIcon icon={faRightFromBracket} className="text-sm font-thin size-4"/></Button>
                    </div>
                    <div className="hidden md:flex justify-end items-center">
                        <button className="hover:cursor-pointer flex" onClick={() => router.push(`/my-profile`)}>
                            <Flex className="mr-2">
                                <Avatar src={`${user.pictureUrl}?${new Date().getTime()}`} className="w-[20px]" style={{borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
                            </Flex> 
                        </button>
                    </div>
                </div>
            </div>
            <div className="sm:flex hidden justify-between items-center h-full w-full">
                <div className="w-[33%] flex justify-start ml-2 sm:ml-4 md:ml-6 xl:ml-8 2xl:ml-10">
                    <button className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-Roboto font-[900] italic text-[#D0D0D0]" onClick={() => router.push('/')}>SNET</button>
                </div>
                <div className="flex w-full justify-center gap-2 items-center">
                    <button className={`px-0 group w-[25px] h-[25px] md:w-[35px] md:h-[35px] 2xl:w-[40px] 2xl:h-[40px]`} onClick={() => router.push('/')}><svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_85)"><path d="M13.6117 0.753662H0.841309V13.5241H13.6117V0.753662Z" fill="white" fillOpacity="0.01"/><path fillRule="evenodd" clipRule="evenodd" d="M3.23577 11.9278V5.54258L1.90552 6.60678L7.22652 2.34998L12.5475 6.60678L11.2173 5.54258V11.9278H3.23577Z" stroke="#AFAFAF" strokeWidth="0.605214" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M5.89636 8.46899V11.9276H8.55686V8.46899H5.89636Z" stroke="#AFAFAF" strokeWidth="0.605214" strokeLinejoin="round"/><path d="M3.23572 11.9276H11.2172" stroke="#AFAFAF" strokeWidth="0.605214" strokeLinecap="round"/></g><defs><clipPath id="clip0_109_85"><rect width="12.7704" height="12.7704" fill="white" transform="translate(0.841309 0.753662)"/></clipPath></defs></svg>{path === '/' ? <span className="block bg-[#AFAFAF] border-[#AFAFAF] h-[2px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-[#535252] border-[#535252] h-[2px]"></span>}</button>           
                    <div className="w-fit relative">
                        <label htmlFor="searchInput" className="absolute right-2 top-0"><svg width="35" height="35" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="search-outline 1" clipPath="url(#clip0_109_55)"><g id="Layer 2"><g id="search"><path id="Vector" d="M8.8472 8.21306L7.48959 6.85944C7.92761 6.3014 8.16528 5.6123 8.1644 4.90288C8.1644 4.27109 7.97705 3.65349 7.62605 3.12818C7.27505 2.60286 6.77615 2.19343 6.19246 1.95166C5.60876 1.70988 4.96648 1.64662 4.34683 1.76988C3.72718 1.89313 3.15799 2.19737 2.71125 2.64411C2.26451 3.09085 1.96027 3.66004 1.83702 4.27969C1.71376 4.89934 1.77702 5.54162 2.01879 6.12532C2.26057 6.70901 2.67 7.20791 3.19532 7.55891C3.72063 7.90992 4.33823 8.09726 4.97002 8.09726C5.67943 8.09815 6.36854 7.86047 6.92658 7.42245L8.2802 8.78006C8.31732 8.81749 8.36148 8.84719 8.41014 8.86747C8.4588 8.88774 8.51099 8.89817 8.5637 8.89817C8.61641 8.89817 8.6686 8.88774 8.71726 8.86747C8.76592 8.84719 8.81008 8.81749 8.8472 8.78006C8.88463 8.74294 8.91433 8.69878 8.9346 8.65012C8.95488 8.60146 8.96531 8.54927 8.96531 8.49656C8.96531 8.44385 8.95488 8.39166 8.9346 8.343C8.91433 8.29434 8.88463 8.25018 8.8472 8.21306ZM2.57423 4.90288C2.57423 4.42904 2.71474 3.96584 2.97799 3.57185C3.24125 3.17787 3.61542 2.87079 4.05319 2.68946C4.49096 2.50813 4.97268 2.46069 5.43741 2.55313C5.90215 2.64557 6.32904 2.87375 6.6641 3.2088C6.99915 3.54386 7.22733 3.97075 7.31977 4.43549C7.41221 4.90022 7.36477 5.38194 7.18344 5.81971C7.00211 6.25748 6.69503 6.63165 6.30105 6.8949C5.90706 7.15816 5.44386 7.29867 4.97002 7.29867C4.33462 7.29867 3.72524 7.04626 3.27594 6.59696C2.82664 6.14766 2.57423 5.53828 2.57423 4.90288Z" fill="#C7C7C7"/></g></g></g><defs><clipPath id="clip0_109_55"><rect width="9.58315" height="9.58315" fill="white" transform="translate(0.577637 0.51062)"/></clipPath></defs></svg></label>
                        <Input type="text"id="searchInput" autoComplete="off" value={search} placeholder="Search something or someone..." onChange={(e) => setSearch(e.target.value)} className="bg-[#363636] font-Roboto sm:w-[300px] md:w-[350px] lg:w-[400px] xl:w-[450px] 2xl:w-[500px] text-[#BBBBBB] text-base rounded-3xl shadow-[0px_0px_3px_0.2px_rgba(0,0,0,0.35)] border focus-visible:ring-0 border-transparent "/>  
                        {recievedItems.length > 0 ? (
                            <div className=" bg-[#222222] w-full h-fit absolute top-[36px] left-0 rounded-sm border text-white border-black">
                                <div className="flex flex-col items-start px-2 gap-2">
                                    {recievedItems.map((item, index) => (<button key={index} onClick={() => handleRoute(item)} className="hover:cursor-pointer hover:underline transition-all">{item.username}</button>))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <button className={`px-0 group w-[25px] h-[25px] md:w-[35px] md:h-[35px] 2xl:w-[40px] 2xl:h-[40px]`} onClick={() => router.push('/')}><svg viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_73)"><path d="M8.44333 9.55808V8.67007C8.44333 8.19904 8.25622 7.7473 7.92315 7.41423C7.59008 7.08116 7.13834 6.89404 6.66731 6.89404H3.11526C2.64423 6.89404 2.19249 7.08116 1.85942 7.41423C1.52635 7.7473 1.33923 8.19904 1.33923 8.67007V9.55808" stroke="#AFAFAF" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.89138 5.11797C5.87225 5.11797 6.66741 4.32281 6.66741 3.34194C6.66741 2.36107 5.87225 1.56592 4.89138 1.56592C3.91051 1.56592 3.11536 2.36107 3.11536 3.34194C3.11536 4.32281 3.91051 5.11797 4.89138 5.11797Z" stroke="#AFAFAF" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.1074 9.5581V8.67009C11.1071 8.27658 10.9761 7.89431 10.7351 7.5833C10.494 7.27229 10.1564 7.05016 9.77539 6.95178" stroke="#AFAFAF" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.99939 1.62366C8.38142 1.72147 8.72003 1.94365 8.96183 2.25517C9.20364 2.56669 9.33489 2.94983 9.33489 3.34418C9.33489 3.73853 9.20364 4.12167 8.96183 4.43319C8.72003 4.74471 8.38142 4.96689 7.99939 5.06471" stroke="#AFAFAF" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_109_73"><rect width="10.6561" height="10.6561" fill="white" transform="translate(0.895264 0.234009)"/></clipPath></defs></svg>{path === '/people' ? <span className="block bg-[#AFAFAF] border-[#AFAFAF] h-[2px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-[#535252] border-[#535252] h-[2px]"></span>}</button>           
                </div>
                <div className="w-[33%] flex justify-end gap-1 items-center">
                    <Button asChild variant="link" onClick={logout} className="hover:cursor-pointer text-[#AFAFAF]"><FontAwesomeIcon icon={faRightFromBracket} className="text-sm -mt-1 font-thin sm:size-4 md:size-6"/></Button>
                    <button className="hover:cursor-pointer flex gap-2" onClick={() => router.push(`/my-profile`)}>
                        <Flex gap="2" className="mr-6">
                            <Avatar src={`${user.pictureUrl}?${new Date().getTime()}`} size="4" style={{borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
                        </Flex> 
                    </button>
                </div>
            </div>
        </div>
    )
};