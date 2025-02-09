import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Profile, User } from '../types/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Pencil } from 'lucide-react';

const ProfileUserComponent = ({pathUser}: {pathUser: Profile}) => {

  const [myProfile, setMyProfile] = useState(false);
  const user = localStorage.getItem('user');
  const [shortUsername, setShortUsername] = useState('');
  useEffect(() => {
    if(user) {
      const userData: User = JSON.parse(user);
      if(userData.username === pathUser.username) {
        setMyProfile(true);
      }
    }
  }, [pathUser.username, user]);

  useEffect(() => {
      if(pathUser && pathUser.firstName && pathUser.lastName) {
          const firstLetter = pathUser.firstName.slice(0, 1);
          const secondLetter = pathUser.lastName.slice(0, 1);
          setShortUsername(firstLetter + secondLetter);
      }
  }, [pathUser]);

  const [editableName, setEditableName] = useState(false);
  const [editableUsername, setEditableUsername] = useState(false);
  const [editableDescription, setEditableDescription] = useState(false);
  const [editableOccupation, setEditableOccupation] = useState(false);
  

  if(myProfile) {
    return (
      <div className="xl:flex hidden flex-col fixed 3k:left-80 2k:left-64 2xl:left-24 xl:left-0 self-start gap-0 xl:w-[200px] w-[180px] 2xl:w-[275px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] 2k:h-[800px] 3k:h-[900px] text-center rounded-lg py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525] xl:translate-x-[20px] 2xl:translate-x-0 2k:translate-x-[40px] xl:translate-y-0 2xl:translate-y-[40px]">
        <div className='w-full flex flex-col justify-center items-center'>
          <div className='flex flex-col py-1 gap-2'>
            <div className='flex px-4'>
              <Avatar className='w-[65px] h-[65px] 2k:w-[100px] 2k:h-[100px] rounded-full'>
                <AvatarImage src={`${pathUser?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}} /><AvatarFallback>{shortUsername}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col items-start px-2'>
                <h1 className='text-[#DFDEDE] font-Roboto text-lg'>{pathUser.firstName} {pathUser.lastName}</h1>
                <p className='text-[#888888] font-Roboto'>@{pathUser.username}</p>
              </div>
            </div>
            <div className='flex flex-col px-4 py-2 gap-4'>
              <p className='text-justify text-[#EDEDED] font-Roboto text-sm'>{pathUser.description}</p>
              <p className='text-[#DFDEDE] font-Roboto text-sm'>{pathUser.occupation}</p>
            </div>
            <div className='flex justify-evenly gap-4'>
              <div>
                <p className='text-[#888888] font-Roboto text-sm'>Followers: {pathUser.followers}</p>
              </div>
              <div>
                <p className='text-[#888888] font-Roboto text-sm'>Following: {pathUser.following}</p>
              </div>
            </div>
            <span className="bg-[#515151] h-[1px] w-full"></span>
            <div className='flex flex-col w-full px-4'>
              <h1 className='text-center font-Roboto text-[#A0A0A0] text-lg font-semibold'>EDIT PROFILE</h1>
              <div className='flex flex-col gap-1'>
                <div className='flex flex-col items-start'>
                  <label htmlFor="profileName" className='text-[#7B7B7B] font-extralight text-sm'>Name</label>
                  <div className='flex items-center relative w-full'>
                    {editableName ? (<input type="text" id="profileName" placeholder={`${pathUser.firstName} ${pathUser.lastName}`} className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="profileName" placeholder={`${pathUser.firstName} ${pathUser.lastName}`} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>}
                    <label htmlFor="profileName" className='absolute right-1'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableName((prev) => !prev)}/></label>
                  </div>
                </div>
                <div className='flex flex-col items-start'>
                  <label htmlFor="username" className='text-[#7B7B7B] font-extralight text-sm'>Username</label>
                  <div className='flex items-center relative w-full'>
                    {editableUsername ? (<input type="text" id="username" placeholder={`${pathUser.username}`} className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>) : <input type="text" id="username" placeholder={`${pathUser.username}`} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>}
                    <label htmlFor="username" className='absolute right-1'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableUsername((prev) => !prev)}/></label>
                  </div>
                </div>
                <div className='flex flex-col items-start'>
                  <label htmlFor="description" className='text-[#7B7B7B] font-extralight text-sm'>Description</label>
                  <div className='flex items-center relative w-full'>
                    {editableDescription ? <textarea id="description" placeholder={`${pathUser.description}`} rows={4} maxLength={100} className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none'/>: <textarea id="description" placeholder={`${pathUser.description}`} rows={4} maxLength={100} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-sm bg-[#363636] pl-2 pr-7 py-1 rounded-md outline-none resize-none'/>}
                    <label htmlFor="description" className='absolute right-1'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableDescription((prev) => !prev)}/></label>
                  </div>
                </div>
                <div className='flex flex-col items-start'>
                  <label htmlFor="occupation" className='text-[#7B7B7B] font-extralight text-sm'>Occupation</label>
                  <div className='flex items-center relative w-full'>
                    {editableOccupation ? <input type="text" id="occupation" placeholder={`${pathUser.occupation}`} className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/> : <input type="text" id="occupation" placeholder={`${pathUser.occupation}`} readOnly className='placeholder-[#7B7B7B] text-[#7B7B7B] w-full text-sm bg-[#363636] px-2 py-1 rounded-md outline-none'/>}
                    <label htmlFor="occupation" className='absolute right-1'><Pencil className='text-[#7D7D7D]' size="20" onClick={() => setEditableOccupation((prev) => !prev)}/></label>
                  </div>
                </div>
                <div className='flex justify-center py-2'>
                  <button className='text-[#7D7D7D] font-light rounded-full bg-[#2C2C2C] w-fit px-4 py-1 shadow-[0_2px_3px_0_rgba(0,0,0,0.3)]'>Save changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col fixed 3k:left-80 2k:left-64 2xl:left-24 xl:left-0 self-start gap-0 xl:w-[200px] w-[180px] 2xl:w-[240px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] 2k:h-[800px] 3k:h-[900px] text-center rounded-lg py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525] xl:translate-x-[20px] 2xl:translate-x-0 2k:translate-x-[40px] xl:translate-y-0 2xl:translate-y-[40px]">
          <h1 className='text-white'>{myProfile ? 'My profile' : 'Not my profile'}</h1>
      </div>
    )
  }
}

export default ProfileUserComponent