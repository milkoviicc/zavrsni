'use client';
import React from 'react'

import { Skeleton } from "../../../components/ui/skeleton";

const UserSkeleton = () => {
  return (
    <div className='flex flex-col my-2 gap-4'>
        <div className='flex flex-row'>
            <Skeleton className='w-[55px] h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full bg-[#515151]'/>
            <div className='flex flex-col justify-center ml-2 gap-2'>
                <Skeleton className='w-[100px] h-[10px] rounded-xl bg-[#515151]' />
                <Skeleton className='w-[75px] h-[10px] rounded-xl bg-[#515151]' />
            </div>
        </div>
        <div className='flex flex-row'>
            <Skeleton className='w-[55px] h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full bg-[#515151]'/>
            <div className='flex flex-col justify-center ml-2 gap-2'>
                <Skeleton className='w-[80px] h-[10px] rounded-xl bg-[#515151]' />
                <Skeleton className='w-[55px] h-[10px] rounded-xl bg-[#515151]' />
            </div>
        </div>
        <div className='flex flex-row'>
            <Skeleton className='w-[55px] h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full bg-[#515151]'/>
            <div className='flex flex-col justify-center ml-2 gap-2'>
                <Skeleton className='w-[120px] h-[10px] rounded-xl bg-[#515151]' />
                <Skeleton className='w-[95px] h-[10px] rounded-xl bg-[#515151]' />
            </div>
        </div>
        <div className='flex flex-row'>
            <Skeleton className='w-[55px] h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full bg-[#515151]'/>
            <div className='flex flex-col justify-center ml-2 gap-2'>
                <Skeleton className='w-[50px] h-[10px] rounded-xl bg-[#515151]' />
                <Skeleton className='w-[75px] h-[10px] rounded-xl bg-[#515151]' />
            </div>
        </div>
        <div className='flex flex-row'>
            <Skeleton className='w-[55px] h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full bg-[#515151]'/>
            <div className='flex flex-col justify-center ml-2 gap-2'>
                <Skeleton className='w-[100px] h-[10px] rounded-xl bg-[#515151]' />
                <Skeleton className='w-[75px] h-[10px] rounded-xl bg-[#515151]' />
            </div>
        </div>
        <div className='flex flex-row'>
            <Skeleton className='w-[55px] h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full bg-[#515151]'/>
            <div className='flex flex-col justify-center ml-2 gap-2'>
                <Skeleton className='w-[110px] h-[10px] rounded-xl bg-[#515151]' />
                <Skeleton className='w-[85px] h-[10px] rounded-xl bg-[#515151]' />
            </div>
        </div>
        <div className='flex flex-row'>
            <Skeleton className='w-[55px] h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full bg-[#515151]'/>
            <div className='flex flex-col justify-center ml-2 gap-2'>
                <Skeleton className='w-[100px] h-[10px] rounded-xl bg-[#515151]' />
                <Skeleton className='w-[75px] h-[10px] rounded-xl bg-[#515151]' />
            </div>
        </div>
        <div className='flex flex-row'>
            <Skeleton className='w-[55px] h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full bg-[#515151]'/>
            <div className='flex flex-col justify-center ml-2 gap-2'>
                <Skeleton className='w-[90px] h-[10px] rounded-xl bg-[#515151]' />
                <Skeleton className='w-[45px] h-[10px] rounded-xl bg-[#515151]' />
            </div>
        </div>
        
    </div>
  )
}

export default UserSkeleton