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
import Posts from "./components/posts";

import axios from "axios";
import ResizableTextarea from "./components/ResizableTextarea";
import { User } from "./types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

import TextareaAutosize from 'react-textarea-autosize';
import { debounce } from "lodash";
import ResizablePost from "./components/sendPost";
import SendPost from "./components/sendPost";



export default function Home() {

  // funckije iz AuthProvider.tsx-a
  const {isAuthenticated, fullyRegistered, defaultPicture, addDetails, addImage } = useAuth();

  // stateovi
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [postFile, setPostFile] = useState<File[]>([]);
  const [postsState, setPostsState] = useState<'Popular' | 'Your Friends'>('Popular');


  const user: User = JSON.parse(localStorage.getItem('user') || '{}');

  const getPostsRef = useRef<(() => void) | undefined>();

  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  if(!user) {
    return false;
  }
  
  

  return (
    <div className='h-full flex flex-col my-[75px]'>
      {isAuthenticated && fullyRegistered && !defaultPicture
      ?
      <div className="h-full flex flex-grow flex-col bg-white">
        <div className="flex w-full justify-evenly">
          <div className="flex flex-col fixed w-[200px] top-28 left-40">
            <h1 className="font-Roboto text-2xl">Who's popular</h1>
            <button className="hover:cursor-pointer flex gap-2 py-8 items-center">
              <Flex gap="2">
                  <Avatar src={`${user.profile.pictureUrl}`} style={{ width: '45px', height: '45px', borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
              </Flex>
              <div className="flex flex-col h-full items-start justify-center gap-3">
                  <h1 className="text-black font-[400] font-Roboto leading-[8.23px] text-lg">{user.profile.firstName} {user.profile.lastName}</h1>
                  <p className="text-[#7D7D7D] leading-[5.66px]">@{user.username}</p>
              </div>    
            </button>
          </div>
          <div className="border-1 border-gray-900 py-16 h-full flex flex-col items-center gap-12">
            <div className="flex gap-2 items-center flex-col w-fit bg- rounded-full shadow-[1px_1px_2px_0px_rgba(0,_0,_0,_0.3)] bg-[#ededed]">
              <SendPost user={user} getPostsRef={getPostsRef} />
            </div>
            <div className="h-full w-full flex flex-col items-center ">
              <hr className="w-full border-[#828282]" />
              <div className="flex gap-4 py-6 items-center">
                <div>
                  <button className={`text-2xl text-gray-900 ${postsState === "Popular" ? 'font-medium' : null}`} onClick={() => setPostsState('Popular')}>Popular</button>
                  <span className={`${postsState === 'Popular' ? 'block' : 'hidden'} bg-[#424242] w-full h-[2px]`}></span>
                </div>
                <span className="h-10 block border-black bg-black w-[1px]"></span>
                <div>
                  <button className={`text-2xl text-gray-900 ${postsState === "Your Friends" ? 'font-medium' : null}`} onClick={() => setPostsState('Your Friends')}>Your Friends</button>
                  <span className={`${postsState === 'Your Friends' ? 'block' : 'hidden'} bg-[#424242] w-full h-[1px]`}></span>
                </div>
                
              </div>
              <div className="w-full flex justify-center">
                <Posts setGetPostsRef={(fn) => (getPostsRef.current = fn)}/>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[200px] fixed top-28 right-40">
            <h1 className="font-Roboto text-2xl">Friends</h1>
            <button className="hover:cursor-pointer flex gap-2 py-8 items-center">
              <Flex gap="2">
                  <Avatar src={`${user.profile.pictureUrl}`} style={{ width: '45px', height: '45px', borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
              </Flex>
              <div className="flex flex-col h-full items-start justify-center gap-3">
                  <h1 className="text-black font-[400] font-Roboto leading-[8.23px] text-lg">{user.profile.firstName} {user.profile.lastName}</h1>
                  <p className="text-[#7D7D7D] leading-[5.66px]">@{user.username}</p>
              </div>    
            </button>
          </div>
        </div>
      </div>

      :  isAuthenticated && !fullyRegistered 
      ?  
      <div className="flex justify-center items-center h-full">
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
      : isAuthenticated && fullyRegistered && defaultPicture
      ? 
        <div className="flex justify-center items-center h-full">
          <div className="border-1 border-black bg-[#f5f4f4] rounded-md shadow-lg">
            <div className="px-8 py-14">
            <h1>Add a profile picture</h1>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold w-full py-2 border border-blue-700 rounded transition-all' onClick={() => selectedImage && addImage(selectedImage)}>Add picture</button>
            </div>
          </div>
        </div>
      : null
      }
    </div>
  );
}
