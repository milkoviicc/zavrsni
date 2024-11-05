/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, {useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios, {AxiosError} from 'axios';
import { useAuth } from '@/app/context/AuthProvider';
import { User } from '@/app/types/types';



const Register = () => {
  const {register} = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const validateForm = () => {
    const numberRegex = /\d/;

    if(!username || !email || !password || !confirmPassword) {
      setError('You must fill in all fields!');
      return false;
    }

    if(!email.includes('@')) {
      setError('Email is not in the correct format. ');
      return false;
    }


    if(password !== confirmPassword) {
      setError('Passwords must match!');
      return false;
    }

    if(password.length < 8) {
      setError('Password must be at least 8 characters long.');
      console.log(password.length);
      return false;
    }
    
    if(!numberRegex.test(password)) {
      setError('Password must contain at least 1 digit!');
      return false;
    }

    return true;
  };


  const handleRegister = async () => {

    const isValid = validateForm();
    if(!isValid) return;

    try {
      await register(username, email, password, confirmPassword);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 1500);
    } catch(err) {
      console.log('Registration failed: ', err);
      setError('This username or email are already registered, try a different one!')
    }
  }

  return (
    <div className='h-full flex items-center justify-center'>
      <div className='border-1 border-black bg-[#f5f4f4] rounded-md shadow-lg w-1/4'>
        <div className='px-8 py-14'>
          <p className='text-gray-400 text-sm my-2'>Please enter your details.</p>
          <h1 className='text-black font-bold text-3xl'>Create account</h1>
        
          <div className='my-4'>
            <div className='flex gap-6'>
              <input type="text" className={`w-full py-3 px-4 border ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Username' id="username" onChange={(e) => setUsername(e.target.value)} autoComplete="off"/>
            </div>
            <input type="email" className={`w-full py-3 px-4 border ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Email address' id="email" onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" className={`w-full py-3 px-4 border  ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Password' id="password" onChange={(e) => setPassword(e.target.value)} autoComplete="off"/>
            <input type="password" className={`w-full py-3 px-4 border  ${error === null ? 'border-gray-300' :  'border-red-500'} rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all`} placeholder='Confirm password' id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="off"/>
            {error !== null ? <p className='text-red-500 text-sm my-2'>{error}</p> : null}
            {showMessage ? <p className='text-green-600 text-sm my-2'>You have been succesfully registered. Redirecting you to our home page.</p> : null}
          </div>

          <div className='my-2'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold w-full py-2 border border-blue-700 rounded transition-all' onClick={() => handleRegister()} >Sign up</button>
          
            <p className='my-4 text-gray-400 text-sm'>Already have an account? <a onClick={() => router.push('/login')} className='text-blue-500 hover:text-blue-700 underline hover:cursor-pointer transition-all'>Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register