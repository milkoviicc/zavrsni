/* eslint-disable @typescript-eslint/no-explicit-any */
// app/users/[username]/page.tsx
import { profileApi, postsApi, friendsApi } from '@/src/lib/utils';
import { Friendship, FriendshipStatus, Post, Profile, User } from '@/src/types/types';
import UserComponent from '@/src/components/other/UserComponent';
import MyProfileDetails from '@/src/components/profile/MyProfileDetails';
import ProfilePosts from '@/src/components/profile/ProfilePosts';
import UserDetails from '@/src/components/profile/UserDetails';
import { revalidatePath } from 'next/cache';
import { getCookieServer } from '@/src/lib/getToken';
import MobileFriends from '@/src/components/profile/MobileFriends';

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

async function getFriendshipStatus(userId: string) {
  const res = await profileApi.getFriendshipStatus(userId);
  return res.data as FriendshipStatus;
}

async function getMutualFriends(userId: string) {
  const res = await profileApi.getMutualFriends(userId);
  return res.data as User[];
}

async function getPopularUsers() {
  const res = await profileApi.getProfiles(10);
  return res.data as User[];
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
  const [posts, friends, popularUsers] = await Promise.all([
    getPosts(currentUser.username),
    getFriends(currentUser.userId),
    getPopularUsers()
  ]);

  let friendshipStatus: FriendshipStatus | null = null;
  let mutualFriends: User[] | null = null;

  if(currentUser.username !== loggedUserData.username) {
    friendshipStatus = await getFriendshipStatus(currentUser.userId);
    mutualFriends = await getMutualFriends(currentUser.userId);
  }

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
    <div className="w-full min-h-full bg-[#222222]">
      <div className="flex xl:flex-row flex-col h-full py-16 md:py-30">
        {currentUser.username === loggedUserData.username ? (
          <MyProfileDetails user={currentUser} changeImage={handleChangeImage} revalidate={revalidate}/>
        ) : (
          <UserDetails pathUser={currentUser} friendship={friendshipStatus} mutualFriends={mutualFriends} popular={popularUsers}/>
        )}  

        <div className="flex-grow flex flex-col items-center justify-center xl:px-[25%]">
          <div className='flex xl:hidden xl:w-0 w-full'>
            <MobileFriends friends={friends} currentUser={currentUser} loggedUserData={loggedUserData} />
          </div>
          <ProfilePosts user={currentUser} posts={posts} refreshPosts={refreshPosts} myPosts={currentUser.username === loggedUserData.username ? 'true' : 'false'} />
        </div>
        
        <div className="w-[25%] fixed hidden right-0 h-full xl:flex justify-center homeUsers2k">
          <div className="bg-[#252525] flex flex-col py-4 rounded-lg shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] w-[180px] xl:w-[200px] 2xl:max-w-[275px] 2xl:w-full lg:h-[400px] xl:h-[500px] 2xl:h-[550px] screen2k overflow-x-hidden">
            <h1 className="font-Roboto text-xl xl:text-2xl 2k:text-3xl px-4 pb-4 text-[#EFEFEF] font-normal text-center">{currentUser.username === loggedUserData.username ? 'Your friends' : `${currentUser.firstName?.slice(0,1).toUpperCase()}${currentUser.firstName?.slice(1)}'s friends`}</h1>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
            <div className="group w-full h-full flex flex-col gap-2 bg-transparent px-4 lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px] screen2k overflow-y-hidden hover:overflow-y-scroll scrollbar">
              {friends.map((user) => (
                <UserComponent key={user.user.userId} user={user.user} handleRoute={null} />
              ))}
            </div>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
