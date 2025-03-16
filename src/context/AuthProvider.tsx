/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { AuthContextType, User, Profile } from '../types/types';

import { accountApi } from '../lib/utils';
import Cookies from "js-cookie";
import clearAllCookies from '../lib/clearCookies';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // stateovi
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // nextjs router za preusmjeravanje na druge pathove.
  const router = useRouter();

  // rendera se svaki put kad je isLoggedIn state promjenjen
  useEffect(() => {
    // spremam token i korisnika iz localstoragea u varijable 'token' i 'storedUser'
    const token = Cookies.get('token');
    const storedUser = Cookies.get('user');
    const feed = Cookies.get('feed');
    const role = Cookies.get('role');

    // ukoliko token i korisnik postoje ulazi u {} i izvršava se dalje
    if (token && storedUser && feed && role) {

      // spremam korisnikove podatke u varijablu 'userData'
      const userData: User = JSON.parse(storedUser);

      // postavljam korisnikove podatke (userData) u state 'user'
      setUser(userData);

      setRole(role)

      // postavljam svaki axios request da sadrži authorization bearer i token dobiven iz localStoragea
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // postavljam isLoggedIn state na true kako bi se znalo da je korisnik prijavljen
      setIsLoggedIn(true);

      Cookies.set("feed", `${feed}`);
    }

    // postavljam loading state na false nakon provjere
    setLoading(false); 
  }, [isLoggedIn, router]);
  

  const callRegister = async(username: string, email: string, password: string, confirmPassword: string) => {
    try {
      const res = await accountApi.register(username, email, password, confirmPassword);
      if(res?.data.user) {
        setUser(res.data.user);
        setRole('user');
      }
      if(res?.status !== 200 && res?.statusText) {
        setAuthError(res.statusText);
      }

      // preusmjeravam na home page
      router.push('/');

      // postavljam isLoggedIn state na true kako bi se znalo da je korisnik prijavljen
      setIsLoggedIn(true);

      router.refresh();
    } catch(err) {
      console.error(err);
    }
  }

  const callLogin = async(name: string, password: string) => {
    try {
      const res = await accountApi.login(name, password);
      
      if(res?.data.user) {
        setUser(res.data.user);
      }
      if(res?.status !== 200 && res?.statusText) {
        setAuthError(res.statusText);
      }
      
      // preusmjeravam na home page
      router.push('/');

      // mjenjam isLoggedIn state u true kako bi se znalo da je korisnik prijavljen
      setIsLoggedIn(true);

      router.refresh();
      
    } catch(err) {
      console.error(err);
    }
  }

  // funckija za odjavu korisnika
  const logout = () => {
    // kada se pozove briše se localStorage, user i profile state se postavlja na null, a isLoggedIn state na false kako bi se znalo da nema prijavljenog korisnika
    setUser(null);
    setProfile(null);
    setIsLoggedIn(false);
    clearAllCookies();
    router.push('/auth');
  }

  const deleteAccount = async () => {
    try {
      await accountApi.deleteAccount();
    } catch(err) {
      console.error(err);
    }
  }
  

  // varijable koje se mogu koristit u drugim fileovima
  // isAuthenticated provjerava postoji li korisnik tj je li prijavljen
  const isAuthenticated = !!user;
  // fullyRegistered provjerava jel prijavljen korisnik ima unešeno puno ime i prezime ili ne
  const fullyRegistered = user?.firstName !== null && user?.lastName !== null;

  const defaultPicture = user?.pictureUrl === 'https://snetblobstorage.blob.core.windows.net/snetprofiles/default.jpg';

  const [ignoreDefaultPic, setIgnoreDefaultPic] = useState(false);

  // ukoliko je trenutno stanje loading statea true vraća null
  if(loading) return null;

  // AuthContext.Provider prenosi unešene vrijednosti kako bi ih mogao koristiti u drugim fileovima
  return (
    <AuthContext.Provider value={{ user, role, callLogin, callRegister, logout, deleteAccount, isAuthenticated, fullyRegistered, defaultPicture, ignoreDefaultPic, setIgnoreDefaultPic, loading, authError}}>
      {children}
    </AuthContext.Provider>
  );
};

// preko useAuth mogu pristupiti funkcijama i varijablama iz AuthContext.Provider-a
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
