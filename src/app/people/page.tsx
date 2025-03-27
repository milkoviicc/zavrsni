/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { User } from '../../types/types';

import { profileApi } from '@/src/lib/utils';
import Profiles from '@/src/components/people/Profiles';

async function getUsersBySearch(searchTerm: string) {
  const res = await profileApi.searchProfiles(searchTerm);
  const searchedUsers: User[] = res.data;
  return searchedUsers;
}

async function getSuggestions() {
  const res = await profileApi.getFollowSuggestions();
  const suggestions: User[] = res.data;
  return suggestions;
}

async function getProfiles(limit: number) {
  const res = await profileApi.getProfiles(limit);
  const profiles: User[] = res.data;
  return profiles;
}

type Props = {
  searchParams: Promise<{ [key: string]: string }>;
};

const People = async({searchParams}: Props) => {
  const searchParam = await searchParams;
  const searchTerm = searchParam.searchTerm;

  const searchedUsers =  await getUsersBySearch(searchTerm);
  const suggestions = await getSuggestions();
  const profiles = await getProfiles(10);

  return (
    <div className='flex-grow bg-[#252525]'>
      <div className='flex flex-col justify-center items-center py-24 h-full'>
        <Profiles searchTerm={searchTerm} searchedUsers={searchedUsers} users={profiles} suggestions={suggestions}/>
      </div>
    </div>
  )
}

export default People;
