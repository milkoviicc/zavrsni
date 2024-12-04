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
import { debounce } from "lodash";

import UserComponent from "./components/userComponent";
import FullPosts from "./components/fullPosts";



export default function Home() {

  // funckije iz AuthProvider.tsx-a
  const {isAuthenticated, fullyRegistered, defaultPicture, addDetails, addImage } = useAuth();

  // stateovi
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [postFile, setPostFile] = useState<File[]>([]);
  const [popularUsers, setPopularUsers] = useState<Profile[]>([]);
  const [friendsList, setFriendsList] = useState<Friendship[]>([]);


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
        const res = await axios.get<Friendship[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/${user.id}`);

        const resData = res.data.filter((profile) => profile.user.firstName != null);

        if(res.status === 200) {
          setFriendsList(resData);
        }
      } catch(err) {
        console.error(err);
      }
    };
    getFriends();
  }, []);

  if(!user) {
    return false;
  }
  
  return (
    <div className='h-full flex flex-col my-[75px]'>
      {isAuthenticated && fullyRegistered && !defaultPicture
      ?
      <div className="h-full flex flex-grow flex-col bg-white">
        <div className="flex w-full justify-evenly">
          <div className="flex flex-col gap-0 fixed w-[200px] top-28 left-40">
            <h1 className="font-Roboto text-2xl">Who's popular</h1>
            {popularUsers.map((user, index) => (
              <UserComponent user={user} key={index} />
            ))}
          </div>
          <FullPosts user={user} />
          <div className="flex flex-col w-[200px] fixed top-28 right-40">
            <h1 className="font-Roboto text-2xl">Friends</h1>
            {friendsList.map((user, index) => (
              <UserComponent user={user.user} key={index} />
            ))}
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
