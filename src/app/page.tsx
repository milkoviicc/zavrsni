/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

import img from '@/../public/images/test.png';

import {Flex, Avatar} from '@radix-ui/themes'

import { Input } from '@/components/ui/input';

export default function Home() {

  const {user, logout, isAuthenticated, fullyRegistered, addDetails } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');


  

  return (
    <div className='h-full'>
      {isAuthenticated && fullyRegistered
      ?
      <div className="relative pt-[75px] w-full">
        <div className="border-1 border-gray-900 bg-gray-500 px-4 py-8 text-white">
          <h1 className="text-lg py-4">Tell us your thoughts!</h1>
          <div className="flex gap-2">
            <div>
              <Flex gap="2">
                <Avatar src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" fallback="A" />
              </Flex>
              </div>
            <textarea placeholder="Tell us what you think." rows={2} className="placeholder-white text-white bg-transparent resize-none border-b-2 px-2 py-1 border-gray-800 w-1/3 hover:border-gray-600 focus:border-gray-600 transition-all outline-none"></textarea>
          </div>
        </div>
      </div>

      :  isAuthenticated && !fullyRegistered 
      ?  
      <div className="border-1 border-black bg-[#f5f4f4] rounded-md shadow-lg ">
        <div className="px-8 py-14">
          <h1>We just need a little more information about you.</h1>
          <p>Please enter your full name.</p>
          <input type="text" className={`w-full py-3 px-4 borde border-gray-300  rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='First name' id="firstname" onChange={(e) => setFirstName(e.target.value)}/>
          <input type="text" className={`w-full py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Last name' id="lastname" onChange={(e) => setLastName(e.target.value)}/>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold w-full py-2 border border-blue-700 rounded transition-all' onClick={() => addDetails(firstName, lastName)}>Confirm</button>
        </div>
      </div>
      :
      null
      }
    </div>
  );
}
