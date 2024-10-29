/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, {useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios';
import { useAuth } from '@/app/context/AuthProvider';



const Login = () => {
  const {login} = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showMessage, setShowMessage] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const handleSignIn = async () => {
    try {
      await login(email,password);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } catch(err) {
      setError('Invalid email or password');
    }
  }

  if(showMessage) return <h1>You have been succesfully logged in.</h1>


  return (
    <div className='h-full flex items-center justify-center'>
      <div className='border-1 border-black bg-[#f5f4f4] rounded-md'>
        <div className='px-8 py-14'>
          <p className='text-gray-400 text-sm my-2'>Please enter your details.</p>
          <h1 className='text-black font-bold text-3xl'>Welcome back</h1>
        
          <div className='my-8'>
            <input type="text" className='w-full py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all' placeholder='Email address' id="email" onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" className='w-full py-3 px-4 border border-gray-300 rounded-md text-sm my-2 outline-none focus:border-blue-400 transition-all' placeholder='Password' id="password" onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className='my-8'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold w-full py-2 border border-blue-700 rounded transition-all' onClick={() => handleSignIn()} >Sign in</button>
          
            <p className='my-4 text-gray-400 text-sm'>Don&apos;t have an account? <a onClick={() => router.push('/register')} className='text-blue-500 underline hover:cursor-pointer'>Sign up?</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login