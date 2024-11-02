/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthProvider";
import { useRouter } from "next/navigation";




export default function Home() {

  const {user, logout, isAuthenticated, fullyRegistered, addDetails } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');


  

  return (
    <div className='h-full'>
      {isAuthenticated && fullyRegistered
      ?
      <div>
        <h1>bok</h1>
      </div>

      :  isAuthenticated && !fullyRegistered 
      ?  
      <div className="border-1 border-black bg-[#f5f4f4] rounded-md shadow-lg ">
        <div className="px-8 py-14">
          <h1>We just need a little more information about you.</h1>
          <p>Please enter your full name.</p>
          <input type="text" className={`w-full py-3 px-4 borde border-gray-300  rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='First name' id="firstname" onChange={(e) => setFirstName(e.target.value)}/>
          <input type="text" className={`w-full py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Last name' id="lastname" onChange={(e) => setLastName(e.target.value)}/>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold w-full py-2 border border-blue-700 rounded transition-all' onClick={() => addDetails(firstName, lastName)}>Confirm</button>
        </div>
      </div>
      :
      null
      }
    </div>
  );
}
