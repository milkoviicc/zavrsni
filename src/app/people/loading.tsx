import PeopleSkeleton from "@/src/components/skeletons/PeopleSkeleton"

const Profiles = () => {

  return (
    <div className='flex-grow bg-[#252525] h-screen'>
      <div className='flex flex-col justify-center items-center h-full'>
        <div className='flex flex-col gap-4 max-w-[600px] w-full px-6 sm:px-0 py-32'>
            <h1 className='font-Roboto text-center text-[#888888] text-2xl pt-4'>You might like</h1>
            <PeopleSkeleton />
        </div>
      </div>
    </div>
  )
}

export default Profiles