import { followsApi } from '@/src/lib/utils';
import { User } from '@/src/types/types';
import React, { useEffect, useState } from 'react'
import UserComponent from './UserComponent';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/context/AuthProvider';

const SearchedUser = ({searchedUser}: {searchedUser: User}) => {
    const [isFollowed, setIsFollowed] = useState(false);

    const {data} = useQuery({queryKey: ["getFollowedUsers"], queryFn: () => getFollowedUsers()});

    const {user} = useAuth();

   // Funkcija koja dohvaća listu korisnika koje trenutni korisnik prati
    const getFollowedUsers = async (): Promise<string[]> => {
        try {
            if(user) {
                const res = await followsApi.getFollowed(user?.userId);
                return res.data; 
            }
            return [];
        } catch (error) {
            console.error("Error fetching friendship status:", error);
            throw error;
        }
    };

    // provjeravamo jesu li podatci koji se dobijaju iz funkcije niz i ako jesu, provjeravamo da li je trenutni korisnik kojeg tražimo u tom nizu te postavljamo setIsFollowed na true ili false

    useEffect(() => {
        if(Array.isArray(data)) {
            setIsFollowed(data.some((userId) => searchedUser.userId === userId));
        }
    }, [data, searchedUser.userId]);

    // funkcija koja se poziva kada se klikne na follow/unfollow button, šalje se zahtjev na server i ažurira se stanje isFollowed

    const handleFollow = async (id: string) => {
        try {
            if(isFollowed) {
                const res = await followsApi.unfollow(id);

                if(res.status === 200) {
                    setIsFollowed(false);
                }
            } else {
                const res = await followsApi.addFollow(id);

                if(res.status === 200) {
                    setIsFollowed(true);
                }
            }
        } catch(err) {
            console.error(err);
        }
    }

    if(!user) {
        return;
    }
    
  return (
    <div className='relative w-full flex justify-between items-center gap-2 sm:gap-4 px-1'>
        <UserComponent user={searchedUser} handleRoute={null}/>
        <button className={`${isFollowed ? 'bg-[#3E3E3E] shadow-[1px_2px_4px_1px_rgba(0,0,0,0.1)] hover:shadow-[0px_0px_2px_2px_rgba(0,0,0,0.3)]' : 'bg-[#1565CE] shadow-[1px_2px_4px_1px_rgba(12,75,156,1)] hover:shadow-[0px_0px_2px_2px_rgba(12,75,156,1)]'} px-2 sm:px-4 w-[125px] h-fit rounded-2xl font-Roboto text-[#E3E3E3] text-base transition-all cursor-pointer`} onClick={() => handleFollow(searchedUser.userId)}>{isFollowed ? 'Followed' : 'Follow'}</button>
    </div> 
  )
}

export default SearchedUser