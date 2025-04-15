'use client';
import { getCookieServer } from '@/src/lib/getToken';
import { profileApi } from '@/src/lib/utils';
import { User } from '@/src/types/types';
import React, { useState } from 'react'

const AddDetails = () => {
    const [successfullUpdate, setSuccessfullUpdate] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [description, setDescription] = useState('');
    const [occupation, setOccupation] = useState('');
    const addDetails = async(firstName: string, lastName: string, description: string, occupation: string) => {
        const user = await getCookieServer('user');
        if(user) {
            const userData: User = JSON.parse(user);

            const firstNameCapitalized = firstName.slice(0,1).toUpperCase() + firstName.slice(1);
            const lastNameCapitalized = lastName.slice(0,1).toUpperCase() + lastName.slice(1);
            const res = await profileApi.updateProfile(userData.username, firstNameCapitalized, lastNameCapitalized, description, occupation);

            if(res.status === 200) {
                setSuccessfullUpdate(true);

                const userData = JSON.stringify(res.data);
                document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
                document.cookie = `user=${userData}; path=/;`;
                window.location.reload();
            }
        }
    }

  return (
    <div className="flex justify-center items-center h-full bg-[#222222] px-4 sm:px-0 flex-grow">
        <div className="border-1 border-black bg-[#363636] text-[#F0F0F0] rounded-md px-4 py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.2)]">
            <h1 className="text-center py-4">We just need a little more information about you.</h1>
            <form onSubmit={(e) => {e.preventDefault(); addDetails(firstName, lastName, description, occupation)}}>
                <div>
                    <p>Please enter your full name.</p>
                    <input type="text" maxLength={20} required className={`w-full bg-[#515151] py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='First name' id="firstname" onChange={(e) => setFirstName(e.target.value)} autoComplete="off"/>
                    <input type="text" maxLength={20} required className={`w-full bg-[#515151] py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Last name' id="lastname" onChange={(e) => setLastName(e.target.value)} autoComplete="off"/>
                </div>
                <div>
                    <p>Please tell us something about yourself.</p>
                    <textarea maxLength={100} className={`w-full bg-[#515151] py-3 px-4 resize-none border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Description' id="description" onChange={(e) => setDescription(e.target.value)} autoComplete="off"/>
                    <input type="text" maxLength={60}  className={`w-full bg-[#515151] py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Occupation, ex. Student' id="occupation" onChange={(e) => setOccupation(e.target.value)} autoComplete="off"/>
                </div>
                <div className="flex justify-center items-center py-2">
                    <button className='bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,0.7)] text-[#F0F0F0] font-Roboto w-fit px-8 py-2 border border-blue-700 rounded-lg transition-all cursor-pointer'>Confirm</button>
                </div>
            </form>
            {successfullUpdate ? <p className="text-green-500">You have successfully updated your profile information</p> : null}
        </div>
    </div>
  )
}

export default AddDetails