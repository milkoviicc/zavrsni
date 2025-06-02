/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import loginImg from '@/public/images/login-img.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/src/context/AuthProvider';
import { toast } from 'sonner';

const Auth = () => {

  const [loginRoute, setLoginRoute] = useState(true);

  // prosljedjuje mi se funkcija login iz AuthProvider.tsx
  const {callLogin, callRegister} = useAuth();

  // opceniti stateovi
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isHorizontal, setIsHorizontal] = useState(window.innerWidth > 768);
  const [initialRender, setInitialRender] = useState(true);

  // stateovi za login
  const [name, setName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // stateovi za register
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmRegisterPassword, setConfirmRegisterPassword] = useState('');

  // provjerava se sirina ekrana i initialRender na false nakon prvog renderiranja

  useEffect(() => {
    const handleResize = () => {
      setIsHorizontal(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);

    setInitialRender(false);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // async funkcija koja se poziva kada se klikne gumb 'Sign in'.
  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
  
    if (name === '' || loginPassword === '') {
      setLoading(false);
      setError(null);
      return false;
    }
  
    try {
      const res = await callLogin(name, loginPassword);
  
      if (res?.status === 200) {
        toast("You have been successfully signed in. Redirecting you to our home page.",{duration: 1500, style: {backgroundColor: "#1565CE", border: "none", color: "#fff"}})
      } else {
        setError(res?.statusText || "Unknown error occured");
      }
  
    } catch (error: any) {
      setError(error.response?.data.detail || "Login failed. Please try again.");
    }
  
    setLoading(false);
  };

  // funkcija koja provjerava unesene podatke u formi za registraciju

  const validateForm = () => {

    const numberRegex = /\d/;

    if(!username || !email || !registerPassword || !confirmRegisterPassword) {
      setError('You must fill in all fields!');
      return false;
    }

    if(!email.includes('@')) {
      setError('Email is not in the correct format. ');
      return false;
    }


    if(registerPassword !== confirmRegisterPassword) {
      setError('Passwords must match!');
      return false;
    }

    if(registerPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    if(!numberRegex.test(registerPassword)) {
      setError('Password must contain at least 1 digit!');
      return false;
    }

    return true;
  };


  // async funkcija koja se poziva kada se klikne gumb 'Sign up'.

  const handleRegister = async () => {

    setError(null);

    const isValid = validateForm();

    if(!isValid) return;


    setLoading(true);

    try {

      if (!/^[a-zA-Z]/.test(username)) {
        setError('Username must start with a letter.');
        setLoading(false);
        return;
      }

      await callRegister(username, email, registerPassword, confirmRegisterPassword);

      toast("You have been successfully registered. Redirecting you to our home page.", {duration: 1500, style: {backgroundColor: "#1565CE", border: "none", color: "#fff"}});

      setLoading(false);
    } catch(err: any) {
      setLoading(false);
      setError(err.message);
    }
  }
  
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    const slideVariants = {
      initial: isMobile 
        ? { y: loginRoute ? '0%' : '100%' } // Ulazi vertikalno u pogled na mobitelima
        : { x: loginRoute ? '0%' : '60%' },   // Ulazi horizontalno na većim ekranima
      animate: isMobile 
        ? { y: loginRoute ? '100%' : '0%' } // Ulazi vertikalno u pogled na mobitelima
        : { x: loginRoute ? '60%' : '0%' }, // Ulazi horizontalno na većim ekranima
      transition: { duration: 0.8 },
    };

  return (
    <AnimatePresence mode="wait">
    <div className='flex-grow flex sm:flex-row sm:justify-between flex-col overflow-y-hidden overflow-x-hidden relative h-screen'>
        <div className='flex justify-center items-center sm:w-[37%] w-full'>
          <div className='flex items-center justify-center w-full'>
            <div className='md:px-4 px-2 sm:py-14 py-10'>
              <h1 className='text-black font-bold text-3xl'>Welcome back</h1>
              <p className='text-gray-400 text-sm my-2'>Please enter your details.</p>
            
              <form className='my-4 flex flex-col w-full' onSubmit={(e) => {e.preventDefault(); handleSignIn()}}>
                <input type="text" className={`lg:w-80 md:w-64 sm:w-56 w-full py-3 px-4 border ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Email address or username' id="name" onChange={(e) => setName(e.target.value)}/>
                <input type="password" className={`lg:w-80 md:w-64 sm:w-56 w-full py-3 px-4 border  ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Password' id="loginPassword" onChange={(e) => setLoginPassword(e.target.value)} autoComplete="off" />
                {error !== null ? <p className='text-red-500 text-sm my-2'>{error}</p> : null}
                {loading ? <h1>Signing you in...</h1> : null}
                <button className='bg-[#2F2F2F] hover:bg-[#232F5C] text-white font-bold lg:w-80 md:w-64 w-full sm:w-56 py-2 border border-[#232F5C] rounded transition-all cursor-pointer'>Sign in <FontAwesomeIcon icon={faArrowRight} className='px-2'/></button>
              </form>
              <p className='my-4 text-sm text-black text-opacity-[42%]'>Not a member? <a onClick={() => {setLoginRoute((prev) => !prev); setError(null)}} className='text-black hover:text-[#232F5C] underline hover:cursor-pointer transition-all'>Create an account</a></p>
            </div>
          </div>
        </div>
        <div className='flex justify-center items-center sm:w-[37%] w-full'>
          <div className='flex items-center justify-center md:px-2 sm:px-2 px-1'>
            <div className='md:px-8 px-0 sm:py-14 py-12'>
              <h1 className='text-black font-bold lg:text-4xl md:text-2xl sm:text-xl text-2xl'>Create an account</h1>
              <p className='text-gray-400 text-sm my-2'>Please enter your details.</p>
              <form onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
                className='my-4'>
                <div className='md:block sm:flex sm:flex-col flex flex-row gap-2'>
                  <input type="text" className={`w-full py-3 px-4 border ${error === null ? 'border-gray-300' : 'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Username' id="username" onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
                  <input type="email" className={`w-full py-3 px-4 border ${error === null ? 'border-gray-300' : 'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Email address' id="email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='md:block sm:flex sm:flex-col flex flex-row gap-2'>
                  <input type="password" className={`w-full py-3 px-4 border ${error === null ? 'border-gray-300' : 'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Password'id="registerPassword" onChange={(e) => setRegisterPassword(e.target.value)} autoComplete="off" />
                  <input type="password" className={`w-full py-3 px-4 border ${error === null ? 'border-gray-300' : 'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Confirm password' id="confirmPassword" onChange={(e) => setConfirmRegisterPassword(e.target.value)} autoComplete="off" />
                </div>
                {error !== null ? <p className='text-red-500 text-sm my-2'>{error}</p> : null}
                {loading ? <h1>Registering your account...</h1> : null}
                <button type="submit" className='bg-[#2F2F2F] hover:bg-[#232F5C] text-white font-bold w-full py-2 border border-[#232F5C] rounded transition-all cursor-pointer'> Sign up <FontAwesomeIcon icon={faArrowRight} className='px-2'/> </button>
              </form>
              <p className='my-4 text-sm text-black text-opacity-[42%] text-center'> Already have an account?{' '} <a onClick={() => { setLoginRoute((prev) => !prev); setError(null); }} className='text-black hover:text-[#232F5C] underline hover:cursor-pointer transition-all' > Sign in. </a> </p>
            </div>
          </div>
        </div>
        <motion.div
        key={loginRoute ? 'Login' : 'Register'}
        className={`absolute top-0 sm:w-[63%] w-full sm:min-h-screen max-h-screen h-[50%] bg-[#323232] flex flex-col sm:pt-40 pt-4 items-center gap-6`}
        initial={initialRender ? false : slideVariants.initial}
        animate={slideVariants.animate}
        transition={slideVariants.transition}>
          <h1 className="font-Kaisei lg:text-6xl md:text-5xl text-4xl text-white">Meet new people</h1>
          <p className="text-white text-opacity-[42%] font-Ovo lg:text-xl md:text-base text-sm"> Make your boring days less boring! </p>
          <Image src={loginImg} alt="login img" className="w-1/2 sm:px-10 sm:w-full md:w-full md:px-10 lg:w-full lg:px-40 xl:w-1/2 xl:px-0" />
        </motion.div>
      </div>
      
  </AnimatePresence>
  )
}

export default Auth
