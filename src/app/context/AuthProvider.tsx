/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';

import { error } from 'console';
import { AuthContextType, User, Profile, Auth } from '../types/types';

import {jwtDecode} from 'jwt-decode';
import jwt from 'jsonwebtoken';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // stateovi
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // nextjs router za preusmjeravanje na druge pathove.
  const router = useRouter();
  const path = usePathname();
  const {toast} = useToast();

  // rendera se svaki put kad je isLoggedIn state promjenjen
  useEffect(() => {
    // spremam token i korisnika iz localstoragea u varijable 'token' i 'storedUser' 
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const feed = localStorage.getItem('feed');

    // ukoliko token i korisnik postoje ulazi u {} i izvršava se dalje
    if (token && storedUser && feed) {

      // spremam korisnikove podatke u varijablu 'userData'
      const userData = JSON.parse(storedUser);

      // postavljam korisnikove podatke (userData) u state 'user'
      setUser(userData);

      // postavljam svaki axios request da sadrži authorization bearer i token dobiven iz localStoragea
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // postavljam isLoggedIn state na true kako bi se znalo da je korisnik prijavljen
      setIsLoggedIn(true);

      localStorage.setItem('feed', feed);
    }

    // postavljam loading state na false nakon provjere
    setLoading(false); 
  }, [isLoggedIn, router]);


  // async funkcija koja prima ime i prezime varijable, oba tipa string, nakon unošenja punog imena i prezimena na stranici.
  const addDetails = async (firstName: string, lastName: string, description: string, occupation: string) => {
    try {
      // // spremam token i korisnika iz localstoragea u varijable 'token' i 'storedUser' 
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const feed = localStorage.getItem('feed');
      const role = localStorage.getItem('role');
      // ukoliko token postoji ulazi u {} i izvršava se dalje
      if (user && token && feed && role) {
        // spremam korisnikove podatke u varijablu 'userData'
        const userData: User = JSON.parse(user);

        const capitalFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        const capitalLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

        // šaljem axios put request na API, primam nazad response tipa 'Profile', a prenosim username, firstName i lastName
        const res = await axios.put<User>(
          `https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/update-profile`,
          { username: userData.username, firstName: capitalFirstName, lastName: capitalLastName, description, occupation}
        );

        // provjeravam postoji li token, korisnikov id, ime i prezime
        if(res.status === 200) {

          // ukoliko sve postoji, spremam id, username, ime i prezime u varijablu updatedProfile tipa 'Profile'
          const updatedProfile: User = res.data;

          // brišem localStorage
          localStorage.clear();

          // spremam u localStorage korisnika sa svim novim podatcima
          localStorage.setItem('user', JSON.stringify(updatedProfile));

          // spremam u localStorage token tog korisnika
          localStorage.setItem('token', token);

          localStorage.setItem('feed', feed);
          localStorage.setItem('role', role);

          // spremam u 'user' state korisnika sa svim novim podatcima
          setUser(updatedProfile);
        } else {
          // ukoliko dođe do greške ispisuje se u konzoli
          console.error('Invalid response structrue');
        }
  
      }
    } catch (error) {
      // ukoliko dođe do greške ispisuje se u konzoli
      console.error('Updating user data failed:', error);
    }
  };

  const addImage = async (selectedImage: File) => {

    try {
      if(!selectedImage) {
        console.error('No image selected');
        return;
      }

      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const feed = localStorage.getItem('feed');
      const role = localStorage.getItem('role');

      if (user && token && feed && role) {
        // spremam korisnikove podatke u varijablu 'userData'
        const userData: User = JSON.parse(user);

        const formData = new FormData();
        formData.append('image', selectedImage);

        // šaljem axios put request na API, primam nazad response tipa 'Profile', a prenosim username, firstName i lastName
        const res = await axios.put<User>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/update-profile-picture', formData, {headers: {'Content-Type': 'multipart/form-data'}});

        if(res.status === 200) {
            // ukoliko sve postoji, spremam id, username, ime i prezime u varijablu updatedProfile tipa 'Profile'
            const updatedProfile: User = res.data;

            // brišem localStorage
            localStorage.clear();

            // spremam u localStorage korisnika sa svim novim podatcima
            localStorage.setItem('user', JSON.stringify(updatedProfile));

            // spremam u localStorage token tog korisnika
            localStorage.setItem('token', token);

            localStorage.setItem('feed', feed);

            localStorage.setItem('role', role);

            // spremam u 'user' state korisnika sa svim novim podatcima
            setUser(updatedProfile);
            toast({description: "Profile picture successfully updated!", duration: 1500});
        }
      }
    } catch(error) {
      console.error('Could not update image: ', error);
    }
  }
  interface DecodedTokenRole {
    role?: string;
  }

  const getRoleFromToken = (token: string): "admin" | "user" | null => {
    try {
      const decoded: {role?: "admin" | "user"} = jwtDecode(token)
      return decoded.role ?? null;
    } catch(err) {
      console.error(err);
      return null;
    }

  }
  

  // async funkcija register koja služi za registriranje novih korisnika, prima username, email, lozinku i potvrdjenu lozinku
  const register = async(username: string, email: string, password: string, confirmPassword: string) => {
    try {

      // šaljem axios post request na API, primam response tipa 'User', a prenosim username, email, lozinku i potvrdjenu lozinku
      const res = await axios.post<Auth>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/register', {username, email, password, confirmPassword});

      // spremam primljene podatke u varijablu newUser tipa User
      const newUser: Auth = res.data;

      if(res.status !== 200) {
        setAuthError(res.statusText);
      }

      // provjeravam sadrže li primljeni podatci token, id i username
      if(newUser.token && newUser.user.userId && newUser.user.username) {

        // ukoliko sadrže, spremam token u localStorage
        localStorage.setItem('token', newUser.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newUser.token}`;

        // postavljam state 'user' da sadrži primljene podatke tj korisnika
        setUser(newUser.user);

        // spremam korisnika u localStorage
        localStorage.setItem('user', JSON.stringify(newUser.user));

        localStorage.setItem('feed', 'Popular');
        localStorage.setItem('role', 'user');

        // postavljam isLoggedIn state na true kako bi se znalo da je korisnik prijavljen
        setIsLoggedIn(true);

        // preusmjeravam na home page
        router.push('/');
      }
    } catch (error: any) {
      // ukoliko dođe do greške ispisuje se u konzoli
      if(error.response && error.response.data) {
        throw new Error(error.response.data.detail || 'Registration failed');
      }
      throw new Error("Invalid credentials");
    }
  };

  // async funkcija login koja služi za prijavljivanje korisnika, prima name(username/email) i lozinku
  const login = async (name: string, password: string) => {
    try {

      // šaljem axios post request na API, primam response tipa 'User', a prenosim name(username/email) i lozinku
      const res = await axios.post<Auth>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/login', {
        name,
        password
      });

      if(res.status !== 200) {
        setAuthError(res.statusText);
      }

      // spremam primljene podatke u varijablu 'loggedUser' tipa 'User'
      const loggedUser: Auth = res.data;

      // provjeravam sadrže li primljeni podatci token, id i username 
      if(loggedUser.token && loggedUser.user.userId && loggedUser.user.userId) {

        // ukoliko je uneseni username jednak usernameu vraćenog korisnika ili unešeni email jednak emailu vraćenog korisnika, spremam token u localStorage
        localStorage.setItem('token', loggedUser.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${loggedUser.token}`;

        // spremam korisnika u state 'user'
        setUser(loggedUser.user);

        // spremam korisnika u localStorage
        localStorage.setItem('user', JSON.stringify(loggedUser.user));

        localStorage.setItem('feed', 'Popular');

        const role = getRoleFromToken(loggedUser.token);
        if(role === null) {
          return;
        }
        localStorage.setItem('role', role);


        // preusmjeravam na home page
        router.push('/');

        // mjenjam isLoggedIn state u true kako bi se znalo da je korisnik prijavljen
        setIsLoggedIn(true);
      }
    } catch (error: any) {
      // ukoliko dođe do greške ispisuje se u konzoli
      console.error("Login failed:", error);
      if(error.response && error.response.data) {
        throw new Error(error.response.data.detail || 'Login failed');
      }
      throw new Error("Invalid credentials");
    }
  };


  // funckija za odjavu korisnika
  const logout = () => {
    // kada se pozove briše se localStorage, user i profile state se postavlja na null, a isLoggedIn state na false kako bi se znalo da nema prijavljenog korisnika
    setUser(null);
    setProfile(null);
    setIsLoggedIn(false);
    localStorage.clear();

    // preusmjerava se na login page
    router.push('/auth');
  };

  // async funkcija za brisanje računa
  const deleteAccount = async () => {
    try {
      // sprema se prijavljeni korisnik u varijablu user iz localStorage-a
      const user = localStorage.getItem('user');
      
      if(user) {
        // ukoliko je korisnik prijavljen i spremljen, njegovi podatci se spremaju u varijablu 'userData'
        const userData: User = JSON.parse(user);

        // šalje se axios delete request na API sa korisnikovim id-jem 
        const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/delete-user`);

        // ukoliko je res.status jednak 200 znači da je korisnik obrisan i odjavljuje ga se, inače se u konzolu ispisuje poruka greške
        if(res.status === 200) {
          logout();
        } else {
          console.log('Cant delete user');
        }
      } else {
         // ukoliko dođe do greške ispisuje se u konzoli
        throw new Error('Could not fetch user');
      }
    
    } catch(err) {
       // ukoliko dođe do greške ispisuje se u konzoli
      console.error('Could not delete account. ' + err);
      throw new Error('Deleting account failed. ' + err);
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
    <AuthContext.Provider value={{ user, login, register, addDetails, addImage, logout, deleteAccount, isAuthenticated, fullyRegistered, defaultPicture, ignoreDefaultPic, setIgnoreDefaultPic, loading, authError}}>
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
