import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Profile, User } from '../types/types';

const ProfileUserComponent = ({pathUser}: {pathUser: Profile}) => {

  const [myProfile, setMyProfile] = useState(false);
  const user = localStorage.getItem('user');

  useEffect(() => {
    if(user) {
      const userData: User = JSON.parse(user);
      if(userData.username === pathUser.username) {
        setMyProfile(true);
      }
    }
  }, [pathUser.username, user]);

  if(myProfile) {
    return (
      <div className="xl:flex hidden flex-col fixed 3k:left-80 2k:left-64 2xl:left-24 xl:left-0 self-start gap-0 xl:w-[200px] w-[180px] 2xl:w-[240px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] 2k:h-[800px] 3k:h-[900px] text-center rounded-lg py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] bg-[#252525] xl:translate-x-[20px] 2xl:translate-x-0 2k:translate-x-[40px] xl:translate-y-0 2xl:translate-y-[40px]">
        <h1 className='text-white'>{myProfile ? 'My profile' : 'Not my profile'}</h1>
        <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
        <h1 className='text-white'>In progress</h1>
        <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
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