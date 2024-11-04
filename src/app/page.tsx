/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

import img from '@/../public/images/test.png';

import {Flex, Avatar} from '@radix-ui/themes'

import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import Posts from "./components/Posts/page";

import axios from "axios";



export default function Home() {

  const {user, logout, isAuthenticated, fullyRegistered, addDetails } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [content, setContent] = useState('');


  const sendPost = async () => {
    try {
      const res = await axios.post('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/add-post', {content});

      if(res.status === 200) {
        console.log('Post has been succesfully added');
        setContent('');
      }
    } catch(err) {
        console.error('Could not add post', err);
    }
    
  }
  

  return (
    <div className='h-full'>
      {isAuthenticated && fullyRegistered
      ?
      <div className="h-full py-[75px] w-full">
        <div className="border-1 border-gray-900 bg-[#f5f4f4] px-4 py-8 h-full flex flex-col items-center gap-12">
          <div className="flex gap-2 items-center flex-col w-fit">
            <div className="flex flex-row w-fit justify-center items-center gap-4">
              <Flex gap="2">
                <Avatar src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" fallback="A" />
              </Flex>
              <textarea placeholder="Tell us what you think." value={content} rows={2} cols={50} onChange={(e) => setContent(e.target.value)} className="w-full placeholder-gray-900 text-gray-900 bg-transparent resize-none border-b-2 px-2 py-1 border-gray-800 hover:border-gray-600 focus:border-gray-600 transition-all outline-none"></textarea>
            </div>
            <div className="w-full flex justify-end">
              <Button variant="shine" onClick={() => sendPost()}>Post</Button>
            </div>
          </div>
          <div className="h-full w-full flex flex-col items-center">
            <h1 className="text-xl text-gray-900 py-4">All posts</h1>
            <hr className="w-[60%] border-gray-900" />
            <div>
              <Posts />
            </div>
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
            <input type="text" className={`w-full py-3 px-4 borde border-gray-300  rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='First name' id="firstname" onChange={(e) => setFirstName(e.target.value)}/>
            <input type="text" className={`w-full py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Last name' id="lastname" onChange={(e) => setLastName(e.target.value)}/>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold w-full py-2 border border-blue-700 rounded transition-all' onClick={() => addDetails(firstName, lastName)}>Confirm</button>
          </div>
        </div>
      </div>
      
      :
      null
      }
    </div>
  );
}
