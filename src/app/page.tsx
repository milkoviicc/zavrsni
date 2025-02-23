/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "./context/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Input } from '@/src/components/ui/input';


import axios from "axios";
import ResizableTextarea from "./components/ui/ResizableTextarea";
import { Friendship, Profile, User } from "./types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

import TextareaAutosize from 'react-textarea-autosize';
import { debounce, last, set } from "lodash";

import UserComponent from "./components/ui/UserComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery } from "@tanstack/react-query";
import UserSkeleton from "./components/skeletons/UserSkeleton";
import PostSkeleton from "./components/skeletons/PostSkeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Avatar,AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { Button } from "../components/ui/button";
import FullPosts from "./components/posts/fullPosts";



export default function Home() {

  // funckije iz AuthProvider.tsx-a
  const {user, isAuthenticated, fullyRegistered, defaultPicture, ignoreDefaultPic, setIgnoreDefaultPic, addDetails, addImage } = useAuth();

  // stateovi
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [occupation, setOccupation] = useState('');
  const [successfullUpdate, setSuccessfullUpdate] = useState(false);
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [postFile, setPostFile] = useState<File[]>([]);
  const [popularUsers, setPopularUsers] = useState<Profile[]>([]);
  const [friendsList, setFriendsList] = useState<Friendship[]>([]);
  const [ignoreDefaultPicture, setIgnoreDefaultPicture] = useState(false);
  const [shortUsername, setShortUsername] = useState('');
  const [changeImgDialogOpen, setChangeImgDialogOpen] = useState(false);

  useEffect(() => {
    if(user?.firstName && user?.lastName) {
      const firstNameLetter = user?.firstName?.slice(0,1);
      const lastNameLetter = user?.lastName?.slice(0,1);
      setShortUsername(firstNameLetter+lastNameLetter);
    }
  }, [user])


  const getPopularUsers = async () => {
    try {
      const res = await axios.get<Profile[]>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/popular?limit=10');
      if(res.status === 200) {
        const resData = res.data.filter((profile) => profile.firstName != null);
        setPopularUsers(resData);
        return resData;
      }

    } catch(err) {
      console.error(err);
    }
  }

  const getFriends = async () => {
    try {
      const res = await axios.get<Friendship[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/friends/${user?.userId}`);

      const resData = res.data.filter((profile) => profile.user.firstName != null);

      if(res.status === 200) {
        setFriendsList(resData);
        return resData;
      }
    } catch(err) {
      console.error(err);
      return [];
    }
  };

  const getPopularUsersQuery = useQuery({queryKey: ["getPopularUsersQuery"], queryFn: () => getPopularUsers()});
  const getFriendsQuery = useQuery({queryKey: ["getFriends"], queryFn: () => getFriends()});

  const getPostsRef = useRef<(() => void) | undefined>();

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

  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    if (getPopularUsersQuery.data) {
      const timeout = setTimeout(() => setIsRendering(false), 500);
      return () => clearTimeout(timeout);
    }
    if(getFriendsQuery.data) {
      const timeout = setTimeout(() => setIsRendering(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [getPopularUsersQuery.data, getFriendsQuery.data]);

  useEffect(() => {
    if(changeImgDialogOpen === false) {
      setSelectedImage(null);
    }
  }, [changeImgDialogOpen]);
  
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if(files && files.length > 0) {
      setSelectedImage(files[0]);
    }
  }
  
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const changeImage = async (image: File) => {
    await addImage(image);
  }

  if(!user || !getPopularUsersQuery.data) {
    return false;
  }

  return (
    <div className='relative flex flex-grow w-full'>
      {isAuthenticated && fullyRegistered && !defaultPicture || ignoreDefaultPicture 
      ?
      <div className="flex-col bg-[#222222] shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0,_0.26)] py-0 sm:py-6 md:py-16  mt-[35px] sm:mt-[70px] xl:mt-[60px] flex-grow">
        <div className="flex w-screen justify-between 2xl:px-16 xl:px-14 lg:px-4 gap-4">
          <div className="xl:flex hidden flex-col fixed 3k:left-80 2k:left-64 2xl:left-24 xl:left-0 gap-0 xl:w-[200px] w-[180px] 2xl:w-[240px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] 2k:h-[800px] 3k:h-[900px] text-center rounded-lg py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525] xl:translate-x-[20px] 2xl:translate-x-0 2k:translate-x-[40px] xl:translate-y-0 2xl:translate-y-[40px]">
            <h1 className="font-Roboto text-xl xl:text-2xl 2k:text-3xl pb-4 px-4 text-[#EFEFEF] font-normal">Who's popular</h1>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
            <div className='group w-full flex flex-col gap-2 bg-transparent px-4 lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px] 2k:max-h-[800px] overflow-y-hidden hover:overflow-y-scroll scrollbar'>
              {getPopularUsersQuery.isLoading || isRendering ? <UserSkeleton /> : getPopularUsersQuery.data?.map((user, index) => <UserComponent user={user} key={index} handleRoute={null}/>)}
            </div>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
          </div>
          <div className="flex-grow w-screen">
            <FullPosts user={user} popularUsers={getPopularUsersQuery.data}/>
          </div>
          {getFriendsQuery.data?.length === 0 ? null : (
            <div className="xl:flex hidden flex-col fixed 3k:right-80 2k:right-64 2xl:right-24 xl:right-0 gap-0 xl:w-[200px] w-[180px] 2xl:w-[240px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] 2k:h-[800px] 3k:h-[900px] text-center rounded-lg py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525] xl:translate-x-[-20px] 2xl:translate-x-0 2k:translate-x-[-40px] xl:translate-y-0 2xl:translate-y-[40px]">
              <h1 className="font-Roboto text-xl xl:text-2xl 2k:text-3xl pb-4 px-4 text-[#EFEFEF] font-normal">Your Friends</h1>
              <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
              <div className='group w-full h-full lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px] 2k:max-h-[800px] flex flex-col gap-2 bg-transparent px-4 overflow-y-hidden hover:overflow-y-scroll scrollbar '>
                {getFriendsQuery.isLoading || isRendering ? <UserSkeleton /> : getFriendsQuery.data?.map((user, index) => <UserComponent user={user.user} key={index} handleRoute={null}/>)}
              </div>
              <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
            </div>
          )}
        </div>
      </div>

      :  isAuthenticated && !fullyRegistered 
      ?  
      <div className="flex justify-center items-center h-full bg-[#222222] px-4 sm:px-0 flex-grow">
        <div className="border-1 border-black bg-[#363636] text-[#F0F0F0] rounded-md px-4 py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.2)]">
          <h1 className="text-center py-4">We just need a little more information about you.</h1>
          <form onSubmit={(e) => {e.preventDefault(); addDetails(firstName, lastName, description, occupation); setSuccessfullUpdate(true)}}>
            <div>
              <p>Please enter your full name.</p>
              <input type="text" maxLength={20} required className={`w-full bg-[#515151] py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='First name' id="firstname" onChange={(e) => setFirstName(e.target.value)} autoComplete="off"/>
              <input type="text" maxLength={20} required className={`w-full bg-[#515151] py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Last name' id="lastname" onChange={(e) => setLastName(e.target.value)} autoComplete="off"/>
            </div>
            <div>
              <p>Please tell us something about yourself.</p>
              <textarea maxLength={100} className={`w-full bg-[#515151] py-3 px-4 resize-none border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Description' id="description" onChange={(e) => setDescription(e.target.value)} autoComplete="off"/>
              <input type="text" maxLength={60}  className={`w-full bg-[#515151] py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Occupation, ex. Student' id="occupation" onChange={(e) => setOccupation(e.target.value)} autoComplete="off"/>
            </div>
            <div className="flex justify-center items-center py-2">
              <button className='bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,0.7)] text-[#F0F0F0] font-Roboto w-fit px-8 py-2 border border-blue-700 rounded-lg transition-all '>Confirm</button>
            </div>
          </form>
          {successfullUpdate ? <p className="text-green-500">You have successfully updated your profile information</p> : null}
        </div>
      </div>
      : isAuthenticated && fullyRegistered && defaultPicture && !ignoreDefaultPicture
      ? 
        <div className="flex flex-grow justify-center items-center h-full bg-[#222222] px-2 sm:px-0">
          <div className='bg-[#363636] border-none rounded-xl px-4 py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.2)]'>
            <h1 className="font-roboto text-[#DFDEDE] text-center py-4">Change your profile picture</h1>
            <label htmlFor="picture" onDrop={handleDrop} onDragOver={handleDragOver}>
              <div className='border-dotted border-whit[#DFDEDE] border-[2px] rounded-lg flex flex-col items-center justify-center px-8 py-8 cursor-pointer gap-2'>
                <Upload size={32} className='text-[#DFDEDE]' />
                <p className='font-Roboto text-[#DFDEDE] text-xs sm:text-sm text-center'>Drag 'n' drop image here, or click to select an image</p>
                <p className='font-Roboto text-[#888888] text-xs text-center'>You can upload only '.jpg', '.png' and '.webp' image formats.</p>
              </div>
            </label>
            <Input id="picture" type="file" className='hidden' onChange={handleImageChange}/>
            {selectedImage ? (<h1 className='font-Roboto text-[#DFDEDE] text-center'>Preview image:</h1>) : null}
            {selectedImage ? (
              <div className='flex gap-4 items-center justify-center py-4'>
                <Avatar className='relative w-[45px] h-[45px] 2xl:w-[65px] 2xl:h-[65px] 2k:w-[100px] 2k:h-[100px] rounded-full shadow-[0px_5px_5px_0px_rgba(0,_0,_0_,_0.25)]' onClick={() =>  setChangeImgDialogOpen(true)}>
                  <span><Camera size={32} className='group-hover:block hidden absolute top-[25%] left-[25%] rounded-full text-white'/></span>
                  <AvatarImage src={URL.createObjectURL(selectedImage)} className="w-fit h-fit aspect-square rounded-full object-cover" /><AvatarFallback>{shortUsername}</AvatarFallback>
                </Avatar>
                <Button className='w-fit font-Roboto bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,0.7)] transition-all' onClick={() => {selectedImage && changeImage(selectedImage); setChangeImgDialogOpen(false)}}>Submit image</Button>
              </div>
            ) : null}
            <div className="flex justify-center py-4">
              <button className="text-[#F0F0F0] text-lg font-Roboto px-8 py-1 rounded-md bg-[#515151] shadow-[1px_1px_3px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_5px_3px_rgba(0,0,0,0.4)] transition-all" onClick={() => handleSkip()}>Skip</button>
            </div>
          </div>
        </div>
      : null
      }
    </div>
  );
}
