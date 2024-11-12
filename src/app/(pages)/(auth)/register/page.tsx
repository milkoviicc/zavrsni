/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, {useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios, {AxiosError} from 'axios';
import { useAuth } from '@/src/app/context/AuthProvider';
import { User } from '@/src/app/types/types';
import loginImg from '@/public/images/login-img.png';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import {motion} from 'framer-motion';


const Register = () => {

  // prosljedjuje mi se funkcija register iz AuthProvider.tsx
  const {register} = useAuth();

  // nextJs router za mjenjanje path-a
  const router = useRouter();

  // stateovi
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);


  // funkcija za provjeravanje je li sve u formi korektno napisano tj. uneseno

  const validateForm = () => {

    // varijabla za provjeravanje brojeva
    const numberRegex = /\d/;

    // ukoliko nešto od podataka nije uneseno, postavlja se error poruka i vraća false

    if(!username || !email || !password || !confirmPassword) {
      setError('You must fill in all fields!');
      return false;
    }

    // ukoliko email ne sadrži '@', postavlja se error poruka i vraća false

    if(!email.includes('@')) {
      setError('Email is not in the correct format. ');
      return false;
    }

    // ukoliko lozinka nije jednaka potvrdjenoj lozinki, postavlja se error poruka i vraća false


    if(password !== confirmPassword) {
      setError('Passwords must match!');
      return false;
    }

    // ukoliko lozinka ne sadrži 8 znakova, postavlja se error poruka i vraća false

    if(password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    // ukoliko lozinka ne sadrži niti 1 broj, postavlja se error poruka i vraća false
    
    if(!numberRegex.test(password)) {
      setError('Password must contain at least 1 digit!');
      return false;
    }

    // ukoliko je sve dobro vraća se true

    return true;
  };


  // async funkcija koja se poziva kada se klikne gumb 'Sign up'.

  const handleRegister = async () => {

    // radim varijablu isValid kojoj je vrijednost vraćena iz funkcije validateForm()

    const isValid = validateForm();

    // ukoliko je vrijednost false vraća se i ništa se dalje ne izvršava, inače ako je true ide dalje
    if(!isValid) return;

    // loading state se postavlja na true

    setLoading(true);

    try {

      // poziva se register funckija iz AuthProvider.tsx filea, i uz pomoć await čeka se response
      await register(username, email, password, confirmPassword);

      // ukoliko je API call iz funkcije register prošao, postavlja se poruka na true te se prikazuje na stranici 
      setShowMessage(true);

      // nakon 1.5s poruka se postavlja na false te se više ne prikazuje na stranici
      setTimeout(() => setShowMessage(false), 1500);

      // stavljamo loading state na false jer se više ne loada nego je sve gotovo
      setLoading(false);
    } catch(err) {
      // ukoliko je došlo do greške, postavljamo Error sa određenom porukom
      console.log('Registration failed: ', err);
      setError('This username or email are already registered, try a different one!')
    }
  }


  return (
    <div className='w-full min-h-screen flex sm:flex-row flex-col overflow-y-hidden -z-10'>
      <div className='relative sm:w-[60%] w-full sm:min-h-screen h-full bg-[#323232] flex flex-1 flex-col sm:pt-40 pt-2 items-center gap-6'>
        <h1 className='font-Kaisei lg:text-6xl md:text-5xl text-4xl text-white'>Meet new people</h1>
        <p className='text-white text-opacity-[42%] font-Ovo lg:text-xl md:text-base text-sm'>Make your boring days less boring!</p>
        <Image src={loginImg} alt="login img" className='w-1/2 sm:px-10 sm:w-full md:w-full md:px-10 lg:w-full lg:px-40 xl:w-1/2 xl:px-0' />
      </div>
      <div className='flex justify-center items-center sm:w-[40%] w-full'>
        <div className='flex items-center justify-center md:px-2 sm:px-2 px-1'>
          <div className='md:px-8 px-0 sm:py-14 py-10'>
            <p className='text-gray-400 text-sm my-2'>Please enter your details.</p>
            <h1 className='text-black font-bold text-3xl'>Create an account</h1>
          
            <div className='my-4'>
              <input type="text" className={`w-full py-3 px-4 border ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Username' id="username" onChange={(e) => setUsername(e.target.value)} autoComplete="off"/>
              <input type="email" className={`w-full py-3 px-4 border ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Email address' id="email" onChange={(e) => setEmail(e.target.value)}/>
              <input type="password" className={`w-full py-3 px-4 border ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Password' id="password" onChange={(e) => setPassword(e.target.value)} autoComplete="off"/>
              <input type="password" className={`w-full py-3 px-4 border  ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Confirm password' id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="off" />
              {error !== null ? <p className='text-red-500 text-sm my-2'>{error}</p> : null}
              {loading ? <h1>Registering your account...</h1> : null}
              {showMessage ? <p className='text-green-600 text-sm my-2'>You have been succesfully registered. Redirecting you to our home page.</p> : null}
            </div>

            <div className='my-2'>
              <button className='bg-[#2F2F2F] hover:bg-[#232F5C] text-white font-bold w-full py-2 border border-[#232F5C] rounded transition-all' onClick={() => handleRegister()} >Sign up <FontAwesomeIcon icon={faArrowRight} className='px-2'/></button>
            
              <p className='my-4 text-sm text-black text-opacity-[42%] text-center'>Already have an account? <a onClick={() => router.push('/login')} className='text-black hover:text-[#232F5C] underline hover:cursor-pointer transition-all'>Sign in.</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register