'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { AuthContextType, User } from '../types/types';



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if a user is logged in on initial load (e.g., from localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user info from the token or API if needed
      axios.get<User>('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        setUser(response.data);
      }).catch(() => {
        // Token is invalid, remove it
        localStorage.removeItem('token');
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post<{ token: string, user: User }>('/api/auth/login', {
        username,
        password
      });

      const { token, user } = response.data;
      
      // Store token in localStorage and update user state
      localStorage.setItem('token', token);
      setUser(user);

      // Redirect to a protected page (e.g., dashboard)
      router.push('/');
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

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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
