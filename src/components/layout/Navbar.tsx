/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, {memo, useEffect, useRef, useState} from "react"
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import { User } from "../../types/types";
import { LogOut, Trash2, User as UserIcon, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import SearchSkeleton from "../skeletons/SearchSkeleton";
import { useAuth } from "@/src/context/AuthProvider";
import { profileApi } from "@/src/lib/utils";
import SearchedUser from "../other/SearchedUser";

const Navbar = memo(() => {

    // prosljedjuje mi se user state i funkcija logout iz AuthProvider.tsx

    const {logout, deleteAccount} = useAuth()

    // nextJs router za mjenjanje path-a
    const router = useRouter();
    const path = usePathname();

    const [search, setSearch] = useState('');
    const [recievedItems, setReceivedItems] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [pcPopoverOpen, setPcPopoverOpen] = useState(false);
    const [shortUsername, setShortUsername] = useState('');
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [deleteAccOpen, setDeleteAccOpen] = useState(false);
    const [showLogo, setShowLogo] = useState(true);

    const {user} = useAuth();


    useEffect(() => {
        if (user && user.firstName && user.lastName) {
            const firstLetter = user.firstName.slice(0, 1);
            const secondLetter = user.lastName.slice(0, 1);
            setShortUsername(firstLetter + secondLetter);
        }
    }, [user]); 

    useEffect(() => {
        const handleSearch = async (search: string) => {
            try {
                if (search.trim() === '') {
                    setReceivedItems([]);
                    return;
                }
                if(search.length > 0 && search.length < 3) {
                    setSearchOpen(true);
                    setReceivedItems([]);
                    return;
                }
                setIsSearchLoading(true);
                setSearchOpen(true);
                
                const res = await profileApi.searchProfiles(search);
    
                setReceivedItems(res.data);
                setIsSearchLoading(false);
    
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

    const handleRoute = (user: User) => {
        setSearchOpen(false);
        router.push(`/users/${user.username}`);
        setSearch('');
        setReceivedItems([]);
        searchInputRef.current?.blur();
    };

    const clearSearch = () => {
        if(search !== '') {
            setSearch('');
            setReceivedItems([]);
        } else {
            searchInputRef.current?.focus(); // Focus the input
        }
    }

    const mobileHandleSearch = () => {
        setSearchOpen((prev) => !prev);
    }

    const mobileClearSearch = () => {
        setSearch('');
        setReceivedItems([]);
    }

    useEffect(() => {
        const handleScroll = () => {
            setPopoverOpen(false);
            setPcPopoverOpen(false);
            setSearchOpen(false)
            setSearch('');
        };

        if (popoverOpen || pcPopoverOpen || searchOpen) {
            requestAnimationFrame(() => {
            window.addEventListener("scroll", handleScroll, { passive: true });
            });
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [popoverOpen, pcPopoverOpen, searchOpen]);

    useEffect(() => {
        if(popoverOpen && searchOpen) {
            setSearchOpen(false);
        }
        const handleClick = () => {
            setPopoverOpen(false);
            setPcPopoverOpen(false);
        }

        if(popoverOpen || pcPopoverOpen) {
            requestAnimationFrame(() => {
                window.addEventListener("click", handleClick, {passive: true});
            });
            return () => window.removeEventListener("click", handleClick);
        }
    }, [popoverOpen, pcPopoverOpen, searchOpen]);

    useEffect(() => {
        const windowSize = window.innerWidth;
        if(windowSize < 580 && searchOpen) {
            setShowLogo(false);
        } else if (windowSize < 580 && !searchOpen) {
            setShowLogo(true);
        }
    }, [searchOpen]);

    const handleSeeMore = (search: string) => {
        setSearchOpen(false);
        router.push(`/people?searchTerm=${search}`);
        setSearch('');
        setReceivedItems([]);
        searchInputRef.current?.blur();
    }

    // ukoliko je user state User vraća se sve ispod
    return (
        <div className="border-1 border-black bg-[#222222] shadow-[0px_0.5px_20.16px_0px_rgba(0,_0,_0,_0.26)] h-[50px] sm:h-[80px] fixed top-0 w-full z-[9998]">
            <div className="sm:hidden flex flex-col px-4 h-full justify-center">
                <div className="w-auto max-w-[100%] flex justify-between ml-2">
                    <button className="text-2xl font-Roboto font-[900] italic text-[#D0D0D0] cursor-pointer" onClick={() => router.push('/')}>{showLogo ? 'SNET' : null}</button>
                    <div className="flex justify-end items-center md:hidden">
                        <div className="sm:hidden flex">
                            <Input type="text" id="searchInput" ref={searchInputRef} autoComplete="off" value={search} placeholder="Search anyone..." onChange={(e) => setSearch(e.target.value)} className={`${searchOpen ? 'absolute top-[7px] right-14 max-w-[75%] w-full rounded-full' : 'hidden'} bg-[#363636] font-Roboto sm:w-[300px] md:w-[350px] lg:w-[400px] xl:w-[450px] 2xl:w-[500px] text-[#BBBBBB] text-[15px] shadow-[0px_0px_3px_0.2px_rgba(0,0,0,0.35)] border focus-visible:ring-0 border-transparent `}/>
                            <label htmlFor="searchInput" onClick={() => mobileHandleSearch()} className={`${search === '' ? 'block' : 'hidden'} hover:cursor-pointer z-20 absolute top-[7px] right-16`}><svg width="35" height="35" viewBox="0 0 11 11" fill="#AFAFAF" xmlns="http://www.w3.org/2000/svg"><g id="search-outline 1" clipPath="url(#clip0_109_55)"><g id="Layer 2"><g id="search"><path id="Vector" d="M8.8472 8.21306L7.48959 6.85944C7.92761 6.3014 8.16528 5.6123 8.1644 4.90288C8.1644 4.27109 7.97705 3.65349 7.62605 3.12818C7.27505 2.60286 6.77615 2.19343 6.19246 1.95166C5.60876 1.70988 4.96648 1.64662 4.34683 1.76988C3.72718 1.89313 3.15799 2.19737 2.71125 2.64411C2.26451 3.09085 1.96027 3.66004 1.83702 4.27969C1.71376 4.89934 1.77702 5.54162 2.01879 6.12532C2.26057 6.70901 2.67 7.20791 3.19532 7.55891C3.72063 7.90992 4.33823 8.09726 4.97002 8.09726C5.67943 8.09815 6.36854 7.86047 6.92658 7.42245L8.2802 8.78006C8.31732 8.81749 8.36148 8.84719 8.41014 8.86747C8.4588 8.88774 8.51099 8.89817 8.5637 8.89817C8.61641 8.89817 8.6686 8.88774 8.71726 8.86747C8.76592 8.84719 8.81008 8.81749 8.8472 8.78006C8.88463 8.74294 8.91433 8.69878 8.9346 8.65012C8.95488 8.60146 8.96531 8.54927 8.96531 8.49656C8.96531 8.44385 8.95488 8.39166 8.9346 8.343C8.91433 8.29434 8.88463 8.25018 8.8472 8.21306ZM2.57423 4.90288C2.57423 4.42904 2.71474 3.96584 2.97799 3.57185C3.24125 3.17787 3.61542 2.87079 4.05319 2.68946C4.49096 2.50813 4.97268 2.46069 5.43741 2.55313C5.90215 2.64557 6.32904 2.87375 6.6641 3.2088C6.99915 3.54386 7.22733 3.97075 7.31977 4.43549C7.41221 4.90022 7.36477 5.38194 7.18344 5.81971C7.00211 6.25748 6.69503 6.63165 6.30105 6.8949C5.90706 7.15816 5.44386 7.29867 4.97002 7.29867C4.33462 7.29867 3.72524 7.04626 3.27594 6.59696C2.82664 6.14766 2.57423 5.53828 2.57423 4.90288Z" fill="#AFAFAF"/></g></g></g><defs><clipPath id="clip0_109_55"><rect width="9.58315" height="9.58315" fill="white" transform="translate(0.577637 0.51062)"/></clipPath></defs></svg></label>
                            <label htmlFor="searchInput" onClick={() => mobileClearSearch()} className={`${search === '' ? 'hidden' : 'block'} hover:cursor-pointer z-20 absolute top-[11px] right-16`}><svg width="25" height="25" fill="#AFAFAF"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg></label>
                            {searchOpen && search.length !== 0 ? (
                                <div className="bg-[#252525] min-w-[75%] max-w-[75%] w-auto h-fit absolute top-[38px] right-14 rounded-lg border-none text-[#AFAFAF] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                                    <div className="flex flex-col items-start gap-2">
                                        <div className="flex items-center w-full gap-4 mt-4 px-2">
                                            <div className=" border-[#515151] rounded-full border px-1 py-1 w-fit h-fit"><svg width="35" height="35" viewBox="0 0 11 11" fill="#AFAFAF" xmlns="http://www.w3.org/2000/svg"><g id="search-outline 1" clipPath="url(#clip0_109_55)"><g id="Layer 2"><g id="search"><path id="Vector" d="M8.8472 8.21306L7.48959 6.85944C7.92761 6.3014 8.16528 5.6123 8.1644 4.90288C8.1644 4.27109 7.97705 3.65349 7.62605 3.12818C7.27505 2.60286 6.77615 2.19343 6.19246 1.95166C5.60876 1.70988 4.96648 1.64662 4.34683 1.76988C3.72718 1.89313 3.15799 2.19737 2.71125 2.64411C2.26451 3.09085 1.96027 3.66004 1.83702 4.27969C1.71376 4.89934 1.77702 5.54162 2.01879 6.12532C2.26057 6.70901 2.67 7.20791 3.19532 7.55891C3.72063 7.90992 4.33823 8.09726 4.97002 8.09726C5.67943 8.09815 6.36854 7.86047 6.92658 7.42245L8.2802 8.78006C8.31732 8.81749 8.36148 8.84719 8.41014 8.86747C8.4588 8.88774 8.51099 8.89817 8.5637 8.89817C8.61641 8.89817 8.6686 8.88774 8.71726 8.86747C8.76592 8.84719 8.81008 8.81749 8.8472 8.78006C8.88463 8.74294 8.91433 8.69878 8.9346 8.65012C8.95488 8.60146 8.96531 8.54927 8.96531 8.49656C8.96531 8.44385 8.95488 8.39166 8.9346 8.343C8.91433 8.29434 8.88463 8.25018 8.8472 8.21306ZM2.57423 4.90288C2.57423 4.42904 2.71474 3.96584 2.97799 3.57185C3.24125 3.17787 3.61542 2.87079 4.05319 2.68946C4.49096 2.50813 4.97268 2.46069 5.43741 2.55313C5.90215 2.64557 6.32904 2.87375 6.6641 3.2088C6.99915 3.54386 7.22733 3.97075 7.31977 4.43549C7.41221 4.90022 7.36477 5.38194 7.18344 5.81971C7.00211 6.25748 6.69503 6.63165 6.30105 6.8949C5.90706 7.15816 5.44386 7.29867 4.97002 7.29867C4.33462 7.29867 3.72524 7.04626 3.27594 6.59696C2.82664 6.14766 2.57423 5.53828 2.57423 4.90288Z" fill="#AFAFAF"/></g></g></g><defs><clipPath id="clip0_109_55"><rect width="9.58315" height="9.58315" fill="white" transform="translate(0.577637 0.51062)"/></clipPath></defs></svg></div>
                                            <p className="text-sm font-Roboto text-[#AFAFAF] sm:text-base min-w-[160px] max-w-full break-words">You searched {search}</p>
                                        </div>
                                        <hr className="h-[1px] w-full px-0 border-[#525252]" />
                                        {isSearchLoading ? <SearchSkeleton /> : recievedItems.length === 0 ? <div className="w-full text-center py-4"><h1>No users found!</h1></div> : recievedItems.map((user) => <SearchedUser key={user.userId} searchedUser={user}/>)}
                                        <div className="w-full flex justify-center py-4">
                                            <button className="flex flex-col text-[#AFAFAF] font-Roboto text-sm sm:text-base cursor-pointer" onClick={() => handleSeeMore(search)}>See more<span className="w-full h-[1px] bg-[#AFAFAF]"></span></button>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <div className={`w-fit absolute flex flex-col items-center rounded-tr-xl rounded-tl-xl bg-[#222222] z-30 ${popoverOpen ? 'shadow-[0px_-2px_10px_0px_rgba(0,_0,_0,_0.26)] pl-6 py-2' : ''}`}>
                            <div className="flex flex-col items-center justify-end w-full">
                                <div className={`flex items-center ${popoverOpen ? 'justify-between' : 'justify-end'} gap-6 w-full`}>
                                    {popoverOpen && (
                                        <div className="flex flex-col items-start mr-2 w-[125px]">
                                            <h1 className="text-[#DFDEDE] font-Roboto text-sm xl:text-base max-w-[125px] truncate">{user?.firstName} {user?.lastName}</h1>
                                            <p className="text-[#DFDEDE] font-Roboto text-sm xl:text-base">@{user?.username}</p>
                                        </div>
                                    )}
                                    <Avatar className="sm:w-[45px] sm:h-[45px] lg:w-[65px] lg:h-[65px] cursor-pointer relative z-10" onClick={() => setPopoverOpen(!popoverOpen)}>
                                        <AvatarImage src={`${user?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{ boxShadow: '0px 6px 6px 0px #00000040'}} /><AvatarFallback>{shortUsername}</AvatarFallback>
                                    </Avatar> 
                                </div>
                                {popoverOpen && (
                                <div className="absolute top-full bg-[#222222] px-4 right-0 py-4 flex flex-col gap-2 w-full rounded-br-xl rounded-bl-xl z-0 shadow-[0px_5px_10px_0px_rgba(0,_0,_0,_0.26)]">
                                    <div className="flex flex-col gap-2">
                                        <button className="text-[#DFDEDE] font-Roboto text-sm xl:text-base flex gap-1 px-4 py-2 bg-[#515151] rounded-full w-full justify-center items-center hover:opacity-80 transition-all cursor-pointer" onClick={() => {setPopoverOpen(false); router.push(`/users/${user?.username}`)}}><UserIcon className="size-4 xl:size-6"/> Show Profile</button>
                                        <button className="text-[#DFDEDE] font-Roboto text-sm xl:text-base flex gap-1 px-4 py-2 bg-[#515151] rounded-full w-full justify-center items-center hover:opacity-80 transition-all cursor-pointer" onClick={() => {setPopoverOpen(false); router.push(`/people`)}}><Users className="size-4 xl:size-6"/> People</button>
                                        <button className="text-[#DFDEDE] font-Roboto text-sm xl:text-base flex gap-2 px-4 py-2 bg-[#515151] rounded-full w-full justify-center items-center hover:opacity-80 transition-all cursor-pointer" onClick={() => logout()}><LogOut className="size-4 xl:size-6"/> Logout</button>
                                    </div>
                                    <div className="w-full pt-6">
                                        <button className="bg-[#CA3C3C] text-[#DFDEDE] font-semibold font-Roboto text-sm xl:text-base flex gap-2 px-4 py-2 rounded-full w-full justify-center items-center hover:opacity-80 transition-all" onClick={() => {setPopoverOpen(false);setDeleteAccOpen(true)}}><Trash2 className="size-4 xl:size-6"/> Delete Account</button>
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sm:flex hidden justify-between items-center h-full w-full">
                <div className="w-[33%] flex justify-start ml-2 sm:ml-4 md:ml-6 xl:ml-8 2xl:ml-10">
                    <button className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-Roboto font-[900] italic text-[#D0D0D0] cursor-pointer" onClick={() => router.push('/')}>SNET</button>
                </div>
                <div className="flex w-full justify-center gap-2 items-center">
                    <button className={`px-0 group w-[25px] h-[25px] md:w-[35px] md:h-[35px] 2xl:w-[40px] 2xl:h-[40px] cursor-pointer`} onClick={() => router.push('/')}><svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_85)"><path d="M13.6117 0.753662H0.841309V13.5241H13.6117V0.753662Z" fill="#222222" fillOpacity="0.01"/><path fillRule="evenodd" clipRule="evenodd" d="M3.23577 11.9278V5.54258L1.90552 6.60678L7.22652 2.34998L12.5475 6.60678L11.2173 5.54258V11.9278H3.23577Z" stroke="#AFAFAF" strokeWidth="0.605214" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M5.89636 8.46899V11.9276H8.55686V8.46899H5.89636Z" stroke="#AFAFAF" strokeWidth="0.605214" strokeLinejoin="round"/><path d="M3.23572 11.9276H11.2172" stroke="#AFAFAF" strokeWidth="0.605214" strokeLinecap="round"/></g><defs><clipPath id="clip0_109_85"><rect width="12.7704" height="12.7704" fill="white" transform="translate(0.841309 0.753662)"/></clipPath></defs></svg>{path === '/' ? <span className="block bg-[#AFAFAF] border-[#AFAFAF] h-[2px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-[#535252] border-[#535252] h-[2px]"></span>}</button>           
                    <div className="w-fit relative">
                        <label htmlFor="searchInput" onClick={() => clearSearch()} className={`absolute right-2 top-0 hover:cursor-pointer ${search !== '' ? 'top-[5px]': null}`}>{search !== '' ?  <svg width="25" height="25" fill="#AFAFAF"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg> : <svg width="35" height="35" viewBox="0 0 11 11" fill="#AFAFAF" xmlns="http://www.w3.org/2000/svg"><g id="search-outline 1" clipPath="url(#clip0_109_55)"><g id="Layer 2"><g id="search"><path id="Vector" d="M8.8472 8.21306L7.48959 6.85944C7.92761 6.3014 8.16528 5.6123 8.1644 4.90288C8.1644 4.27109 7.97705 3.65349 7.62605 3.12818C7.27505 2.60286 6.77615 2.19343 6.19246 1.95166C5.60876 1.70988 4.96648 1.64662 4.34683 1.76988C3.72718 1.89313 3.15799 2.19737 2.71125 2.64411C2.26451 3.09085 1.96027 3.66004 1.83702 4.27969C1.71376 4.89934 1.77702 5.54162 2.01879 6.12532C2.26057 6.70901 2.67 7.20791 3.19532 7.55891C3.72063 7.90992 4.33823 8.09726 4.97002 8.09726C5.67943 8.09815 6.36854 7.86047 6.92658 7.42245L8.2802 8.78006C8.31732 8.81749 8.36148 8.84719 8.41014 8.86747C8.4588 8.88774 8.51099 8.89817 8.5637 8.89817C8.61641 8.89817 8.6686 8.88774 8.71726 8.86747C8.76592 8.84719 8.81008 8.81749 8.8472 8.78006C8.88463 8.74294 8.91433 8.69878 8.9346 8.65012C8.95488 8.60146 8.96531 8.54927 8.96531 8.49656C8.96531 8.44385 8.95488 8.39166 8.9346 8.343C8.91433 8.29434 8.88463 8.25018 8.8472 8.21306ZM2.57423 4.90288C2.57423 4.42904 2.71474 3.96584 2.97799 3.57185C3.24125 3.17787 3.61542 2.87079 4.05319 2.68946C4.49096 2.50813 4.97268 2.46069 5.43741 2.55313C5.90215 2.64557 6.32904 2.87375 6.6641 3.2088C6.99915 3.54386 7.22733 3.97075 7.31977 4.43549C7.41221 4.90022 7.36477 5.38194 7.18344 5.81971C7.00211 6.25748 6.69503 6.63165 6.30105 6.8949C5.90706 7.15816 5.44386 7.29867 4.97002 7.29867C4.33462 7.29867 3.72524 7.04626 3.27594 6.59696C2.82664 6.14766 2.57423 5.53828 2.57423 4.90288Z" fill="#AFAFAF"/></g></g></g><defs><clipPath id="clip0_109_55"><rect width="9.58315" height="9.58315" fill="white" transform="translate(0.577637 0.51062)"/></clipPath></defs></svg>}</label>
                        <Input type="text" id="searchInput" ref={searchInputRef} autoComplete="off" value={search} placeholder="Search something or someone..." onChange={(e) => {setSearch(e.target.value)}} className="bg-[#363636] font-Roboto sm:w-[300px] md:w-[350px] lg:w-[400px] xl:w-[450px] 2xl:w-[500px] text-[#BBBBBB] text-[15px] rounded-3xl shadow-[0px_0px_3px_0.2px_rgba(0,0,0,0.35)] border focus-visible:ring-0 border-transparent "/> 
                        {searchOpen && search.length !== 0 ? (
                            <div className="bg-[#252525] sm:w-[300px] md:w-[350px] lg:w-[400px] xl:w-[450px] 2xl:w-[500px] h-fit absolute top-[38px] right-0 rounded-lg border-none text-[#AFAFAF] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                                <div className="flex flex-col items-start gap-2">
                                    <div className="flex items-center gap-4 w-full mt-4 px-2">
                                        <div className=" border-[#515151] rounded-full border px-1 py-1 h-fit"><svg width="35" height="35" viewBox="0 0 11 11" fill="#AFAFAF" xmlns="http://www.w3.org/2000/svg"><g id="search-outline 1" clipPath="url(#clip0_109_55)"><g id="Layer 2"><g id="search"><path id="Vector" d="M8.8472 8.21306L7.48959 6.85944C7.92761 6.3014 8.16528 5.6123 8.1644 4.90288C8.1644 4.27109 7.97705 3.65349 7.62605 3.12818C7.27505 2.60286 6.77615 2.19343 6.19246 1.95166C5.60876 1.70988 4.96648 1.64662 4.34683 1.76988C3.72718 1.89313 3.15799 2.19737 2.71125 2.64411C2.26451 3.09085 1.96027 3.66004 1.83702 4.27969C1.71376 4.89934 1.77702 5.54162 2.01879 6.12532C2.26057 6.70901 2.67 7.20791 3.19532 7.55891C3.72063 7.90992 4.33823 8.09726 4.97002 8.09726C5.67943 8.09815 6.36854 7.86047 6.92658 7.42245L8.2802 8.78006C8.31732 8.81749 8.36148 8.84719 8.41014 8.86747C8.4588 8.88774 8.51099 8.89817 8.5637 8.89817C8.61641 8.89817 8.6686 8.88774 8.71726 8.86747C8.76592 8.84719 8.81008 8.81749 8.8472 8.78006C8.88463 8.74294 8.91433 8.69878 8.9346 8.65012C8.95488 8.60146 8.96531 8.54927 8.96531 8.49656C8.96531 8.44385 8.95488 8.39166 8.9346 8.343C8.91433 8.29434 8.88463 8.25018 8.8472 8.21306ZM2.57423 4.90288C2.57423 4.42904 2.71474 3.96584 2.97799 3.57185C3.24125 3.17787 3.61542 2.87079 4.05319 2.68946C4.49096 2.50813 4.97268 2.46069 5.43741 2.55313C5.90215 2.64557 6.32904 2.87375 6.6641 3.2088C6.99915 3.54386 7.22733 3.97075 7.31977 4.43549C7.41221 4.90022 7.36477 5.38194 7.18344 5.81971C7.00211 6.25748 6.69503 6.63165 6.30105 6.8949C5.90706 7.15816 5.44386 7.29867 4.97002 7.29867C4.33462 7.29867 3.72524 7.04626 3.27594 6.59696C2.82664 6.14766 2.57423 5.53828 2.57423 4.90288Z" fill="#AFAFAF"/></g></g></g><defs><clipPath id="clip0_109_55"><rect width="9.58315" height="9.58315" fill="white" transform="translate(0.577637 0.51062)"/></clipPath></defs></svg></div>
                                        <p className="text-sm font-Roboto text-[#AFAFAF] flex-grow sm:text-base min-w-[160px] max-w-full">You searched {search}</p>
                                    </div>
                                    <hr className="h-[1px] w-full px-0 border-[#525252]" />
                                    {isSearchLoading ? <SearchSkeleton /> : recievedItems.length === 0 ? <div className="w-full text-center py-4"><h1>No users found!</h1></div> : recievedItems.map((user) => <SearchedUser key={user.userId} searchedUser={user}/>)}
                                    <div className={`w-full flex justify-center py-4 ${isSearchLoading || recievedItems.length === 0 ? 'hidden' : 'flex'}`}>
                                        <button className={`flex flex-col text-[#AFAFAF] font-Roboto text-sm sm:text-base cursor-pointer`} onClick={() => handleSeeMore(search)}>See more<span className="w-full h-[1px] bg-[#AFAFAF]"></span></button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <button className={`px-0 group w-[25px] h-[25px] md:w-[35px] md:h-[35px] 2xl:w-[40px] 2xl:h-[40px] cursor-pointer`} onClick={() => router.push('/people')}><svg viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_73)"><path d="M8.44333 9.55808V8.67007C8.44333 8.19904 8.25622 7.7473 7.92315 7.41423C7.59008 7.08116 7.13834 6.89404 6.66731 6.89404H3.11526C2.64423 6.89404 2.19249 7.08116 1.85942 7.41423C1.52635 7.7473 1.33923 8.19904 1.33923 8.67007V9.55808" stroke="#AFAFAF" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.89138 5.11797C5.87225 5.11797 6.66741 4.32281 6.66741 3.34194C6.66741 2.36107 5.87225 1.56592 4.89138 1.56592C3.91051 1.56592 3.11536 2.36107 3.11536 3.34194C3.11536 4.32281 3.91051 5.11797 4.89138 5.11797Z" stroke="#AFAFAF" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.1074 9.5581V8.67009C11.1071 8.27658 10.9761 7.89431 10.7351 7.5833C10.494 7.27229 10.1564 7.05016 9.77539 6.95178" stroke="#AFAFAF" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.99939 1.62366C8.38142 1.72147 8.72003 1.94365 8.96183 2.25517C9.20364 2.56669 9.33489 2.94983 9.33489 3.34418C9.33489 3.73853 9.20364 4.12167 8.96183 4.43319C8.72003 4.74471 8.38142 4.96689 7.99939 5.06471" stroke="#AFAFAF" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_109_73"><rect width="10.6561" height="10.6561" fill="white" transform="translate(0.895264 0.234009)"/></clipPath></defs></svg>{path === '/people' ? <span className="block bg-[#AFAFAF] border-[#AFAFAF] h-[2px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-[#535252] border-[#535252] h-[2px]"></span>}</button>           
                </div>
                <div className="w-[33%] flex justify-end gap-1 items-center">
                    <div className={`w-fit absolute flex flex-col items-center rounded-tr-xl rounded-tl-xl pl-6 pr-2 mr-1 bg-[#222222] ${pcPopoverOpen ? 'shadow-[0px_-2px_10px_0px_rgba(0,_0,_0,_0.26)]' : ''}`}>
                        <div className="flex flex-col items-center justify-end w-full">
                            <div className={`flex items-center ${pcPopoverOpen ? 'justify-between' : 'justify-end'} gap-6 w-full`}>
                                {pcPopoverOpen && (
                                    <div className="flex flex-col items-start mr-2 w-[150px]">
                                        <h1 className="text-[#DFDEDE] font-Roboto text-sm xl:text-base max-w-[150px] truncate">{user?.firstName} {user?.lastName}</h1>
                                        <p className="text-[#DFDEDE] font-Roboto text-sm xl:text-base">@{user?.username}</p>
                                    </div>
                                )}
                                <Avatar className="sm:w-[45px] sm:h-[45px] lg:w-[65px] lg:h-[65px] cursor-pointer relative z-10" onClick={() => setPcPopoverOpen(!pcPopoverOpen)}>
                                    <AvatarImage src={`${user?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{ boxShadow: '0px 6px 6px 0px #00000040'}} /><AvatarFallback>{shortUsername}</AvatarFallback>
                                </Avatar> 
                            </div>
                            {pcPopoverOpen && (
                            <div className="absolute top-full bg-[#222222] px-4 right-0 py-4 flex flex-col gap-2 w-full rounded-br-xl rounded-bl-xl z-0 shadow-[0px_5px_10px_0px_rgba(0,_0,_0,_0.26)]">
                                <div className="flex flex-col gap-2">
                                    <button className="text-[#DFDEDE] font-Roboto text-sm xl:text-base flex gap-1 px-4 py-2 bg-[#515151] rounded-full w-full justify-center items-center hover:opacity-80 transition-all cursor-pointer" onClick={() => {setPcPopoverOpen(false); router.push(`/users/${user?.username}`)}}><UserIcon className="size-4 xl:size-6"/>Show Profile</button>
                                    <button className="text-[#DFDEDE] font-Roboto text-sm xl:text-base flex gap-2 px-4 py-2 bg-[#515151] rounded-full w-full justify-center items-center hover:opacity-80 transition-all cursor-pointer" onClick={() => logout()}><LogOut className="size-4 xl:size-6"/> Logout</button>
                                </div>
                                <div className="w-full pt-6">
                                    <button className="bg-[#CA3C3C] text-[#DFDEDE] font-semibold font-Roboto text-sm xl:text-base flex gap-2 px-4 py-2 rounded-full w-full justify-center items-center hover:opacity-80 transition-all cursor-pointer" onClick={() => {setPcPopoverOpen(false);setDeleteAccOpen(true)}}><Trash2 className="size-4 xl:size-6"/> Delete Account</button>
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={deleteAccOpen} onOpenChange={setDeleteAccOpen}>
                <DialogContent className='bg-[#252525] border-none rounded-xl max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-2xl [&>button]:text-white px-4 lg:px-8 py-4'>
                    <DialogHeader>
                        <DialogTitle className='text-[#fff] text-left text-xs sm:text-base md:text-lg font-semibold font-Roboto sm:text-center'>Are you sure you want to delete your account?</DialogTitle>
                    </DialogHeader>
                    <p className='font-Roboto text-[#A6A6A6] text-center text-xs sm:text-base md:text-lg'>This action is permanent and you will not be able to access your account anymore.</p>
                    <div className='flex justify-center gap-4'>
                        <Button onClick={() => setDeleteAccOpen(false)} className='cursor-pointer px-2 sm:px-8 rounded-full bg-[#1565CE] hover:bg-[#1565CE] transition-all shadow-[0px_3px_5px_0px_rgba(21,101,206,0.25)] hover:shadow-[0px_3px_5px_0px_rgba(21,101,206,0.50)] hover:opacity-90 font-normal font-Roboto text-white'>No, I changed my mind</Button>
                        <Button variant="destructive" onClick={() => deleteAccount()} className='bg-[#EF4444] hover:bg-[#EF4444] cursor-pointer px-2 sm:px-8 rounded-full transition-all shadow-[0px_3px_5px_0px_rgba(202,60,60,0.25)] hover:shadow-[0px_3px_5px_0px_rgba(202,60,60,0.50)] font-normal font-Roboto text-white'><Trash2 size={10}/> Yes, I'm sure</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
});

export default Navbar;
