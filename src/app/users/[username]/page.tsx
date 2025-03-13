/* eslint-disable @typescript-eslint/no-explicit-any */
// app/users/[username]/page.tsx
import { profileApi, postsApi, friendsApi } from '@/src/lib/utils';
import { Friendship, Post, Profile, User } from '@/src/types/types';
import UserComponent from '@/src/components/other/UserComponent';
import MyProfileDetails from '@/src/components/profile/MyProfileDetails';
import ProfilePosts from '@/src/components/profile/ProfilePosts';
import UserDetails from '@/src/components/profile/UserDetails';
import { revalidatePath } from 'next/cache';
import { getCookieServer } from '@/src/lib/getToken';

async function getUser(username: string) {
  const res = await profileApi.getProfileByUsername(username);
  return res.data as Profile;
}

async function getPosts(username: string) {
  const res = await postsApi.getUserPostsByUsername(username);
  return res.data as Post[];
}

async function getFriends(userId: string) {
  const res = await friendsApi.getFriends(userId);
  return res.data as Friendship[];
}

const Users = async ({ params }: any) => {
  const myparams = await params;
  const currentUser = await getUser(myparams.username);
  const loggedUser = await getCookieServer('user');

  if(!loggedUser) {
    return;
  }

  const loggedUserData: User = JSON.parse(loggedUser);

  // Fetch posts and friends concurrently
  const [posts, friends] = await Promise.all([
    getPosts(currentUser.username),
    getFriends(currentUser.userId),
  ]);


  const refreshPosts = async () => {
    'use server';
    revalidatePath('/users');
  };

  const handleChangeImage = async (selectedImage: File) => {
    'use server';
    await profileApi.updateProfilePicture(selectedImage);
    revalidatePath('/users');
  };

  const revalidate = async() => {
    'use server';
    revalidatePath('/users');
  }

  return (
    <div className="w-full min-h-[854px] h-full bg-[#222222]">
      <div className="flex h-full py-16 md:py-30">
        {currentUser.username === loggedUserData.username ? (
          <MyProfileDetails user={currentUser} changeImage={handleChangeImage} revalidate={revalidate}/>
        ) : (
          <UserDetails />
        )}

        <div className="flex-grow flex justify-center xl:px-[25%]">
          <ProfilePosts user={currentUser} posts={posts} refreshPosts={refreshPosts} myPosts={currentUser.username === loggedUserData.username ? 'true' : 'false'} />
        </div>
        <div className="w-[25%] fixed hidden right-0 h-full xl:flex justify-center">
          <div className="bg-[#252525] flex flex-col justify-between py-4 rounded-lg shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] xl:w-[200px] w-[180px] 2xl:w-[240px] 2k:w-[275px] lg:h-[400px] xl:h-[500px] 2xl:h-[550px] 2k:h-[800px] 3k:h-[900px]">
            <div className="flex flex-col">
              <h1 className="font-Roboto text-xl xl:text-2xl 2k:text-3xl px-4 pb-4 text-[#EFEFEF] font-normal text-center">Your friends</h1>
              <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
              <div className="group w-full flex flex-col gap-2 bg-transparent px-4 lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px] 2k:max-h-[800px] overflow-y-hidden hover:overflow-y-scroll scrollbar">
                {friends && friends?.map((friend) => (
                  <UserComponent key={friend.user.userId} user={friend.user} handleRoute={null} />
                ))}
              </div>
            </div>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
