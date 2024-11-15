/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState, useRef } from "react";
import { useAuth } from "./context/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

import img from '@/../public/images/test.png';

import {Flex, Avatar} from '@radix-ui/themes';

import { Input } from '@/src/components/ui/input';
import { Button } from "@/src/components/ui/button";
import Posts from "./components/posts";

import axios from "axios";
import ResizableTextarea from "./components/ResizableTextarea";



export default function Home() {

  // funckije iz AuthProvider.tsx-a
  const {isAuthenticated, fullyRegistered, addDetails } = useAuth();

  // stateovi
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [content, setContent] = useState('');

  // getPostRef kako bi se postovi re-renderali na svakom novom dodanom postu

  const getPostsRef = useRef<(() => void) | undefined>();

  const user = JSON.stringify(localStorage.getItem('user'));


  // async funkcija koja se poziva kada se klikne na gumb 'Send'
  const sendPost = async () => {
    try {

      // šalje se axios post request na API i prenosi se vrijednost content statea, tj. uneseni tekst posta
      const res = await axios.post('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/add-post', {content});

      // ukoliko je res.status jednak 200 novi post je dodan i vrijednost content statea se ponovno stavlja na empty string tj. ''
      if(res.status === 200) {
        setContent('');
      }

      // pošto je sve prošlo poziva se getPosts funkcija kako bi se postovi re-renderali
      if(getPostsRef.current) {
        getPostsRef.current();
      }
    } catch(err) {
        // ukoliko je došlo do greške, ispisuje se u konzoli
        console.error('Could not add post', err);
    }
  }
  

  return (
    <div className='h-full flex flex-col my-[75px]'>
      {isAuthenticated && fullyRegistered
      ?
      <div className="h-full flex flex-grow flex-col bg-[#f5f4f4]">
        <div className="border-1 border-gray-900  px-4 py-8 h-full flex flex-col items-center gap-12 ">
          <div className="flex gap-2 items-center flex-col w-fit bg-[#EDEDED] rounded-full shadow-[1px_1px_2px_0px_rgba(0,_0,_0,_0.3)]">
            <div className="flex flex-row w-fit justify-center gap-4 py-4 px-4">
              <Flex gap="2" className="pt-2">
                <Avatar src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" style={{  borderRadius: '25px'}} fallback="A" />
              </Flex>
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <ResizableTextarea placeholder={`What's on your mind, Eminem`} value={content} onChange={(e) => setContent(e.target.value)} className="w-[500px] max-h-[150px] text-[#363636] outline-none px-2 py-1 rounded resize-none overflow-hidden border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-gray-900  bg-transparent transition-all"/>
                  <Button variant="shine" onClick={() => sendPost()} className="rounded-full">Post</Button>
                </div>
                <h1>Add file</h1>
              </div>
              
            </div>
          </div>
          <div className="h-full w-full flex flex-col items-center ">
            <h1 className="text-xl text-gray-900 py-4">All posts</h1>
            <hr className="w-[60%] border-gray-900" />
            <div className="w-full flex justify-center">
              <Posts setGetPostsRef={(fn) => (getPostsRef.current = fn)}/>
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
            <input type="text" className={`w-full py-3 px-4 border border-gray-300  rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='First name' id="firstname" onChange={(e) => setFirstName(e.target.value)} autoComplete="off"/>
            <input type="text" className={`w-full py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Last name' id="lastname" onChange={(e) => setLastName(e.target.value)} autoComplete="off"/>
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
