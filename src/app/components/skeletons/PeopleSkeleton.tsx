import { Skeleton } from '@/src/components/ui/skeleton'
import React from 'react'

const PeopleSkeleton = () => {
  return (
    <div className='flex flex-col gap-4'>
        <div className='bg-[#363636] py-2 px-3 rounded-lg flex justify-between shadow-[0px_2px_1px_3px_rgba(15,15,15,0.2)]'>
            <div className='flex gap-2 items-center'>
                <Skeleton className='w-[45px] h-[45px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col gap-1'>
                    <Skeleton className='w-[100px] h-[10px] rounded-full bg-[#515151]'/>
                    <Skeleton className='w-[80px] h-[10px] rounded-full bg-[#515151]'/>
                </div>
            </div>
            <div className='flex items-center px-2'>
                <Skeleton className='w-[120px] h-[32px] rounded-full bg-[#515151]'/>
            </div>
        </div>
        <div className='bg-[#363636] py-2 px-3 rounded-lg flex justify-between shadow-[0px_2px_1px_3px_rgba(15,15,15,0.2)]'>
            <div className='flex gap-2 items-center'>
                <Skeleton className='w-[45px] h-[45px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col gap-1'>
                    <Skeleton className='w-[100px] h-[10px] rounded-full bg-[#515151]'/>
                    <Skeleton className='w-[80px] h-[10px] rounded-full bg-[#515151]'/>
                </div>
            </div>
            <div className='flex items-center px-2'>
                <Skeleton className='w-[120px] h-[32px] rounded-full bg-[#515151]'/>
            </div>
        </div>
        <div className='bg-[#363636] py-2 px-3 rounded-lg flex justify-between shadow-[0px_2px_1px_3px_rgba(15,15,15,0.2)]'>
            <div className='flex gap-2 items-center'>
                <Skeleton className='w-[45px] h-[45px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col gap-1'>
                    <Skeleton className='w-[100px] h-[10px] rounded-full bg-[#515151]'/>
                    <Skeleton className='w-[80px] h-[10px] rounded-full bg-[#515151]'/>
                </div>
            </div>
            <div className='flex items-center px-2'>
                <Skeleton className='w-[120px] h-[32px] rounded-full bg-[#515151]'/>
            </div>
        </div>
        <div className='bg-[#363636] py-2 px-3 rounded-lg flex justify-between shadow-[0px_2px_1px_3px_rgba(15,15,15,0.2)]'>
            <div className='flex gap-2 items-center'>
                <Skeleton className='w-[45px] h-[45px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col gap-1'>
                    <Skeleton className='w-[100px] h-[10px] rounded-full bg-[#515151]'/>
                    <Skeleton className='w-[80px] h-[10px] rounded-full bg-[#515151]'/>
                </div>
            </div>
            <div className='flex items-center px-2'>
                <Skeleton className='w-[120px] h-[32px] rounded-full bg-[#515151]'/>
            </div>
        </div>
        <div className='bg-[#363636] py-2 px-3 rounded-lg flex justify-between shadow-[0px_2px_1px_3px_rgba(15,15,15,0.2)]'>
            <div className='flex gap-2 items-center'>
                <Skeleton className='w-[45px] h-[45px] rounded-full bg-[#515151]'/>
                <div className='flex flex-col gap-1'>
                    <Skeleton className='w-[100px] h-[10px] rounded-full bg-[#515151]'/>
                    <Skeleton className='w-[80px] h-[10px] rounded-full bg-[#515151]'/>
                </div>
            </div>
            <div className='flex items-center px-2'>
                <Skeleton className='w-[120px] h-[32px] rounded-full bg-[#515151]'/>
            </div>
        </div>
    </div>
  )
}

export default PeopleSkeleton