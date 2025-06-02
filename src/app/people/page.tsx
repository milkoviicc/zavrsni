/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { User } from '../../types/types';

import { profileApi } from '@/src/lib/utils';
import Profiles from '@/src/components/people/Profiles';

// Funkcija koja dobija korisnike na osnovu pretrage

async function getUsersBySearch(searchTerm: string) {
  const res = await profileApi.searchProfiles(searchTerm);
  const searchedUsers: User[] = res.data;
  return searchedUsers;
}

// Funkcija koja dobija prijedloge za praćenje korisnika

async function getSuggestions() {
  const res = await profileApi.getFollowSuggestions();
  const suggestions: User[] = res.data;
  return suggestions;
}

// Funkcija koja dobija profile korisnika, ograničene na određeni broj

async function getProfiles(limit: number) {
  const res = await profileApi.getProfiles(limit);
  const profiles: User[] = res.data;
  return profiles;
}

// Definicija tipova za props
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
