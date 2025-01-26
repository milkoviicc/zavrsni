
'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import loginImg from '@/public/images/login-img.png';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'framer-motion';

const Auth = () => {

  const [loginRoute, setLoginRoute] = useState(true);

  
  // prosljedjuje mi se funkcija login iz AuthProvider.tsx
  const {login, register} = useAuth();

  // opceniti stateovi
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState(false);
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

  useEffect(() => {
    const handleResize = () => {
      setIsHorizontal(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);

    // Set initialRender to false after the first render
    setInitialRender(false);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // async funkcija koja se poziva kada se klikne gumb 'Sign in'.
  const handleSignIn = async () => {
    
    setError(null);
    
    // stavljamo loading state na true
    setLoading(true);

    // provjerava se je li unešeno ime i prezime prazno, ukoliko je izbacuje Error i vraća vrijednost 'false'
    if(name === '' || loginPassword === '') {
        setLoading(false);
        setError(null);
      return false;
    }

    // ukoliko unešeno ime i prezime nije prazno ulazi u try/catch
    try {

      // poziva se login funckija iz AuthProvider.tsx filea, i uz pomoć await čeka se response
      await login(name,loginPassword);

      // ukoliko je API call iz funkcije login prošao, postavlja se poruka na true te se prikazuje na stranici 
      setShowMessage(true);

      // nakon 1.5s poruka se postavlja na false te se više ne prikazuje na stranici
      setTimeout(() => setShowMessage(false), 1500);

      // stavljamo loading state na false jer se više ne loada nego je sve gotovo
      setLoading(false);
    } catch(err) {
      // ukoliko se username/email ne može pronaći u bazi podataka, postavljamo Error sa određenom porukom
      setLoading(false);
      setError('Invalid username/email or password, try again!');
    }
  }

  const validateForm = () => {

    // varijabla za provjeravanje brojeva
    const numberRegex = /\d/;

    // ukoliko nešto od podataka nije uneseno, postavlja se error poruka i vraća false

    if(!username || !email || !registerPassword || !confirmRegisterPassword) {
      setError('You must fill in all fields!');
      return false;
    }

    // ukoliko email ne sadrži '@', postavlja se error poruka i vraća false

    if(!email.includes('@')) {
      setError('Email is not in the correct format. ');
      return false;
    }

    // ukoliko lozinka nije jednaka potvrdjenoj lozinki, postavlja se error poruka i vraća false


    if(registerPassword !== confirmRegisterPassword) {
      setError('Passwords must match!');
      return false;
    }

    // ukoliko lozinka ne sadrži 8 znakova, postavlja se error poruka i vraća false

    if(registerPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    // ukoliko lozinka ne sadrži niti 1 broj, postavlja se error poruka i vraća false
    
    if(!numberRegex.test(registerPassword)) {
      setError('Password must contain at least 1 digit!');
      return false;
    }

    // ukoliko je sve dobro vraća se true

    return true;
  };


  // async funkcija koja se poziva kada se klikne gumb 'Sign up'.

  const handleRegister = async () => {

    setError(null);

    // radim varijablu isValid kojoj je vrijednost vraćena iz funkcije validateForm()

    const isValid = validateForm();

    // ukoliko je vrijednost false vraća se i ništa se dalje ne izvršava, inače ako je true ide dalje
    if(!isValid) return;

    // loading state se postavlja na true

    setLoading(true);

    try {

      // poziva se register funckija iz AuthProvider.tsx filea, i uz pomoć await čeka se response
      await register(username, email, registerPassword, confirmRegisterPassword);

      // ukoliko je API call iz funkcije register prošao, postavlja se poruka na true te se prikazuje na stranici 
      setShowMessage(true);

      // nakon 1.5s poruka se postavlja na false te se više ne prikazuje na stranici
      setTimeout(() => setShowMessage(false), 1500);

      // stavljamo loading state na false jer se više ne loada nego je sve gotovo
      setLoading(false);
    } catch(err) {
      setLoading(false);
      // ukoliko je došlo do greške, postavljamo Error sa određenom porukom
      setTimeout(() =>{
        setError(null);
      }, 1500);
      setError('This username or email are already registered, try a different one!')
    }
  }
  
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    const slideVariants = {
      initial: isMobile 
        ? { y: loginRoute ? '0%' : '100%' } // Slide vertically out of view for mobile
        : { x: loginRoute ? '0%' : '60%' },   // Slide horizontally on larger screens
      animate: isMobile 
        ? { y: loginRoute ? '100%' : '0%' } // Slide vertically into view for mobile
        : { x: loginRoute ? '60%' : '0%' }, // Slide horizontally on larger screens
      transition: { duration: 0.8 },
    };

  return (
    <AnimatePresence mode="wait">
    <div className='min-w-screen min-h-screen flex sm:flex-row sm:justify-between flex-col overflow-y-hidden overflow-x-hidden relative'>
        <div className='flex justify-center items-center sm:w-[37%] w-full'>
          <div className='flex items-center justify-center'>
            <div className='md:px-4 px-2 sm:py-14 py-10'>
              <p className='text-gray-400 text-sm my-2'>Please enter your details.</p>
              <h1 className='text-black font-bold text-3xl'>Welcome back</h1>
            
              <form className='my-4 flex flex-col' onSubmit={(e) => {e.preventDefault(); handleSignIn()}}>
                <input type="text" className={`lg:w-80 md:w-64 sm:w-56 w-full py-3 px-4 border ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Email address or username' id="name" onChange={(e) => setName(e.target.value)}/>
                <input type="password" className={`lg:w-80 md:w-64 sm:w-56 w-full py-3 px-4 border  ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Password' id="loginPassword" onChange={(e) => setLoginPassword(e.target.value)} autoComplete="off" />
                {error !== null ? <p className='text-red-500 text-sm my-2'>{error}</p> : null}
                {loading ? <h1>Signing you in...</h1> : null}
                {showMessage ? <p className='text-green-600 text-sm my-2'>You have been succesfully registered. Redirecting you to our login page.</p> : null}
                <button className='bg-[#2F2F2F] hover:bg-[#232F5C] text-white font-bold lg:w-80 md:w-64 w-full sm:w-56 py-2 border border-[#232F5C] rounded transition-all' onClick={() => handleSignIn()} >Sign in <FontAwesomeIcon icon={faArrowRight} className='px-2'/></button>
              </form>
              <p className='my-4 text-sm text-black text-opacity-[42%]'>Not a member? <a onClick={() => {setLoginRoute((prev) => !prev); setError(null)}} className='text-black hover:text-[#232F5C] underline hover:cursor-pointer transition-all'>Create an account</a></p>
            </div>
          </div>
        </div>
        <div className='flex justify-center items-center sm:w-[37%] w-full'>
          <div className='flex items-center justify-center md:px-2 sm:px-2 px-1'>
            <div className='md:px-8 px-0 sm:py-14 py-0'>
              <p className='text-gray-400 text-sm my-2'>Please enter your details.</p>
              <h1 className='text-black font-bold lg:text-4xl md:text-2xl sm:text-xl text-2xl'>Create an account</h1>
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
                {showMessage ? (
                  <p className='text-green-600 text-sm my-2'> You have been successfully registered. Redirecting you to our home page. </p>
                ) : null}
                <button type="submit" className='bg-[#2F2F2F] hover:bg-[#232F5C] text-white font-bold w-full py-2 border border-[#232F5C] rounded transition-all'> Sign up <FontAwesomeIcon icon={faArrowRight} className='px-2'/> </button>
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
          <p className="text-white text-opacity-[42%] font-Ovo lg:text-xl md:text-base text-sm">
            Make your boring days less boring!
          </p>
          <Image src={loginImg} alt="login img" className="w-1/2 sm:px-10 sm:w-full md:w-full md:px-10 lg:w-full lg:px-40 xl:w-1/2 xl:px-0" />
        </motion.div>
      </div>
      
  </AnimatePresence>
  )
}

export default Auth
