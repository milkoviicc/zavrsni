import React from 'react'

import { Skeleton } from "../../components/ui/skeleton";
import SuggestionSkeleton from './SuggestionSkeleton';

const PostSkeleton = () => {
  return (
    <div className='flex flex-col my-2 gap-4'>
        <hr className='w-full h-[1px] bg-[#515151] border-none'/>
        <div className='flex flex-col my-2 gap-4 w-[700px]'>
            <div className='flex flex-row justify-between'>
                <div className='flex'>
                    <Skeleton className='w-[45px] h-[45px] rounded-full bg-[#515151]'/>
                    <div className='flex'>
                        <div className='flex flex-col justify-center ml-2 gap-2'>
                            <Skeleton className='w-[125px] h-[10px] rounded-xl bg-[#515151]' />
                            <Skeleton className='w-[75px] h-[10px] rounded-xl bg-[#515151]' />
                        </div>
                        <Skeleton className='w-[65px] h-[10px] rounded-xl bg-[#515151] mt-[9px] ml-[10px]'/>
                    </div>
                </div>
                <Skeleton className='w-[25px] h-[25px] rounded-lg bg-[#515151] mt-[5px]' />
            </div>
            <div className='flex flex-col gap-2 ml-16 my-3'>
                <div className='flex gap-2'>
                    <Skeleton className='w-[300px] h-[8px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[125px] h-[8px] rounded-xl bg-[#515151]' />
                </div>
                <div className='flex gap-2'>
                    <Skeleton className='w-[350px] h-[8px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[125px] h-[8px] rounded-xl bg-[#515151]' />
                </div>
                <div className='flex gap-2'>
                    <Skeleton className='w-[200px] h-[8px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[125px] h-[8px] rounded-xl bg-[#515151]' />
                </div>
            </div>
            <div className='flex justify-between ml-[35px] my-4'>
                <Skeleton className='w-[60px] h-[15px] rounded-xl bg-[#515151]' />
                <Skeleton className='w-[60px] h-[15px] rounded-xl bg-[#515151]' />
            </div>
        </div>
        
        <hr className='w-full h-[1px] bg-[#515151] border-none'/>
        <div className='flex max-w-full w-auto'>
            <SuggestionSkeleton />
        </div>

        <hr className='w-full h-[1px] bg-[#515151] border-none'/>
        <div className='flex flex-col my-2 gap-4 w-[700px]'>
            <div className='flex flex-row justify-between'>
                <div className='flex'>
                    <Skeleton className='w-[45px] h-[45px] rounded-full bg-[#515151]'/>
                    <div className='flex'>
                        <div className='flex flex-col justify-center ml-2 gap-2'>
                            <Skeleton className='w-[125px] h-[10px] rounded-xl bg-[#515151]' />
                            <Skeleton className='w-[75px] h-[10px] rounded-xl bg-[#515151]' />
                        </div>
                        <Skeleton className='w-[65px] h-[10px] rounded-xl bg-[#515151] mt-[9px] ml-[10px]'/>
                    </div>
                </div>
                <Skeleton className='w-[25px] h-[25px] rounded-lg bg-[#515151] mt-[5px]' />
            </div>
            <div className='flex flex-col gap-2 ml-16 my-3'>
                <div className='flex gap-2'>
                    <Skeleton className='w-[300px] h-[8px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[125px] h-[8px] rounded-xl bg-[#515151]' />
                </div>
                <div className='flex gap-2'>
                    <Skeleton className='w-[350px] h-[8px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[125px] h-[8px] rounded-xl bg-[#515151]' />
                </div>
                <div className='flex gap-2'>
                    <Skeleton className='w-[200px] h-[8px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[125px] h-[8px] rounded-xl bg-[#515151]' />
                </div>
            </div>
            <div className='flex justify-between ml-[35px] my-4'>
                <Skeleton className='w-[60px] h-[15px] rounded-xl bg-[#515151]' />
                <Skeleton className='w-[60px] h-[15px] rounded-xl bg-[#515151]' />
            </div>
        </div>
        <hr className='w-full h-[1px] bg-[#515151] border-none'/>
        <div className='flex flex-col my-2 gap-4 w-[700px]'>
            <div className='flex flex-row justify-between'>
                <div className='flex'>
                    <Skeleton className='w-[45px] h-[45px] rounded-full bg-[#515151]'/>
                    <div className='flex'>
                        <div className='flex flex-col justify-center ml-2 gap-2'>
                            <Skeleton className='w-[125px] h-[10px] rounded-xl bg-[#515151]' />
                            <Skeleton className='w-[75px] h-[10px] rounded-xl bg-[#515151]' />
                        </div>
                        <Skeleton className='w-[65px] h-[10px] rounded-xl bg-[#515151] mt-[9px] ml-[10px]'/>
                    </div>
                </div>
                <Skeleton className='w-[25px] h-[25px] rounded-lg bg-[#515151] mt-[5px]' />
            </div>
            <div className='flex flex-col gap-2 ml-16 my-3'>
                <div className='flex gap-2'>
                    <Skeleton className='w-[300px] h-[8px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[125px] h-[8px] rounded-xl bg-[#515151]' />
                </div>
                <div className='flex gap-2'>
                    <Skeleton className='w-[350px] h-[8px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[125px] h-[8px] rounded-xl bg-[#515151]' />
                </div>
                <div className='flex gap-2'>
                    <Skeleton className='w-[200px] h-[8px] rounded-xl bg-[#515151]' />
                    <Skeleton className='w-[125px] h-[8px] rounded-xl bg-[#515151]' />
                </div>
            </div>
            <div className='flex justify-between ml-[35px] my-4'>
                <Skeleton className='w-[60px] h-[15px] rounded-xl bg-[#515151]' />
                <Skeleton className='w-[60px] h-[15px] rounded-xl bg-[#515151]' />
            </div>
        </div>
    </div>
  )
}

export default PostSkeleton;