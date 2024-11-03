/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { AuthContextType, User, Profile } from '../types/types';
import { error } from 'console';




const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for token in local storage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    // If there's a token, set the user from local storage
    if (token && storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLoggedIn(true);
    }

    setLoading(false); // Set loading to false after the check
  }, [isLoggedIn ]);


  const addDetails = async (firstName: string, lastName: string) => {
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
  
      if (user) {
        const userData: User = JSON.parse(user);
        const res = await axios.put<Profile>(
          `https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/update-profile/${userData.profile.id}`, 
          { username: userData.username, firstName, lastName }
        );

        const {id, username, firstName: firstname, lastName: lastname} = res.data;


        if(token && userData.id && firstname && lastname) {
          const updatedProfile: Profile = {id, username, firstName, lastName};
          const updatedUser = {id: userData.id, username, email: userData.email, token: userData.token, profile: updatedProfile};
          localStorage.clear();

          localStorage.setItem('user', JSON.stringify(updatedUser));
          localStorage.setItem('token', userData.token);
          setUser(updatedUser);
        } else {
          throw new Error('Invalid response structrue');
        }
  
      }
    } catch (error) {
      console.error('Updating user data failed:', error);
      throw new Error('Could not update user data.');
    }
  };
  
  const register = async(username: string, email: string, password: string, confirmPassword: string) => {
    try {
      const res = await axios.post<User>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/register', {username, email, password, confirmPassword});

      const newUser: User = res.data;


      if(newUser.token && newUser.id && newUser.username && newUser.email) {
        localStorage.setItem('token', newUser.token);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));

        setIsLoggedIn(true);
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
      const res = await axios.post<User>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/login', {
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

          setIsLoggedIn(true);
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
    localStorage.clear();
    setUser(null);
    setProfile(null);
    setIsLoggedIn(false)
    router.push('/login');
  };

  const deleteAccount = async () => {

    try {
      const user = localStorage.getItem('user');

      if(user) {
        const userData: User = JSON.parse(user);

        const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/delete-user/${userData.id}`);

        if(res.status === 200) {
          logout();
        } else {
          console.log('Cant delete user');
        }
      } else {
        throw new Error('Could not fetch user');
      }
    
    } catch(err) {
      console.error('Could not delete account. ' + err);
      throw new Error('Deleting account failed. ' + err);
    }

  }

  const isAuthenticated = !!user;
  const fullyRegistered = user?.profile?.firstName !== null && user?.profile?.lastName !== null;

  if(loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, register, addDetails, logout, deleteAccount, isAuthenticated, fullyRegistered, loading }}>
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
