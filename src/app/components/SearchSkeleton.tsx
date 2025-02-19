import { Skeleton } from '@/src/components/ui/skeleton'
import React from 'react'

const SearchSkeleton = () => {
  return (
    <div className='relative w-full flex flex-col justify-between gap-4'>
      <div className='flex flex-row justify-between items-center w-full px-[16px]'>
          <div className='flex flex-row py-2'>
              <Skeleton className='w-[45px] h-[45px] sm:w-[55px] sm:h-[55px] lg:w-[50px] lg:h-[50px] 2k:w-[65px] 2k:h-[65px] rounded-full bg-[#515151]'/>
              <div className='flex flex-col justify-center ml-2 gap-2'>
                  <Skeleton className='w-[100px] h-[10px] rounded-xl bg-[#515151]' />
                  <Skeleton className='w-[75px] h-[10px] rounded-xl bg-[#515151]' />
              </div>
          </div>
          <Skeleton className='w-[125px] h-[20px] rounded-xl bg-[#515151]' />
      </div>
      <div className='flex flex-row justify-between items-center w-full px-[16px]'>
        <div className='flex flex-row'>
            <Skeleton className='w-[45px] h-[45px] sm:w-[55px] sm:h-[55px] lg:w-[50px] lg:h-[50px] 2k:w-[65px] 2k:h-[65px]  rounded-full bg-[#515151]'/>
            <div className='flex flex-col justify-center ml-2 gap-2'>
                <Skeleton className='w-[100px] h-[10px] rounded-xl bg-[#515151]' />
                <Skeleton className='w-[75px] h-[10px] rounded-xl bg-[#515151]' />
            </div>
        </div>
        <Skeleton className='w-[125px] h-[20px] rounded-xl bg-[#515151]' />
      </div>
    </div>
  )
}

export default SearchSkeleton