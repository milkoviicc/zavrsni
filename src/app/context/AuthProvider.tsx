/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { AuthContextType, User, Profile } from '../types/types';



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token in local storage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    // If there's a token, set the user from local storage
    if (token && storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }

    setLoading(false); // Set loading to false after the check
  }, []);


  const addDetails = async(firstname: string, lastname: string) => {
    try {
      const token = localStorage.getItem('token');
      if(token) {
        const res = await axios.put<Profile>('/api/user', 
          {firstname: firstname, lastname: lastname}
        );

        setProfile(res.data);
      }
      
    } catch(error) {
      console.error('Updating user data failed:', error);
      throw new Error('Could not update user data.');
    }
  }

  const register = async(username: string, email: string, password: string, confirmPassword: string) => {
    try {
      const res = await axios.post<{id: string, username: string, email: string, token: string, profile: {firstName: string | null, lastName: string | null}}>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/register', {username, email, password, confirmPassword});

      const {id, username: userName, email: userEmail, token, profile} = res.data;

      console.log(res.data);

      if(token && id && userName && userEmail) {
        localStorage.setItem('token', token);

        setUser({id, username: userName, email:userEmail, token, profile});
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/');
      } else {
        throw new Error('Invalid response structure');
      }
      
    } catch(error) {
      console.error('Registration failed', error);
      throw new Error('Invalid credentials!');
    }
  };

  const login = async (name: string, password: string) => {
    try {
      const res = await axios.post<{id: string, username: string, email: string, token: string, profile: {firstName: string | null, lastName: string | null}}>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/login', {
        name,
        password
      });

      const {id, username: userName, email: userEmail, token, profile} = res.data;


      if(token && id && userName && userEmail) {
        if(name === userName || name === userEmail) {
          const newUser = {id, username: userName, email:userEmail, token, profile};
          localStorage.setItem('token', token);
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          
          router.push('/');
        } else {
          throw new Error(`This username/email doesn't exist.`);
        }
      } else {
        throw new Error('Invalid response structure');
      }
      
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    // Clear token and user data on logout
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = !!user;
  const fullyRegistered = user?.profile.firstName !== null && user?.profile.lastName !== null;

  if(loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, register, addDetails, logout, isAuthenticated, fullyRegistered, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
