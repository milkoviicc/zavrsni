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

    const checkAuth = async () => {
      // Check if a user is logged in on initial load (from localStorage)
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const res = await axios.get<User>('/api/user', {
            headers:{ Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch(err) {
          localStorage.removeItem('token');
        }
      }

      setLoading(false);
    }
    
    checkAuth();
  }, []);

  useEffect(() => {
    if(!user) {
      router.push('/login');
    }
  }, [user, router]);


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
      const res = await axios.post<{token: string, user: User}>('/api/auth/register', {username, email, password, confirmPassword});

      const {token, user} = res.data;

      if(token && user) {
        localStorage.setItem('token', token);
        setUser(user);
        
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
      const res = await axios.post<{ token: string, user: User }>('/api/auth/login', {
        name,
        password
      });

      const { token, user } = res.data;


      if(token && user) {
        if(name === user.email || name === user.username) {
          localStorage.setItem('token', token);
          setUser(user);
          
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
