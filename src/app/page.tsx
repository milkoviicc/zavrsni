/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "./context/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

import img from '@/../public/images/test.png';

import {Flex, Avatar} from '@radix-ui/themes';

import { Input } from '@/src/components/ui/input';


import axios from "axios";
import ResizableTextarea from "./components/ResizableTextarea";
import { Friendship, Profile, User } from "./types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

import TextareaAutosize from 'react-textarea-autosize';
import { debounce, set } from "lodash";

import UserComponent from "./components/userComponent";
import FullPosts from "./components/fullPosts";
import InfiniteScroll from "react-infinite-scroll-component";



export default function Home() {

  // funckije iz AuthProvider.tsx-a
  const {isAuthenticated, fullyRegistered, defaultPicture, ignoreDefaultPic, setIgnoreDefaultPic, addDetails, addImage } = useAuth();

  // stateovi
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [postFile, setPostFile] = useState<File[]>([]);
  const [popularUsers, setPopularUsers] = useState<Profile[]>([]);
  const [friendsList, setFriendsList] = useState<Friendship[]>([]);
  const [ignoreDefaultPicture, setIgnoreDefaultPicture] = useState(false);


  const user: User = JSON.parse(localStorage.getItem('user') || '{}');

  const getPostsRef = useRef<(() => void) | undefined>();
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  useEffect(() => {
    const getPopularUsers = async () => {
      try {
        const res = await axios.get<Profile[]>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/popular?limit=10');

        const resData = res.data.filter((profile) => profile.firstName != null);

        if(res.status === 200) {
          setPopularUsers(resData);
        }

      } catch(err) {
        console.error(err);
      }
    }

    getPopularUsers();
  },[]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get<Friendship[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/${user.userId}`);

        const resData = res.data.filter((profile) => profile.user.firstName != null);

        if(res.status === 200) {
          setFriendsList(resData);
        }
      } catch(err) {
        console.error(err);
      }
    };
    getFriends();
  }, [user.userId]);

  useEffect(() => {
    if(defaultPicture) {
      const ignorePic = localStorage.getItem('ignorePic');
      if(ignorePic) {
        setIgnoreDefaultPicture(true);
      }
    } else {
      return;
    }
    
  }, [defaultPicture]);

  const handleSkip = () => {
    localStorage.setItem('ignorePic', 'true');
    setIgnoreDefaultPic(true);
    setIgnoreDefaultPicture(true);
  }

  if(!user) {
    return false;
  }
  
  return (
    <div className='hidden flex-col mt-[70px] min-h-[786px]'>
      {isAuthenticated && fullyRegistered && !defaultPicture || ignoreDefaultPicture 
      ?
      <div className="flex-col bg-[#222222] shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0,_0.26)] min-h-[840px] py-24">
        <div className="flex w-full justify-evenly">
          <div className="sm:flex hidden flex-col gap-0 fixed w-[220px] top-41 left-40 text-center rounded-lg py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525]">
            <h1 className="font-Roboto text-3xl pb-4 px-4 text-[#EFEFEF] font-normal">Who's popular</h1>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
            <div className='group w-full flex flex-col gap-2 bg-transparent px-4 max-h-[600px] overflow-y-hidden  hover:overflow-y-scroll scrollbar'>
              { popularUsers.map((user, index) => <UserComponent user={user} key={index} />)}
            </div>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
          </div>
          <FullPosts user={user} />
          <div className="sm:flex hidden flex-col gap-0 fixed w-[220px] top-41 right-40 text-center rounded-lg py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525]">
            <h1 className="font-Roboto text-3xl pb-4 px-4 text-[#EFEFEF] font-normal">Friends</h1>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
            <div className='group w-full h-[600px] flex flex-col gap-2 bg-transparent px-4 overflow-y-hidden hover:overflow-y-scroll scrollbar '>
              { friendsList.map((user, index) => <UserComponent user={user.user} key={index} />)}
            </div>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
          </div>
        </div>
      </div>

      :  isAuthenticated && !fullyRegistered 
      ?  
      <div className="flex justify-center items-center h-full min-h-[786px] bg-[#222222]">
        <div className="border-1 border-black bg-[#f5f4f4] rounded-md shadow-lg">
          <div className="px-8 py-14">
            <h1>We just need a little more information about you.</h1>
            <p>Please enter your full name.</p>
            <input type="text" className={`w-full py-3 px-4 border border-gray-300  rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='First name' id="firstname" onChange={(e) => setFirstName(e.target.value)} autoComplete="off"/>
            <input type="text" className={`w-full py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Last name' id="lastname" onChange={(e) => setLastName(e.target.value)} autoComplete="off"/>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold w-full py-2 border border-blue-700 rounded transition-all' onClick={() => addDetails(firstName, lastName)}>Confirm</button>
          </div>
        </div>
      </div>
      : isAuthenticated && fullyRegistered && defaultPicture && !ignoreDefaultPicture
      ? 
        <div className="flex justify-center items-center h-full min-h-[786px] bg-[#222222]">
          <div className="border-1 border-black bg-[#f5f4f4] rounded-md shadow-lg">
            <div className="px-8 py-14">
              <h1>Add a profile picture</h1>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold w-full py-2 border border-blue-700 rounded transition-all' onClick={() => selectedImage && addImage(selectedImage)}>Add picture</button>
            </div>
            <div>
              <h1>Don't want to add now?</h1>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full py-2 border border-blue-700 rounded transition-all" onClick={() => handleSkip()}>Skip</button>
            </div>
          </div>
        </div>
      : null
      }
    </div>
  );
}
