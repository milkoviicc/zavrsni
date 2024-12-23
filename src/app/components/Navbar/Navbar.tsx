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
        <div className="border-1 border-black bg-white rounded-md [box-shadow:0px_0.5px_20.16px_0px_rgba(0,_0,_0,_0.26)] h-[75px] fixed top-0 w-full">
            <div className="flex justify-between items-center h-full w-full">
                <div className="w-[33%] flex justify-start ml-10">
                    <h1 className="text-2xl">SNet</h1>
                </div>
                <div className="flex w-full justify-center gap-2 items-center">
                    <button className={`px-0 group`} onClick={() => router.push('/')}><svg width="40" height="40" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_85)"><path d="M13.6117 0.753662H0.841309V13.5241H13.6117V0.753662Z" fill="white" fillOpacity="0.01"/><path fillRule="evenodd" clipRule="evenodd" d="M3.23577 11.9278V5.54258L1.90552 6.60678L7.22652 2.34998L12.5475 6.60678L11.2173 5.54258V11.9278H3.23577Z" stroke="#535353" strokeWidth="0.605214" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M5.89636 8.46899V11.9276H8.55686V8.46899H5.89636Z" stroke="#535353" strokeWidth="0.605214" strokeLinejoin="round"/><path d="M3.23572 11.9276H11.2172" stroke="#535353" strokeWidth="0.605214" strokeLinecap="round"/></g><defs><clipPath id="clip0_109_85"><rect width="12.7704" height="12.7704" fill="white" transform="translate(0.841309 0.753662)"/></clipPath></defs></svg>{path === '/' ? <span className="block bg-[#535252] border-[#535252] h-[2px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-[#535252] border-[#535252] h-[2px]"></span>}</button>           
                    <button className={`px-0 group`} onClick={() => router.push(`/people`)}><svg width="40" height="40" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_73)"><path d="M8.44333 9.55808V8.67007C8.44333 8.19904 8.25622 7.7473 7.92315 7.41423C7.59008 7.08116 7.13834 6.89404 6.66731 6.89404H3.11526C2.64423 6.89404 2.19249 7.08116 1.85942 7.41423C1.52635 7.7473 1.33923 8.19904 1.33923 8.67007V9.55808" stroke="#525252" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.89138 5.11797C5.87225 5.11797 6.66741 4.32281 6.66741 3.34194C6.66741 2.36107 5.87225 1.56592 4.89138 1.56592C3.91051 1.56592 3.11536 2.36107 3.11536 3.34194C3.11536 4.32281 3.91051 5.11797 4.89138 5.11797Z" stroke="#525252" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.1074 9.5581V8.67009C11.1071 8.27658 10.9761 7.89431 10.7351 7.5833C10.494 7.27229 10.1564 7.05016 9.77539 6.95178" stroke="#525252" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.99939 1.62366C8.38142 1.72147 8.72003 1.94365 8.96183 2.25517C9.20364 2.56669 9.33489 2.94983 9.33489 3.34418C9.33489 3.73853 9.20364 4.12167 8.96183 4.43319C8.72003 4.74471 8.38142 4.96689 7.99939 5.06471" stroke="#525252" strokeWidth="0.666009" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_109_73"><rect width="10.6561" height="10.6561" fill="white" transform="translate(0.895264 0.234009)"/></clipPath></defs></svg>{path === `/profile/${user.userId}` ? <span className="block bg-[#535252] border-[#535252] h-[2px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-[#535252] border-[#535252] h-[2px]"></span>}</button>
                    <div className="w-fit relative">
                        <label htmlFor="search" className="absolute right-2 top-0"><svg width="35" height="35" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="search-outline 1" clipPath="url(#clip0_109_55)"><g id="Layer 2"><g id="search"><path id="Vector" d="M8.8472 8.21306L7.48959 6.85944C7.92761 6.3014 8.16528 5.6123 8.1644 4.90288C8.1644 4.27109 7.97705 3.65349 7.62605 3.12818C7.27505 2.60286 6.77615 2.19343 6.19246 1.95166C5.60876 1.70988 4.96648 1.64662 4.34683 1.76988C3.72718 1.89313 3.15799 2.19737 2.71125 2.64411C2.26451 3.09085 1.96027 3.66004 1.83702 4.27969C1.71376 4.89934 1.77702 5.54162 2.01879 6.12532C2.26057 6.70901 2.67 7.20791 3.19532 7.55891C3.72063 7.90992 4.33823 8.09726 4.97002 8.09726C5.67943 8.09815 6.36854 7.86047 6.92658 7.42245L8.2802 8.78006C8.31732 8.81749 8.36148 8.84719 8.41014 8.86747C8.4588 8.88774 8.51099 8.89817 8.5637 8.89817C8.61641 8.89817 8.6686 8.88774 8.71726 8.86747C8.76592 8.84719 8.81008 8.81749 8.8472 8.78006C8.88463 8.74294 8.91433 8.69878 8.9346 8.65012C8.95488 8.60146 8.96531 8.54927 8.96531 8.49656C8.96531 8.44385 8.95488 8.39166 8.9346 8.343C8.91433 8.29434 8.88463 8.25018 8.8472 8.21306ZM2.57423 4.90288C2.57423 4.42904 2.71474 3.96584 2.97799 3.57185C3.24125 3.17787 3.61542 2.87079 4.05319 2.68946C4.49096 2.50813 4.97268 2.46069 5.43741 2.55313C5.90215 2.64557 6.32904 2.87375 6.6641 3.2088C6.99915 3.54386 7.22733 3.97075 7.31977 4.43549C7.41221 4.90022 7.36477 5.38194 7.18344 5.81971C7.00211 6.25748 6.69503 6.63165 6.30105 6.8949C5.90706 7.15816 5.44386 7.29867 4.97002 7.29867C4.33462 7.29867 3.72524 7.04626 3.27594 6.59696C2.82664 6.14766 2.57423 5.53828 2.57423 4.90288Z" fill="#5D5D5D"/></g></g></g><defs><clipPath id="clip0_109_55"><rect width="9.58315" height="9.58315" fill="white" transform="translate(0.577637 0.51062)"/></clipPath></defs></svg></label>
                        <Input type="text"id="search" autoComplete="off" value={search} placeholder="Search something or someone..." onChange={(e) => setSearch(e.target.value)} className="bg-white font-Roboto w-[500px] text-[#424242] text-base rounded-3xl shadow-[0px_0px_3px_0.2px_rgba(0,0,0,0.35)] border focus-visible:ring-0 border-[#868686] "/>  
                        {recievedItems.length > 0 ? (
                            <div className=" bg-white w-full h-fit absolute top-[36px] left-0 rounded-sm border border-black">
                                <div className="flex flex-col items-start px-2 gap-2">
                                    {recievedItems.map((item, index) => (<button key={index} onClick={() => handleRoute(item)} className="hover:cursor-pointer hover:underline transition-all">{item    .username}</button>))}
                                </div>
                            </div>
                        ) : null}
                        
                    </div>
                    <button className={`px-0 group`} onClick={() => router.push(`/chat`)}><svg width="40" height="40" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_78)"><path d="M9.26445 4.45607C9.26445 3.63705 8.9391 2.85156 8.35996 2.27242C7.78081 1.69328 6.99533 1.36792 6.1763 1.36792C5.35727 1.36792 4.57179 1.69328 3.99264 2.27242C3.4135 2.85156 3.08814 3.63705 3.08814 4.45607C3.08814 8.05892 1.54407 9.08831 1.54407 9.08831H10.8085C10.8085 9.08831 9.26445 8.05892 9.26445 4.45607Z" stroke="#525252" strokeWidth="0.693327" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.0666 11.1471C6.97611 11.3031 6.84623 11.4326 6.68996 11.5226C6.53369 11.6126 6.35652 11.66 6.17618 11.66C5.99585 11.66 5.81867 11.6126 5.6624 11.5226C5.50614 11.4326 5.37625 11.3031 5.28577 11.1471" stroke="#525252" strokeWidth="0.693327" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_109_78"><rect width="12.3526" height="12.3526" fill="white" transform="translate(0 0.338501)"/></clipPath></defs></svg>{path === '/chat' ? <span className="block bg-[#535252] border-[#535252] h-[2px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-[#535252] border-[#535252] h-[2px]"></span>}</button>
                    <button className={`px-0 group`} onClick={() => router.push(`/`)}><svg width="40" height="40" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.9622 6.17924C10.9639 6.84958 10.8073 7.51086 10.5051 8.10921C10.1467 8.82622 9.59582 9.4293 8.91408 9.8509C8.23234 10.2725 7.44669 10.496 6.64512 10.4963C5.97477 10.498 5.3135 10.3414 4.71515 10.0392L1.82019 11.0042L2.78518 8.10921C2.48295 7.51086 2.32633 6.84958 2.32808 6.17924C2.32839 5.37767 2.55186 4.59201 2.97346 3.91028C3.39506 3.22854 3.99814 2.67764 4.71515 2.3193C5.3135 2.01707 5.97477 1.86045 6.64512 1.8622H6.89906C7.95768 1.9206 8.95755 2.36742 9.70724 3.11711C10.4569 3.86681 10.9038 4.86668 10.9622 5.92529V6.17924Z" stroke="#525252" strokeWidth="0.653468" strokeLinecap="round" strokeLinejoin="round"/></svg>{path === '/notification' ? <span className="block bg-black border-black h-[1px]"></span> : <span className="block opacity-0 group-hover:opacity-100 transition-all bg-[#535252] border-[#535252] h-[2px]"></span>}</button>
                </div>
                <div className="w-[33%] flex justify-end gap-4 items-center">
                    <Button asChild variant="link" size="icon" onClick={logout} className="uppercase hover:cursor-pointer"><svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_109_68)"><path d="M5.45901 7.79803C6.21276 7.79803 6.82379 7.187 6.82379 6.43326C6.82379 5.67951 6.21276 5.06848 5.45901 5.06848C4.70527 5.06848 4.09424 5.67951 4.09424 6.43326C4.09424 7.187 4.70527 7.79803 5.45901 7.79803Z" stroke="#525252" strokeWidth="0.67742" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.82571 7.79791C8.76515 7.93513 8.74709 8.08733 8.77384 8.23491C8.8006 8.38248 8.87096 8.51866 8.97583 8.62588L9.00313 8.65317C9.08772 8.73767 9.15483 8.83802 9.20062 8.94847C9.24641 9.05893 9.26998 9.17732 9.26998 9.29689C9.26998 9.41646 9.24641 9.53486 9.20062 9.64531C9.15483 9.75576 9.08772 9.85611 9.00313 9.94061C8.91863 10.0252 8.81828 10.0923 8.70783 10.1381C8.59737 10.1839 8.47898 10.2075 8.35941 10.2075C8.23984 10.2075 8.12144 10.1839 8.01099 10.1381C7.90054 10.0923 7.80019 10.0252 7.71569 9.94061L7.68839 9.91332C7.58118 9.80844 7.445 9.73809 7.29743 9.71133C7.14985 9.68457 6.99764 9.70263 6.86043 9.76319C6.72588 9.82086 6.61112 9.91661 6.53029 10.0387C6.44946 10.1607 6.40609 10.3037 6.4055 10.4501V10.5275C6.4055 10.7688 6.30964 11.0002 6.13901 11.1708C5.96838 11.3415 5.73696 11.4373 5.49565 11.4373C5.25435 11.4373 5.02292 11.3415 4.85229 11.1708C4.68166 11.0002 4.5858 10.7688 4.5858 10.5275V10.4865C4.58228 10.3359 4.53354 10.1899 4.44592 10.0674C4.35829 9.94489 4.23584 9.85158 4.09448 9.79958C3.95727 9.73903 3.80506 9.72096 3.65749 9.74772C3.50991 9.77448 3.37373 9.84483 3.26652 9.94971L3.23922 9.97701C3.15472 10.0616 3.05438 10.1287 2.94392 10.1745C2.83347 10.2203 2.71507 10.2439 2.5955 10.2439C2.47593 10.2439 2.35754 10.2203 2.24708 10.1745C2.13663 10.1287 2.03628 10.0616 1.95178 9.97701C1.86719 9.89251 1.80008 9.79216 1.75429 9.6817C1.7085 9.57125 1.68494 9.45285 1.68494 9.33329C1.68494 9.21372 1.7085 9.09532 1.75429 8.98487C1.80008 8.87441 1.86719 8.77407 1.95178 8.68957L1.97908 8.66227C2.08396 8.55505 2.15431 8.41888 2.18107 8.2713C2.20783 8.12373 2.18976 7.97152 2.1292 7.83431C2.07154 7.69975 1.97578 7.585 1.85373 7.50417C1.73168 7.42334 1.58866 7.37996 1.44227 7.37938H1.36493C1.12362 7.37938 0.892197 7.28352 0.721567 7.11289C0.550937 6.94226 0.455078 6.71084 0.455078 6.46953C0.455078 6.22822 0.550937 5.9968 0.721567 5.82617C0.892197 5.65554 1.12362 5.55968 1.36493 5.55968H1.40587C1.55645 5.55616 1.70249 5.50742 1.82499 5.41979C1.9475 5.33217 2.04082 5.20972 2.09281 5.06836C2.15337 4.93115 2.17143 4.77894 2.14467 4.63136C2.11792 4.48379 2.04756 4.34761 1.94268 4.24039L1.91539 4.2131C1.83079 4.1286 1.76368 4.02825 1.7179 3.9178C1.67211 3.80734 1.64854 3.68895 1.64854 3.56938C1.64854 3.44981 1.67211 3.33142 1.7179 3.22096C1.76368 3.11051 1.83079 3.01016 1.91539 2.92566C1.99989 2.84107 2.10024 2.77396 2.21069 2.72817C2.32114 2.68238 2.43954 2.65881 2.55911 2.65881C2.67868 2.65881 2.79707 2.68238 2.90753 2.72817C3.01798 2.77396 3.11833 2.84107 3.20283 2.92566L3.23012 2.95296C3.33734 3.05783 3.47352 3.12819 3.62109 3.15494C3.76867 3.1817 3.92088 3.16364 4.05809 3.10308H4.09448C4.22904 3.04541 4.34379 2.94966 4.42462 2.82761C4.50545 2.70556 4.54882 2.56253 4.54941 2.41614V2.33881C4.54941 2.0975 4.64527 1.86607 4.8159 1.69544C4.98653 1.52481 5.21795 1.42896 5.45926 1.42896C5.70057 1.42896 5.93199 1.52481 6.10262 1.69544C6.27325 1.86607 6.36911 2.0975 6.36911 2.33881V2.37975C6.36969 2.52614 6.41307 2.66916 6.4939 2.79121C6.57473 2.91327 6.68948 3.00902 6.82404 3.06669C6.96125 3.12724 7.11346 3.14531 7.26103 3.11855C7.40861 3.09179 7.54478 3.02144 7.652 2.91656L7.67929 2.88927C7.7638 2.80467 7.86414 2.73756 7.9746 2.69177C8.08505 2.64599 8.20345 2.62242 8.32301 2.62242C8.44258 2.62242 8.56098 2.64599 8.67143 2.69177C8.78189 2.73756 8.88223 2.80467 8.96673 2.88927C9.05133 2.97377 9.11844 3.07411 9.16423 3.18457C9.21001 3.29502 9.23358 3.41342 9.23358 3.53299C9.23358 3.65255 9.21001 3.77095 9.16423 3.8814C9.11844 3.99186 9.05133 4.0922 8.96673 4.17671L8.93944 4.204C8.83456 4.31122 8.76421 4.44739 8.73745 4.59497C8.71069 4.74254 8.72876 4.89475 8.78931 5.03197V5.06836C8.84698 5.20291 8.94273 5.31767 9.06479 5.3985C9.18684 5.47932 9.32986 5.5227 9.47625 5.52328H9.55359C9.7949 5.52328 10.0263 5.61914 10.1969 5.78977C10.3676 5.9604 10.4634 6.19183 10.4634 6.43314C10.4634 6.67444 10.3676 6.90587 10.1969 7.0765C10.0263 7.24713 9.7949 7.34299 9.55359 7.34299H9.51264C9.36626 7.34357 9.22323 7.38695 9.10118 7.46778C8.97913 7.54861 8.88337 7.66336 8.82571 7.79791Z" stroke="#525252" strokeWidth="0.67742" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="clip0_109_68"><rect width="10.9182" height="10.9182" fill="white" transform="translate(0 0.974121)"/></clipPath></defs></svg></Button>
                    <button className="hover:cursor-pointer flex gap-2" onClick={() => router.push(`/my-profile`)}>
                        <Flex gap="2" className="mr-6">
                            <Avatar src={`${user.pictureUrl}?${new Date().getTime()}`} style={{ width: '60px', height: '60px', borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
                        </Flex> 
                    </button>
                </div>

            </div>
        </div>
    )
};