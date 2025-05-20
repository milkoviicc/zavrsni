/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { redirect, useRouter } from "next/navigation";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Suggestions from "../components/other/Suggestions";
import { getCookieServer } from "../lib/getToken";
import { useAuth } from "../context/AuthProvider";
import { getCookie } from "cookies-next";
import { followsApi, friendsApi, postsApi, profileApi } from "../lib/utils";
import { GetServerSideProps } from "next";
import { Friendship, Post, User } from "../types/types";
import UserComponent from "../components/other/UserComponent";
import UserSkeleton from "../components/skeletons/UserSkeleton";
import { Suspense } from "react";
import Posts from "../components/posts/Posts";
import { revalidatePath } from "next/cache";
import AddDetails from "../components/other/AddDetails";
import AddPicture from "../components/other/AddPicture";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function getPopularUsers() {
  const res = await profileApi.getPopularProfiles();
  const popularUsers: User[] = await res.data;
  return popularUsers;
}

async function getPopularFeed() {
  const res = await postsApi.getPopularFeed();
  const popularFeed: Post[] = await res.data;
  return popularFeed;
}

async function getYourFeed() {
  const res = await postsApi.getYourFeed();
  const yourFeed: Post[] = await res.data;
  return yourFeed;
}

async function getYourFriends(userId: string) {
  const res = await friendsApi.getFriends(userId);
  const yourFriends: Friendship[] = await res.data;
  return yourFriends;
}

async function getSuggestions() {
  const res = await profileApi.getFollowSuggestions();
  const suggestions: User[] = res.data;
  return suggestions;
}

async function getFollowedUsers(userId: string) {
  const res = await followsApi.getFollowed(userId);
  const followedUsers = await res.data;
  return followedUsers;
}


export default async function Home() {

  const user = await getCookieServer('user');
  const ignoreDefaultPic = await getCookieServer('ignoreDefaultPic');
  if(!user) {
    return redirect('/auth');
  }

  const userData: User = JSON.parse(user);

  const [popularUsers, popularFeed, yourFeed, yourFriends, suggestions, followedUsers] = await Promise.all([getPopularUsers(), getPopularFeed(), getYourFeed(), getYourFriends(userData.userId), getSuggestions(), getFollowedUsers(userData.userId)]);

  const refreshPosts = async () => {
    'use server';
    revalidatePath('page');
  }

  let mergedUsers: User[] = suggestions;

  if(suggestions.length < 4) {
    const neededProfiles = 4 - suggestions.length;
  
    const existingUsersIds = new Set(suggestions.map(existingSuggestion => existingSuggestion.userId));
  
    const followedUserIds = new Set(followedUsers);
    const filteredPopularUsers = popularUsers.filter(popularUser => !existingUsersIds.has(popularUser.userId) && !followedUserIds?.has(popularUser.userId) && popularUser.userId !== userData.userId).slice(0, neededProfiles);
    
    mergedUsers = [...suggestions, ...filteredPopularUsers];
  }

  const handleSkipImage = async() => {
    'use server';
    const cookieStore = await cookies();
    cookieStore.set('ignoreDefaultPic', 'true', { path: '/' });
  }

  return (
    <div className="w-full min-h-full bg-[#222222]">
      {userData.firstName === null || userData.lastName === null   ? (
        <div className="w-full h-full">
          <AddDetails />
        </div>
      ) : userData.pictureUrl === 'https://snetblobstorage.blob.core.windows.net/snetprofiles/default.jpg' && !ignoreDefaultPic ? (
        <AddPicture user={userData} handleSkip={handleSkipImage}/>
      ) :
      (
      <div className="flex h-full py-16 md:py-30">
        {/* Left Sidebar */}
        <div className="w-[25%] fixed hidden left-0 h-full xl:flex justify-center homeUsers2k">
          <div className="bg-[#252525] flex flex-col py-4 rounded-lg shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] w-[180px] xl:w-[200px] 2xl:max-w-[275px] 2xl:w-full lg:h-[400px] xl:h-[500px] 2xl:h-[550px] overflow-x-hidden screen2k">
            <h1 className="font-Roboto text-xl xl:text-2xl 3xl:text-3xl px-4 pb-4 text-[#EFEFEF] font-normal text-center">Who's popular</h1>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
            <div className="group w-full h-full flex flex-col gap-2 bg-transparent px-4 lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px] screen2k overflow-y-hidden hover:overflow-y-scroll scrollbar">
              {popularUsers.map((user) => (
                <UserComponent key={user.userId} user={user} handleRoute={null} />
              ))}
            </div>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
          </div>
        </div>

        {/* Middle Content */}
        <div className="flex-grow flex justify-center xl:px-[25%]">
          <Posts popularFeed={popularFeed} yourFeed={yourFeed} suggestions={mergedUsers} refreshPosts={refreshPosts} />
        </div>

        {/* Right Sidebar */}
        <div className="w-[25%] fixed hidden right-0 h-full xl:flex justify-center homeUsers2k">
          <div className="bg-[#252525] flex flex-col py-4 rounded-lg shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.1)] w-[180px] xl:w-[200px] 2xl:max-w-[275px] 2xl:w-full lg:h-[400px] xl:h-[500px] 2xl:h-[550px] screen2k overflow-x-hidden">
            <h1 className="font-Roboto text-xl xl:text-2xl 3xl:text-3xl px-4 pb-4 text-[#EFEFEF] font-normal text-center">Your friends</h1>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
            <div className="group w-full h-full flex flex-col gap-2 bg-transparent px-4 lg:max-h-[400px] xl:max-h-[500px] 2xl:max-h-[600px] screen2k overflow-y-hidden hover:overflow-y-scroll scrollbar">
              {yourFriends.map((user) => (
                <UserComponent key={user.user.userId} user={user.user} handleRoute={null} />
              ))}
            </div>
            <span className="border-[1px] border-[#1C1C1C] opacity-45"></span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
