/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState, useRef } from "react";
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
import { EnhancedButton } from "../components/ui/enhancedButton";



export default function Home() {

  // funckije iz AuthProvider.tsx-a
  const {isAuthenticated, fullyRegistered, defaultPicture, addDetails, addImage } = useAuth();

  // stateovi
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [postFile, setPostFile] = useState<File[]>([]);

  // getPostRef kako bi se postovi re-renderali na svakom novom dodanom postu

  const getPostsRef = useRef<(() => void) | undefined>();

  const user: User = JSON.parse(localStorage.getItem('user') || '{}');

  if(!user) {
    return false;
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handlePostFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      
      // Use the spread operator to append new files without removing previous ones.
      setPostFile((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  // async funkcija koja se poziva kada se klikne na gumb 'Send'
  const sendPost = async () => {
    try {

      const formData = new FormData();
      formData.append('Content', content);

      // If there are files, append them to FormData
      postFile.forEach((file) => {
        formData.append(`Files`, file);
      })  

      // šalje se axios post request na API i prenosi se vrijednost content statea, tj. uneseni tekst posta
      const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/add-post`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      // ukoliko je res.status jednak 200 novi post je dodan i vrijednost content statea se ponovno stavlja na empty string tj. ''
      if(res.status === 200) {
        setContent('');
        setPostFile([]);
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
      {isAuthenticated && fullyRegistered && !defaultPicture
      ?
      <div className="h-full flex flex-grow flex-col bg-[#f5f4f4]">
        <div className="border-1 border-gray-900  px-4 py-8 h-full flex flex-col items-center gap-12 ">
          <div className="flex gap-2 items-center flex-col w-fit bg-[#EDEDED] rounded-full shadow-[1px_1px_2px_0px_rgba(0,_0,_0,_0.3)]">
            <div className="flex flex-row w-fit justify-center items-center gap-4 py-4 px-4">
              <Flex gap="2">
                <Avatar src={`${user.profile.pictureUrl}`} size="5" fallback="A" style={{borderRadius: '50%'}}/>
              </Flex>
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <ResizableTextarea placeholder={`What's on your mind, Eminem`} value={content} onChange={(e) => setContent(e.target.value)} className="w-[500px] max-h-[150px] text-lg text-[#363636] outline-none py-1 rounded resize-none overflow-hidden border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-gray-900  bg-transparent transition-all"/>
                </div>
                <input type="file" id="file-input" placeholder="a" className="hidden" onChange={handlePostFile} multiple/>
                <label htmlFor="file-input" className="underline hover:cursor-pointer w-fit">Add file <FontAwesomeIcon icon={faPaperclip} className="text-sm"/></label>
                <div className="flex items-start">
                  {postFile ? postFile.map((file, index) => (<Image key={index} src={URL.createObjectURL(file)} width={100} height={64} alt="aaaaaaa"/>)) : null}
                  {postFile.length > 0 ? <button className="w-fit px-2" onClick={() => setPostFile([])}>X</button> : null}
                </div>
              </div>
              <EnhancedButton variant="shine" onClick={() => sendPost()} className="rounded-full w-[100px]">Post</EnhancedButton>
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
