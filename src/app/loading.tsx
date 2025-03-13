/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import UserSkeleton from "../components/skeletons/UserSkeleton";
import PostSkeleton from "../components/skeletons/PostSkeleton";
import NewPostSkeleton from "../components/skeletons/NewPostSkeleton";


export default async function Home() {

  return (
    <div className="w-full h-full bg-[#222222]">
      <div className="flex h-full py-16 lg:py-30">
        {/* Left Sidebar */}
        <div className="w-[25%] fixed hidden left-0 h-full xl:flex justify-center">
          <div className="bg-[#252525] flex flex-col py-4 rounded-lg shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] xl:w-[200px] w-[180px] 2xl:w-[240px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[550px] 2k:h-[800px] 3k:h-[900px] overflow-x-hidden">
            <h1 className="font-Roboto text-xl xl:text-2xl 2k:text-3xl px-4 pb-4 text-[#EFEFEF] font-normal text-center">Who's popular</h1>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
            <div className="group w-full flex flex-col gap-2 bg-transparent px-4 lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px] 2k:max-h-[800px] overflow-y-hidden hover:overflow-y-scroll scrollbar">
                <UserSkeleton />
            </div>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
          </div>
        </div>

        {/* Middle Content */}
        <div className="flex-grow flex flex-col justify-center xl:px-[25%]">
            <NewPostSkeleton />
            <div className="flex gap-4 py-6 justify-center items-center">
                <div>
                    <button className="text-2xl cursor-pointer text-[#EFEFEF]">Popular</button>
                </div>
                <span className="h-10 block border-black bg-[#8A8A8A] w-[1px]"></span>
                <div>
                    <button className="text-2xl cursor-pointer text-[#EFEFEF]">Your Feed</button>
                </div>
            </div>
            <PostSkeleton />
        </div>

        {/* Right Sidebar */}
        <div className="w-[25%] fixed hidden right-0 h-full xl:flex justify-center">
          <div className="bg-[#252525] flex flex-col justify-between py-4 rounded-lg shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] xl:w-[200px] w-[180px] 2xl:w-[240px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[550px] 2k:h-[800px] 3k:h-[900px] overflow-x-hidden">
              <h1 className="font-Roboto text-xl xl:text-2xl 2k:text-3xl px-4 pb-4 text-[#EFEFEF] font-normal text-center">Your friends</h1>
              <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
              <div className="group w-full flex flex-col gap-2 bg-transparent px-4 lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px] 2k:max-h-[800px] overflow-y-hidden hover:overflow-y-scroll scrollbar">
                <UserSkeleton />
              </div>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
