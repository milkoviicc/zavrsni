import React from 'react'

import { Skeleton } from "../../components/ui/skeleton";

const SuggestionSkeleton = () => {
  return (
    <div className='grid grid-cols-2 grid-rows-2 my-2 gap-4 place-items-center'>
        <div className='flex flex-row justify-around items-center w-full'>
            <div className='flex flex-row'>
                <Skeleton className='w-[45px] h-[45px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col justify-center ml-2 gap-2'>
                    <Skeleton className='w-[100px] h-[10px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[75px] h-[10px] rounded-xl bg-[#515151]' />
                </div>
            </div>
            <Skeleton className='w-[100px] h-[13px] rounded-xl bg-[#515151]' />
        </div>
        <div className='flex flex-row justify-around items-center w-full'>
            <div className='flex flex-row'>
                <Skeleton className='w-[45px] h-[45px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col justify-center ml-2 gap-2'>
                    <Skeleton className='w-[80px] h-[10px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[55px] h-[10px] rounded-xl bg-[#515151]' />
                </div>
            </div>
            <Skeleton className='w-[100px] h-[13px] rounded-xl bg-[#515151]' />
        </div>
        <div className='flex flex-row justify-around items-center w-full'>
            <div className='flex flex-row'>
                <Skeleton className='w-[45px] h-[45px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col justify-center ml-2 gap-2'>
                    <Skeleton className='w-[120px] h-[10px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[95px] h-[10px] rounded-xl bg-[#515151]' />
                </div>
            </div>
            <Skeleton className='w-[100px] h-[13px] rounded-xl bg-[#515151]' />
        </div>
        <div className='flex flex-row justify-around items-center w-full'>
            <div className='flex flex-row'>
                <Skeleton className='w-[45px] h-[45px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col justify-center ml-2 gap-2'>
                    <Skeleton className='w-[100px] h-[10px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[75px] h-[10px] rounded-xl bg-[#515151]' />
                </div>
            </div>
            <Skeleton className='w-[100px] h-[13px] rounded-xl bg-[#515151]' />
        </div>
    </div>
  )
}

export default SuggestionSkeleton;