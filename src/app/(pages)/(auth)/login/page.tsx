/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, {useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios';
import { useAuth } from '@/src/app/context/AuthProvider';
import loginImg from '@/public/images/login-img.png'
import Image from 'next/image';

import FortAwesomeIcon, { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Login = () => {


  // prosljedjuje mi se funkcija login iz AuthProvider.tsx
  const {login} = useAuth();

  // nextJs router za mjenjanje path-a
  const router = useRouter();

  // stateovi
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // async funkcija koja se poziva kada se klikne gumb 'Sign in'.

  const handleSignIn = async () => {


    // stavljamo loading state na true
    setLoading(true);


    // provjerava se je li unešeno ime i prezime prazno, ukoliko je izbacuje Error i vraća vrijednost 'false'
    if(name === '' || password === '') {
      setError('You must fill in all the fields.');
      return false;
    }

    // ukoliko unešeno ime i prezime nije prazno ulazi u try/catch
    try {

      // poziva se login funckija iz AuthProvider.tsx filea, i uz pomoć await čeka se response
      await login(name,password);

      // ukoliko je API call iz funkcije login prošao, postavlja se poruka na true te se prikazuje na stranici 
      setShowMessage(true);

      // nakon 1.5s poruka se postavlja na false te se više ne prikazuje na stranici
      setTimeout(() => setShowMessage(false), 1500);

      // stavljamo loading state na false jer se više ne loada nego je sve gotovo
      setLoading(false);
    } catch(err) {
      // ukoliko se username/email ne može pronaći u bazi podataka, postavljamo Error sa određenom porukom
      setError('Invalid username/email or password, try again!');
    }
  }

  return (

    <div className='w-full min-h-screen flex'>
      <div className='flex justify-center items-center w-[40%]'>
        <div className='flex items-center justify-center px-10'>
          <div className='px-8 py-14'>
            <p className='text-gray-400 text-sm my-2'>Please enter your details.</p>
            <h1 className='text-black font-bold text-3xl'>Welcome back</h1>
          
            <div className='my-4'>
              <input type="text" className={`w-full py-3 px-4 border ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Email address or username' id="name" onChange={(e) => setName(e.target.value)}/>
              <input type="password" className={`w-full py-3 px-4 border  ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Password' id="password" onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
              {error !== null ? <p className='text-red-500 text-sm my-2'>{error}</p> : null}
              {loading ? <h1>Signing you in...</h1> : null}
              {showMessage ? <p className='text-green-600 text-sm my-2'>You have been succesfully registered. Redirecting you to our login page.</p> : null}
            </div>

            <div className='my-2'>
              <button className='bg-[#2F2F2F] hover:bg-[#232F5C] text-white font-bold w-full py-2 border border-[#232F5C] rounded transition-all' onClick={() => handleSignIn()} >Sign in <FontAwesomeIcon icon={faArrowRight} className='px-2'/></button>
            
              <p className='my-4 text-sm text-black text-opacity-[42%] text-center'>Not a member? <a onClick={() => router.push('/register')} className='text-black hover:text-[#232F5C] underline hover:cursor-pointer transition-all'>Create an account</a></p>
            </div>
          </div>
        </div>
      </div>
      <div className='relative w-[60%] bg-[#323232] flex flex-col pt-40 items-center gap-6'>
        <h1 className='font-Kaisei text-7xl text-white'>Meet new people</h1>
        <p className='text-white text-opacity-[42%] font-Ovo text-xl'>Make your boing days less boring!</p>
        <Image src={loginImg} alt="login img" className='w-1/2' />
      </div>
    </div>
  )
}

export default Login