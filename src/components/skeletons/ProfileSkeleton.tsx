import { Skeleton } from '@/src/components/ui/skeleton'
import React from 'react'

const ProfileSkeleton = ({myProfile}: {myProfile: boolean}) => {

    if(myProfile) {
    return (
        <div>
            <div className='xl:hidden h-[314px] mt-8 rounded-lg flex w-[350px] sm:w-[580px] md:w-[716px] lg:w-[765px] px-2 lg:px-8 py-4 z-[100] shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0,_0.26)]'>
                <div className='sm:px-3 w-full relative'>
                    <Skeleton className='w-[25px] h-[10px] bg-[#515151] absolute right-0 top-1'/>
                    <div className='flex flex-col items-center'>
                        <div className='flex items-center gap-1'>
                            <Skeleton className='w-[125px] h-[125px] rounded-full bg-[#515151]'/>
                            <div className='flex flex-col ml-2 px-2 2k:px-4 gap-2'>
                                <Skeleton className='w-[160px] h-[15px] bg-[#515151]'/>
                                <Skeleton className='w-[100px] h-[15px] bg-[#515151]'/>
                            </div>
                        </div>
                        <div className='flex flex-col px-2 gap-4 mt-5'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex justify-center gap-2'>
                                    <Skeleton className='w-[120px] sm:w-[150px] h-[8px]  bg-[#515151]'/>
                                    <Skeleton className='w-[50px] sm:w-[75px] h-[8px]  bg-[#515151]'/>
                                    <Skeleton className='w-[120px] sm:w-[125px] h-[8px]  bg-[#515151]'/>
                                </div>
                                <div className='flex justify-center gap-2'>
                                    <Skeleton className='w-[60px] sm:w-[75px] h-[8px] bg-[#515151]'/>
                                    <Skeleton className='w-[85px] sm:w-[120px] h-[8px]  bg-[#515151]'/>
                                    <Skeleton className='w-[100px] sm:w-[80px] h-[8px]  bg-[#515151]'/>
                                </div>
                                <div className='flex justify-center gap-2'>
                                    <Skeleton className='w-[115px] sm:w-[200px] h-[8px]  bg-[#515151]'/>
                                    <Skeleton className='w-[40px] sm:w-[75px] h-[8px]  bg-[#515151]'/>
                                    <Skeleton className='w-[75px] sm:w-[125px] h-[8px]  bg-[#515151]'/>
                                </div>
                            </div>
                            <div className='flex w-full justify-center'>
                                <div className='w-full flex justify-center'>
                                    <Skeleton className='w-[125px] h-[10px] bg-[#515151]'/>
                                </div>
                                <div className='flex justify-between gap-2 w-full'>
                                    <div className='flex justify-center pl-2 gap-2 w-fit'>
                                        <Skeleton className='w-[60px] h-[10px] bg-[#515151]'/>
                                        <Skeleton className='w-[15px] h-[10px] bg-[#515151]'/>
                                    </div>
                                    <div className='flex gap-2 w-full'>
                                        <Skeleton className='w-[60px] h-[10px] bg-[#515151]'/>
                                        <Skeleton className='w-[15px] h-[10px] bg-[#515151]'/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Skeleton className='w-[100%] sm:w-[480px] h-[1px] bg-[#515151] mt-4' />
                        <div>
                            <Skeleton className='w-[148px] h-[30px] bg-[#515151] mt-4' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='xl:flex hidden xl:translate-x-[20px] xl:translate-y-[-4px] 2xl:translate-y-[44px] 2xl:translate-x-[48px] absolute xl:w-[200px] 2xl:w-[245px] 2k:w-[300px] h-fit py-2 z-[100] shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0_,_0.26)]'>
                <div className='px-3 mt-4'>
                    <div className='flex flex-col'>
                        <Skeleton className='w-[25px] h-[10px] bg-[#515151] absolute right-1 top-5 2xl:top-3'/>
                        <div className='flex items-center'>
                            <Skeleton className='w-[65px] h-[65px] 2k:w-[100px] 2k:h-[100px] rounded-full bg-[#515151]'/>
                            <div className='flex flex-col px-2 2xl:px-3 2k:px-4 gap-2'>
                                <Skeleton className='w-[100px] h-[10px] bg-[#515151]'/>
                                <Skeleton className='w-[80px] h-[10px] bg-[#515151]'/>
                            </div>
                        </div>
                        <div className='flex flex-col px-2 2k:px-4 gap-6 2xl:gap-8 mt-5 2xl:mt-6'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex gap-2'>
                                    <Skeleton className='w-[50px] h-[8px] 2xl:h-[10px] bg-[#515151]'/>
                                    <Skeleton className='w-[75px] h-[8px] 2xl:h-[10px] bg-[#515151]'/>
                                </div>
                                <div className='flex gap-2'>
                                    <Skeleton className='w-[60px] h-[8px] 2xl:h-[10px] bg-[#515151]'/>
                                    <Skeleton className='w-[100px] 2xl:w-[125px] h-[8px] 2xl:h-[10px bg-[#515151]'/>
                                </div>
                                <div className='flex gap-2'>
                                    <Skeleton className='w-[40px] h-[8px] 2xl:h-[10px] bg-[#515151]'/>
                                    <Skeleton className='w-[100px] h-[8px] 2xl:h-[10px] bg-[#515151]'/>
                                </div>
                            </div>
                            <div className='flex w-full justify-center'>
                                <Skeleton className='w-[115px] h-[10px] bg-[#515151]'/>
                            </div>
                        </div>
                        <div className='flex justify-evenly gap-4 mt-7 w-full'>
                            <div className='flex gap-2'>
                                <Skeleton className='w-[60px] h-[10px] bg-[#515151]'/>
                                <Skeleton className='w-[15px] h-[10px] bg-[#515151]'/>
                            </div>
                            <div className='flex gap-2'>
                                <Skeleton className='w-[60px] h-[10px] bg-[#515151]'/>
                                <Skeleton className='w-[15px] h-[10px] bg-[#515151]'/>
                            </div>
                        </div>                    
                        <Skeleton className='w-[100%] h-[1px] bg-[#515151] mt-4' />
                        <div className='flex justify-center'>
                            <Skeleton className='w-[148px] h-[30px] bg-[#515151] mt-4' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )} else {
        return (
            <div>
                <div className='xl:hidden h-[314px] mt-8 rounded-lg flex w-[350px] sm:w-[580px] md:w-[716px] lg:w-[765px] px-2 lg:px-8 py-4 z-[100] shadow-[0px_0.1px_15px_0px_rgba(0,_0,_0,_0.26)]'>
                    <div className='sm:px-3 w-full relative'>
                        <Skeleton className='w-[25px] h-[10px] bg-[#515151] absolute right-0 top-1'/>
                        <div className='flex flex-col items-center'>
                            <div className='flex items-center gap-1'>
                                <Skeleton className='w-[125px] h-[125px] rounded-full bg-[#515151]'/>
                                <div className='flex flex-col ml-2 px-2 2k:px-4 gap-2'>
                                    <Skeleton className='w-[160px] h-[15px] bg-[#515151]'/>
                                    <Skeleton className='w-[100px] h-[15px] bg-[#515151]'/>
                                </div>
                            </div>
                            <div className='flex flex-col px-2 gap-4 mt-5'>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex justify-center gap-2'>
                                        <Skeleton className='w-[120px] sm:w-[150px] h-[8px]  bg-[#515151]'/>
                                        <Skeleton className='w-[50px] sm:w-[75px] h-[8px]  bg-[#515151]'/>
                                        <Skeleton className='w-[120px] sm:w-[125px] h-[8px]  bg-[#515151]'/>
                                    </div>
                                    <div className='flex justify-center gap-2'>
                                        <Skeleton className='w-[60px] sm:w-[75px] h-[8px] bg-[#515151]'/>
                                        <Skeleton className='w-[85px] sm:w-[120px] h-[8px]  bg-[#515151]'/>
                                        <Skeleton className='w-[100px] sm:w-[80px] h-[8px]  bg-[#515151]'/>
                                    </div>
                                    <div className='flex justify-center gap-2'>
                                        <Skeleton className='w-[115px] sm:w-[200px] h-[8px]  bg-[#515151]'/>
                                        <Skeleton className='w-[40px] sm:w-[75px] h-[8px]  bg-[#515151]'/>
                                        <Skeleton className='w-[75px] sm:w-[125px] h-[8px]  bg-[#515151]'/>
                                    </div>
                                </div>
                                <div className='flex w-full justify-center'>
                                    <div className='w-full flex justify-center'>
                                        <Skeleton className='w-[125px] h-[10px] bg-[#515151]'/>
                                    </div>
                                    <div className='flex justify-between gap-2 w-full'>
                                        <div className='flex justify-center pl-2 gap-2 w-fit'>
                                            <Skeleton className='w-[60px] h-[10px] bg-[#515151]'/>
                                            <Skeleton className='w-[15px] h-[10px] bg-[#515151]'/>
                                        </div>
                                        <div className='flex gap-2 w-full'>
                                            <Skeleton className='w-[60px] h-[10px] bg-[#515151]'/>
                                            <Skeleton className='w-[15px] h-[10px] bg-[#515151]'/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Skeleton className='w-[100%] sm:w-[480px] h-[1px] bg-[#515151] mt-4' />
                            <div className='flex w-full justify-evenly gap-2 py-4'>
                                <div className='flex w-full items-center gap-2'>
                                    <div className='flex w-full flex-col gap-2 items-center'>
                                        <Skeleton className='w-[148px] h-[10px] bg-[#515151]' />
                                        <Skeleton className='w-[100px] h-[20px] bg-[#515151] rounded-full' />
                                    </div>
                                    <div className='flex w-full flex-col gap-2 items-center'>
                                        <Skeleton className='w-[148px] h-[10px] bg-[#515151]' />
                                        <Skeleton className='w-[100px] h-[20px] bg-[#515151] rounded-full' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xl:flex hidden flex-col fixed 3k:left-80 2k:left-64 2xl:left-24 xl:left-0 self-start gap-0 xl:w-[225px] w-[180px] 2xl:w-[245px] 2k:w-[300px] lg:h-[400px] xl:h-[520px] 2xl:h-[600px] 2k:h-[800px] text-center rounded-lg py-4 xl:translate-x-[20px] 2xl:translate-x-0 2k:translate-x-[40px] xl:translate-y-0 2xl:translate-y-[40px]">
                    <div className='flex flex-col gap-2 px-3'>
                        <div className='py-1 flex'>
                            <Skeleton className='w-[65px] h-[65px] 2k:w-[100px] 2k:h-[100px] rounded-full bg-[#515151]'/>
                            <div className='flex flex-col px-2 2k:px-4 gap-2 justify-center'>
                                <Skeleton className='w-[100px] h-[10px] bg-[#515151]'/>
                                <Skeleton className='w-[80px] h-[10px] bg-[#515151]'/>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 px-[5px] py-2'>
                            <div className='flex gap-2'>
                                <Skeleton className='w-[50px] h-[8px] 2xl:h-[10px] bg-[#515151]'/>
                                <Skeleton className='w-[75px] h-[8px] 2xl:h-[10px] bg-[#515151]'/>
                            </div>
                            <div className='flex gap-2'>
                                <Skeleton className='w-[60px] h-[8px] 2xl:h-[10px] bg-[#515151]'/>
                                <Skeleton className='w-[100px] 2xl:w-[125px] h-[8px] 2xl:h-[10px bg-[#515151]'/>
                            </div>
                            <div className='flex gap-2'>
                                <Skeleton className='w-[40px] h-[8px] 2xl:h-[10px] bg-[#515151]'/>
                                <Skeleton className='w-[100px] h-[8px] 2xl:h-[10px] bg-[#515151]'/>
                            </div>
                        </div>
                        <div className='flex flex-col items-center justify-center py-8 gap-2'>
                            <Skeleton className='w-[100px] h-[8px] 2xl:h-[10px] bg-[#515151]'/>
                        </div>
                        <div className='flex justify-evenly gap-4 w-full'>
                            <div className='flex gap-2'>
                                <Skeleton className='w-[60px] h-[10px] bg-[#515151]'/>
                                <Skeleton className='w-[15px] h-[10px] bg-[#515151]'/>
                            </div>
                            <div className='flex gap-2'>
                                <Skeleton className='w-[60px] h-[10px] bg-[#515151]'/>
                                <Skeleton className='w-[15px] h-[10px] bg-[#515151]'/>
                            </div>
                        </div>   
                        <span className="bg-[#515151] h-[1px] w-full"></span>
                        <div className='flex justify-center py-3'>
                            <Skeleton className='w-[60px] h-[10px] bg-[#515151]'/>
                        </div>
                        <div className='flex justify-center gap-2'>
                            <Skeleton className='w-[100px] h-[15px] bg-[#515151]'/>
                            <Skeleton className='w-[100px] h-[15px] bg-[#515151]'/>
                        </div>
                    </div>
                    <div className='flex flex-col mt-12 gap-4'>
                        <div className='flex justify-center'>
                            <Skeleton className='w-[75px] h-[10px] bg-[#515151]'/>
                        </div>
                        <span className="bg-[#515151] h-[1px] w-full"></span>
                        <div className='flex flex-row px-4'>
                            <Skeleton className='w-[55px] h-[55px] 2k:w-[65px] 2k:h-[65px] rounded-full bg-[#515151]'/>
                            <div className='flex flex-col justify-center ml-2 gap-2'>
                                <Skeleton className='w-[100px] h-[10px] rounded-xl bg-[#515151]' />
                                <Skeleton className='w-[75px] h-[10px] rounded-xl bg-[#515151]' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfileSkeleton