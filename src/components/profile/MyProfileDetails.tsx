/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/no-unescaped-entities */
'use client';
import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Camera, Ellipsis, MousePointerClick, Pencil, Trash2, Trash2Icon, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import ResizableTextarea from '../other/ResizableTextarea';
import { Profile, User } from '@/src/types/types';
import { useAuth } from '@/src/context/AuthProvider';
import { profileApi } from '@/src/lib/utils';

import {toast} from 'sonner';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const MyProfileDetails = ({user, changeImage, revalidate}: {user: Profile, changeImage: (selectedImage: File) => void, revalidate: () => void}) => {
  const [shortUsername, setShortUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.username);
  const [description, setDescription] = useState<string | null>(user.description);
  const [occupation, setOccupation] = useState<string | null>(user.occupation);
  const [allowSaving, setAllowSaving] = useState(false);
  const [editableName, setEditableName] = useState(false);
  const [editableUsername, setEditableUsername] = useState(false);
  const [editableDescription, setEditableDescription] = useState(false);
  const [editableOccupation, setEditableOccupation] = useState(false);
  const [deleteAccDialogOpen, setDeleteAccDialogOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changeImgDialogOpen, setChangeImgDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverTabletOpen, setPopoverTabletOpen] = useState(false);
  const [popoverLaptopOpen, setPopoverLaptopOpen] = useState(false);
  const [popoverPcOpen, setPopoverPcOpen] = useState(false);

  const {deleteAccount} = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    const handleScroll = () => {
      setPopoverOpen(false);
      setPopoverTabletOpen(false);
      setPopoverLaptopOpen(false);
      setPopoverPcOpen(false);
    };

    if (popoverOpen || popoverTabletOpen || popoverLaptopOpen || popoverPcOpen) {
      requestAnimationFrame(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
      });
      return () => window.removeEventListener("scroll", handleScroll);
    }

  }, [popoverOpen, popoverTabletOpen, popoverLaptopOpen, popoverPcOpen]);

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

  useEffect(() => {
    if(user && user.firstName && user.lastName) {
        const firstLetter = user.firstName.slice(0, 1);
        const secondLetter = user.lastName.slice(0, 1);
        setShortUsername(firstLetter + secondLetter);
        setFullName(`${user.firstName} ${user.lastName}`);
        setLastName(user.lastName);
        setUsername(user.username);
        if(user.description) {
          setDescription(user.description);
        } else {
          setDescription(null);
        }

        if(user.occupation) {
          setOccupation(user.occupation);
        } else {
          setOccupation(null);
        }
        
    }
  }, [user]);

  const handleEditProfile = () => {
    editProfile(username, fullName, description, occupation);
    setAllowSaving(false);
    setEditableName(false);
    setEditableUsername(false);
    setEditableDescription(false);
    setEditableOccupation(false);
  }

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

  function splitFullName(fullName: string): {firstName: string; lastName: string} {
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const [firstNamePart, ...lastNamePart] = fullName.split(' ');
    const lastName = lastNamePart.join(' ');

    return {firstName, lastName};
  }

  const editProfile = async (username: string, fullName: string, description: string | null, occupation: string | null) => {
    try {
      const { firstName, lastName } = splitFullName(fullName);

      const res = await profileApi.updateProfile(username, firstName, lastName, description, occupation)

      if(res.status === 200) {
        const updatedUser: User = res.data;
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        Cookies.set('user', JSON.stringify(updatedUser));
        toast("Profile details successfully updated!", { duration: 1500, style: {backgroundColor: "#1565CE", border: "none", color: "#fff"}});
        if(user?.username === updatedUser.username) {
          revalidate();
          return;
        } else {
          router.push(`/users/${updatedUser.username}`);
        }
      }
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div>
        <div className='xl:hidden pt-8 md:pb-4 flex justify-center px-4 w-screen'>
          <div className='w-fit sm:gap-10'>
            <div className='w-[350px] sm:w-[580px] md:w-[716px] lg:w-[765px] relative rounded-lg flex flex-col xl:hidden justify-center items-center gap-5 px-2 lg:px-8 py-4 shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0,_0.26)]'>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger className='absolute top-2 right-2 z-50 cursor-pointer' onClick={() => setPopoverOpen(!popoverOpen)} asChild><Ellipsis className='text-[#DFDEDE]' size={24}/></PopoverTrigger>
                <PopoverContent className='w-fit mr-4'>
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        <CommandItem><button onClick={() => setDeleteAccDialogOpen((prev) => !prev)} className='text-[#DFDEDE] flex gap-2 items-center text-base cursor-pointer'><Trash2Icon size={20}/>Delete Your Account</button></CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className='flex items-center justify-center gap-1'>
                <button onClick={() => setChangeImgDialogOpen((prev) => !prev)}>
                  <Avatar className='w-[125px] h-[125px] rounded-full overflow-visible shadow-[0px_5px_5px_0px_rgba(0,_0,_0_,_0.25)] group'>
                    <span><Camera size={40} className='md:group-hover:block hidden absolute top-[34%] left-[34%] rounded-full text-white transition-all'/></span>
                    <AvatarImage src={`${user?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover cursor-pointer md:hover:opacity-10 transition-all" /><AvatarFallback>{shortUsername}</AvatarFallback>
                    <span><Camera size={24} className='md:hidden block absolute bottom-[5px] right-[5px] rounded-full text-white transition-all'/></span>
                  </Avatar>
                </button>
                <div className='flex flex-col justify-center px-2 pl-4'>
                  <h1 className='text-[#DFDEDE] font-Roboto text-2xl min-w-full'>{user.firstName} {user.lastName}</h1>
                  <p className='text-[#888888] font-Roboto text-xl'>@{user.username}</p>
                </div>
              </div>
              <div className='flex flex-col'>
                <div className='flex flex-col items-center px-4 py-2 gap-4'>
                  <p className='text-center break-words hyphens-auto text-[#888888] font-Roboto text-sm'>{user.description ? `${user.description}` : 'No description yet! You can add one down below.'}</p>
                  <div className='flex w-full justify-evenly items-center gap-4'>
                    <p className='text-[#888888] font-Roboto text-sm'>{user.occupation ? `${user.occupation}` : 'No occupation yet!'}</p>
                    <div className='flex gap-4'>
                      <div className='flex items-center gap-2'>
                        <p className='text-[#888888] font-Roboto text-xs'>Followers</p>
                        <span className='text-[#888888] text-lg'>{user.followers}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <p className='text-[#888888] font-Roboto text-xs'>Following</p>
                        <span className='text-[#888888] text-lg'>{user.following}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="bg-[#515151] h-[1px] w-full"></span>
              </div>
              <div className='flex flex-col justify-center'>
                <div className='flex flex-col gap-4'>
                  <div className='flex gap-2 justify-center items-center'>
                    <button className='flex gap-2 bg-[#363636] px-4 py-2 rounded-md text-center font-Roboto text-[#A0A0A0] text-sm 2xl:text-lg font-semibold shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-pointer' onClick={() => setEditProfileOpen((prev) => !prev)}>EDIT PROFILE <MousePointerClick size={20}/></button>
                  </div>
                  <div className={`${editProfileOpen ? 'flex' : 'hidden'} gap-2 w-full`}>
                    <div className='flex flex-col items-start h-fit w-full'>
                      <label htmlFor="profileName" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Name</label>
                      <div className='flex items-center relative w-full'>
                        {editableName ? (<input type="text" id="profileName" value={fullName} onChange={(e) => {`${user.firstName} ${user.lastName}` === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setFullName(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="profileName" value={fullName} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none cursor-not-allowed'/>}
                        <label htmlFor="profileName" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableName((prev) => !prev)}/></label>
                      </div>
                    </div>
                    <div className='flex flex-col items-start h-fit w-full'>
                      <label htmlFor="username" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Username</label>
                      <div className='flex items-center relative w-full'>
                        {editableUsername ? (<input type="text" id="username" value={username} onChange={(e) => {user.username === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setUsername(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="username" value={username} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none cursor-not-allowed'/>}
                        <label htmlFor="username" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableUsername((prev) => !prev)}/></label>
                      </div>
                    </div>
                  </div>
                  <div className={`${editProfileOpen ? 'flex' : 'hidden'} gap-2 w-full`}>
                    <div className='flex flex-col items-start h-fit w-full'>
                      <label htmlFor="description" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Description</label>
                      <div className='flex items-center relative w-full'>
                        {editableDescription ? <textarea id="description" value={description !== null ? description : ''} onChange={(e) => {user.description === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setDescription(e.target.value)}} rows={4} maxLength={200} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none'/>: <textarea id="description" value={description ? `${description}` : 'Set a description'} rows={4} maxLength={200} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none cursor-not-allowed'/>}
                        <label htmlFor="description" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableDescription((prev) => !prev)}/></label>
                      </div>
                    </div>
                    <div className='flex flex-col items-start h-fit w-full'>
                      <label htmlFor="occupation" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Occupation</label>
                      <div className='flex items-center relative w-full'>
                        {editableOccupation ? <input type="text" id="occupation" value={occupation !== null ? occupation : ''} onChange={(e) => {user.occupation === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setOccupation(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none'/> : <input type="text" id="occupation" value={occupation ? `${occupation}` : 'Set an occupation'} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none cursor-not-allowed'/>}
                        <label htmlFor="occupation" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableOccupation((prev) => !prev)}/></label>
                      </div>
                      <div className='flex w-full justify-center py-4'>
                        {allowSaving ? <button className='text-[#EDEDED] font-light rounded-full bg-[#1565CE] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-pointer' onClick={() =>  handleEditProfile()}>Save changes</button> :<button className='text-[#7D7D7D] font-light rounded-full bg-[#2C2C2C] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-not-allowed'>Save changes</button>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:flex hidden flex-col fixed 3k:left-80 2k:left-64 2xl:left-24 xl:left-0 self-start gap-0 xl:w-[200px] 2xl:w-[240px] 2k:w-[275px] h-fit text-center rounded-lg py-2 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525] xl:translate-x-[20px] 2xl:translate-x-0 2k:translate-x-[40px] xl:translate-y-0 2xl:translate-y-[40px]">
          <Popover open={popoverPcOpen} onOpenChange={setPopoverPcOpen}>
            <PopoverTrigger className='absolute top-2 right-2 cursor-pointer z-[9999]' onClick={() => setPopoverPcOpen(!popoverPcOpen)} asChild><Ellipsis className='text-[#DFDEDE]' size={24}/></PopoverTrigger>
            <PopoverContent className='w-fit'>
              <Command>
                <CommandList>
                  <CommandGroup>
                    <CommandItem><button onClick={() => setDeleteAccDialogOpen((prev) => !prev)} className='text-[#DFDEDE] flex gap-2 items-center text-base cursor-pointer'><Trash2Icon size={20}/>Delete Your Account</button></CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className='w-full relative flex flex-col justify-evenly items-center mt-2 2xl:mt-4'>
            <div className='flex flex-col py-1 gap-2 w-full'>
              <div className='flex px-3'>
                <Dialog open={changeImgDialogOpen} onOpenChange={setChangeImgDialogOpen}>
                  <DialogTrigger>
                    <Avatar className='relative w-[65px] h-[65px] 2k:w-[100px] 2k:h-[100px] rounded-full shadow-[0px_5px_5px_0px_rgba(0,_0,_0_,_0.25)] group' onClick={() =>  setChangeImgDialogOpen(true)}>
                      <span><Camera size={32} className='group-hover:block hidden absolute top-[25%] left-[25%] 2k:top-[30%] 2k:left-[31%] 2k:size-10 rounded-full text-white transition-all'/></span>
                      <AvatarImage src={`${user?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover cursor-pointer hover:opacity-10 transition-all"  /><AvatarFallback>{shortUsername}</AvatarFallback>
                    </Avatar>
                  </DialogTrigger>
                  <DialogContent className='bg-[#252525] border-none rounded-xl max-w-xs sm:max-w-md lg:max-w-lg [&>button]:text-white px-4 py-4'>
                    <DialogHeader>
                      <DialogTitle className='font-Roboto font-normal text-[#DFDEDE]'>Change your profile picture.</DialogTitle>
                    </DialogHeader>
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
                        <div className='flex gap-4 items-center justify-center'>
                          <Avatar className='relative w-[45px] h-[45px] 2xl:w-[65px] 2xl:h-[65px] 2k:w-[100px] 2k:h-[100px] rounded-full shadow-[0px_5px_5px_0px_rgba(0,_0,_0_,_0.25)]' onClick={() =>  setChangeImgDialogOpen(true)}>
                            <span><Camera size={32} className='group-hover:block hidden absolute top-[25%] left-[25%] rounded-full text-white'/></span>
                            <AvatarImage src={URL.createObjectURL(selectedImage)} className="w-fit h-fit aspect-square rounded-full object-cover" /><AvatarFallback>{shortUsername}</AvatarFallback>
                          </Avatar>
                          <Button className='w-fit font-Roboto bg-[#515151] shadow-[0px_5px_5px_0px_rgba(0,_0,_0_,_0.25)] cursor-pointer' onClick={() => {selectedImage && changeImage(selectedImage); setChangeImgDialogOpen(false)}}>Submit image</Button>
                        </div>
                      ) : null}
                    </DialogContent>
                </Dialog>
                <div className='flex flex-col justify-center items-start px-2 2xl:px-3 2k:px-4'>
                  <h1 className='text-[#DFDEDE] font-Roboto text-sm 2xl:text-base 2k:text-lg'>{user.firstName} {user.lastName}</h1>
                  <p className='text-[#888888] font-Roboto text-sm 2xl:text-base 2k:text-lg'>@{user.username}</p>
                </div>
              </div>
              <div className='flex flex-col px-3 py-2 gap-4'>
                <p className='text-left break-words hyphens-auto text-[#888888] px-[5px] font-Roboto text-xs 2xl:text-sm 2k:text-base'>{user.description ? `${user.description}` : 'No description yet! You can add one down below.'}</p>
                <p className='text-[#888888] text-center font-Roboto text-xs 2xl:text-sm 2k:text-base'>{user.occupation ? `${user.occupation}` : 'No occupation yet!'}</p>
              </div>
              <div className='flex justify-evenly gap-4'>
                <div className='flex items-center gap-2'>
                  <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm 2k:text-base'>Followers</p>
                  <span className='text-[#888888] text-lg'>{user.followers}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <p className='text-[#888888] font-Roboto text-xs 2xl:text-sm 2k:text-base'>Following</p>
                  <span className='text-[#888888] text-lg'>{user.following}</span>
                </div>
              </div>
              <span className="bg-[#515151] h-[1px] w-full"></span>
              <div className='flex flex-col w-full px-4'>
                <div className='flex gap-2 justify-center items-center'>
                  <button className='flex gap-2 bg-[#363636] px-4 py-2 rounded-md text-center font-Roboto text-[#A0A0A0] text-sm font-semibold shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-pointer' onClick={() => setEditProfileOpen((prev) => !prev)}>EDIT PROFILE <MousePointerClick size={20}/></button>
                  <Dialog open={deleteAccDialogOpen} onOpenChange={setDeleteAccDialogOpen}>
                    <DialogContent className='bg-[#252525] border-none rounded-xl max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-2xl [&>button]:text-white px-4 lg:px-8 py-4'>
                      <DialogHeader>
                        <DialogTitle className='text-[#fff] text-left text-xs sm:text-base md:text-lg font-semibold font-Roboto sm:text-center'>Are you sure you want to delete your account?</DialogTitle>
                      </DialogHeader>
                      <p className='font-Roboto text-[#A6A6A6] text-center text-xs sm:text-base md:text-lg'>This action is permanent and you will not be able to access your account anymore.</p>
                      <div className='flex justify-center gap-4'>
                        <Button onClick={() => setDeleteAccDialogOpen(false)} className='px-2 sm:px-8 rounded-full bg-[#1565CE] transition-all shadow-[0px_3px_5px_0px_rgba(21,101,206,0.25)] hover:shadow-[0px_3px_5px_0px_rgba(21,101,206,0.50)] hover:opacity-90 hover:bg-[#1565CE] font-normal font-Roboto text-white cursor-pointer'>No, I changed my mind</Button>
                        <Button variant="destructive" onClick={() => deleteAccount()} className='px-2 sm:px-8 rounded-full transition-all shadow-[0px_3px_5px_0px_rgba(202,60,60,0.25)] hover:shadow-[0px_3px_5px_0px_rgba(202,60,60,0.50)] font-normal font-Roboto text-white cursor-pointer'><Trash2 size={10}/> Yes, I'm sure</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {editProfileOpen ? (
                  <div className='flex flex-col gap-1 mt-2'>
                    <div className='flex flex-col items-start'>
                      <label htmlFor="profileName" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Name</label>
                      <div className='flex items-center relative w-full'>
                        {editableName ? (<input type="text" id="profileName" value={fullName} onChange={(e) => {`${user.firstName} ${user.lastName}` === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setFullName(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="profileName" value={fullName} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none cursor-not-allowed'/>}
                        <label htmlFor="profileName" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableName((prev) => !prev)}/></label>
                      </div>
                    </div>
                    <div className='flex flex-col items-start'>
                      <label htmlFor="username" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Username</label>
                      <div className='flex items-center relative w-full'>
                        {editableUsername ? (<input type="text" id="username" value={username} onChange={(e) => {user.username === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setUsername(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="username" value={username} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] px-2 py-1 rounded-md outline-none cursor-not-allowed'/>}
                        <label htmlFor="username" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableUsername((prev) => !prev)}/></label>
                      </div>
                    </div>
                    <div className='flex flex-col items-start'>
                      <label htmlFor="description" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Description</label>
                      <div className='flex items-center relative w-full'>
                        {editableDescription ? <ResizableTextarea id="description" value={description !== null ? description : ''} onChange={(e) => {user.description === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setDescription(e.target.value)}} rows={4} maxLength={200} className='placeholder-[#7B7B7B] text-[#EDEDED] scrollbar-none h-full max-h-[90px] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none'></ResizableTextarea>: <textarea id="description" value={description ? `${description}` : 'Set a description'} rows={4} maxLength={200} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none cursor-not-allowed'></textarea>}
                        <label htmlFor="description" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableDescription((prev) => !prev)}/></label>
                      </div>
                    </div>
                    <div className='flex flex-col items-start'>
                      <label htmlFor="occupation" className='text-[#7B7B7B] font-extralight text-xs 2xl:text-sm'>Occupation</label>
                      <div className='flex items-center relative w-full'>
                        {editableOccupation ? <input type="text" id="occupation" value={occupation !== null ? occupation : ''} onChange={(e) => {user.occupation === e.target.value ? setAllowSaving(false) : setAllowSaving(true);setOccupation(e.target.value)}} className='placeholder-[#7B7B7B] text-[#EDEDED] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none'/> : <input type="text" id="occupation" value={occupation ? `${occupation}` : 'Set an occupation'} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-xs 2xl:text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none cursor-not-allowed'/>}
                        <label htmlFor="occupation" className='absolute right-1 cursor-pointer'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableOccupation((prev) => !prev)}/></label>
                      </div>
                    </div>
                    <div className='flex justify-center py-2'>
                      {allowSaving ? <button className='text-[#EDEDED] font-light rounded-full bg-[#1565CE] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-pointer' onClick={() =>  handleEditProfile()}>Save changes</button> :<button className='text-[#7D7D7D] font-light rounded-full bg-[#2C2C2C] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)] cursor-not-allowed'>Save changes</button>}
                    </div>
                  </div>
                ):null}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default MyProfileDetails