/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, {useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios';
import { useAuth } from '@/app/context/AuthProvider';



const Login = () => {
  const {login, isAuthenticated} = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);



  const handleSignIn = async () => {

    setLoading(true);


    if(name === '' || password === '') {
      setError('You must fill in all the fields.');
      return false;
    }
    try {
      await login(name,password);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 1500);
      setLoading(false);
    } catch(err) {
      setError('Invalid username/email or password, try again!');
    }
  }

  return (
    <div className='h-full flex items-center justify-center px-10'>
      <div className='border-1 border-black bg-[#f5f4f4] rounded-md shadow-lg'>
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
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold w-full py-2 border border-blue-700 rounded transition-all' onClick={() => handleSignIn()} >Sign in</button>
          
            <p className='my-4 text-gray-400 text-sm'>Don&apos;t have an account? <a onClick={() => router.push('/register')} className='text-blue-500 hover:text-blue-700 underline hover:cursor-pointer transition-all'>Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login