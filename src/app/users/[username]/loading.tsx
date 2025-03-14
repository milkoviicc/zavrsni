/* eslint-disable @typescript-eslint/no-explicit-any */
import PostSkeleton from "@/src/components/skeletons/PostSkeleton";
import ProfileSkeleton from "@/src/components/skeletons/ProfileSkeleton";
import UserSkeleton from "@/src/components/skeletons/UserSkeleton";
import { Skeleton } from "@/src/components/ui/skeleton";

export default async function Users() {
  return (
    <div className="w-full min-h-[854px] h-full bg-[#222222]">
      <div className="flex xl:flex-row flex-col items-center xl:items-start h-full py-16 md:py-30">
        <ProfileSkeleton />
        <div className="flex-grow flex flex-col items-center justify-center xl:px-[25%]">
          <Skeleton className="w-[150px] h-[20px] bg-[#515151] my-8"/>
          <PostSkeleton />
        </div>
        
        <div className="w-[25%] fixed hidden right-0 h-full xl:flex justify-center">
          <div className="bg-[#252525] flex flex-col items-center py-4 rounded-lg shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] xl:w-[200px] w-[180px] 2xl:w-[240px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[550px] 2k:h-[800px] 3k:h-[900px] overflow-x-hidden">
            <Skeleton className="w-[100px] h-[20px] bg-[#515151]" />
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
            <div className="group w-full h-full flex flex-col gap-2 bg-transparent px-4 lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px] 2k:max-h-[800px] overflow-y-hidden hover:overflow-y-scroll scrollbar">
              <UserSkeleton />
            </div>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
