'use client';
import React from 'react'
import { Skeleton } from '../ui/skeleton';

const SuggestionSkeleton = () => {
  return (
    <div className='grid grid-cols-2 grid-rows-2 my-2 gap-4 place-items-center w-full'>
        <div className='flex flex-row justify-around items-center w-full'>
            <div className='flex flex-row'>
                <Skeleton className='w-[45px] h-[45px] sm:w-[60px] sm:h-[60px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col justify-center ml-2 gap-2'>
                    <Skeleton className='w-[60px] lg:w-[100px] h-[10px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[35px] lg:w-[75px] h-[10px] rounded-xl bg-[#515151]' />
                </div>
            </div>
            <Skeleton className='w-[60px] lg:w-[100px] h-[13px] rounded-xl bg-[#515151]' />
        </div>
        <div className='flex flex-row justify-around items-center w-full'>
            <div className='flex flex-row'>
                <Skeleton className='w-[45px] h-[45px] sm:w-[60px] sm:h-[60px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col justify-center ml-2 gap-2'>
                    <Skeleton className='w-[60px] lg:w-[100px] h-[10px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[35px] lg:w-[75px] h-[10px] rounded-xl bg-[#515151]' />
                </div>
            </div>
            <Skeleton className='w-[60px] lg:w-[100px] h-[13px] rounded-xl bg-[#515151]' />
        </div>
        <div className='flex flex-row justify-around items-center w-full'>
            <div className='flex flex-row'>
                <Skeleton className='w-[45px] h-[45px] sm:w-[60px] sm:h-[60px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col justify-center ml-2 gap-2'>
                    <Skeleton className='w-[60px] lg:w-[100px] h-[10px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[35px] lg:w-[75px] h-[10px] rounded-xl bg-[#515151]' />
                </div>
            </div>
            <Skeleton className='w-[60px] lg:w-[100px] h-[13px] rounded-xl bg-[#515151]' />
        </div>
        <div className='flex flex-row justify-around items-center w-full'>
            <div className='flex flex-row'>
                <Skeleton className='w-[45px] h-[45px] sm:w-[60px] sm:h-[60px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col justify-center ml-2 gap-2'>
                    <Skeleton className='w-[60px] lg:w-[100px] h-[10px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[35px] lg:w-[75px] h-[10px] rounded-xl bg-[#515151]' />
                </div>
            </div>
            <Skeleton className='w-[60px] lg:w-[100px] h-[13px] rounded-xl bg-[#515151]' />
        </div>
    </div>
  )
}

export default SuggestionSkeleton;