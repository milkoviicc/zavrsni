/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';

import { AuthContextType, User, Profile } from '../types/types';
import { error } from 'console';

import {jwtDecode} from 'jwt-decode';
import jwt from 'jsonwebtoken';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // stateovi
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // nextjs router za preusmjeravanje na druge pathove.
  const router = useRouter();
  const path = usePathname();

  // rendera se svaki put kad je isLoggedIn state promjenjen
  useEffect(() => {
    // spremam token i korisnika iz localstoragea u varijable 'token' i 'storedUser' 
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');


    // ukoliko token i korisnik postoje ulazi u {} i izvršava se dalje
    if (token && storedUser) {

      if(isTokenExpired(token)) {
        localStorage.removeItem('token');
        router.push('/auth');
      }

      // spremam korisnikove podatke u varijablu 'userData'
      const userData = JSON.parse(storedUser);

      // postavljam korisnikove podatke (userData) u state 'user'
      setUser(userData);

      // postavljam svaki axios request da sadrži authorization bearer i token dobiven iz localStoragea
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // postavljam isLoggedIn state na true kako bi se znalo da je korisnik prijavljen
      setIsLoggedIn(true);
    }

    // postavljam loading state na false nakon provjere
    setLoading(false); 
  }, [isLoggedIn, router]);


  const isTokenExpired = (token: string) => {
    if (!token) return true;
  
    try {
      const decodedToken = jwtDecode<{ exp?: number }>(token); // TypeScript type with optional `exp`
      const currentTime = Date.now() / 1000;

      // Check if `exp` exists and compare; if not, treat it as expired
      if (decodedToken.exp === undefined) {
        return true;
      }

      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token: ', error);
      return true;
    }
  };


  // async funkcija koja prima ime i prezime varijable, oba tipa string, nakon unošenja punog imena i prezimena na stranici.
  const addDetails = async (firstName: string, lastName: string) => {
    try {

      // // spremam token i korisnika iz localstoragea u varijable 'token' i 'storedUser' 
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
  
      // ukoliko token postoji ulazi u {} i izvršava se dalje
      if (user) {
        // spremam korisnikove podatke u varijablu 'userData'
        const userData: User = JSON.parse(user);

        // šaljem axios put request na API, primam nazad response tipa 'Profile', a prenosim username, firstName i lastName
        const res = await axios.put<Profile>(
          `https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/update-profile`, 
          { username: userData.username, firstName, lastName }
        );

        // spremam podatke vraćene nakon put requesta
        const {id, username, firstName: firstname, lastName: lastname} = res.data;

        // provjeravam postoji li token, korisnikov id, ime i prezime
        if(token && userData.id && firstname && lastname) {

          // ukoliko sve postoji, spremam id, username, ime i prezime u varijablu updatedProfile tipa 'Profile'
          const updatedProfile: Profile = res.data;

          // u varijablu updatedUser spremam id prijavljenog korisnika, njegov email, token i nove profile podatke
          const updatedUser = {id, username, email: userData.email, token: userData.token, profile: updatedProfile};

          // brišem localStorage
          localStorage.clear();

          // spremam u localStorage korisnika sa svim novim podatcima
          localStorage.setItem('user', JSON.stringify(updatedUser));

          // spremam u localStorage token tog korisnika
          localStorage.setItem('token', userData.token);

          // spremam u 'user' state korisnika sa svim novim podatcima
          setUser(updatedUser);
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

      if (user) {
        // spremam korisnikove podatke u varijablu 'userData'
        const userData: User = JSON.parse(user);

        const formData = new FormData();
        formData.append('image', selectedImage);

        // šaljem axios put request na API, primam nazad response tipa 'Profile', a prenosim username, firstName i lastName
        const res = await axios.put<Profile>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/update-profile-picture', formData, {headers: {
          'Content-Type': 'multipart/form-data'}});

        // provjeravam postoji li token, korisnikov id, ime i prezime
        if(token && userData.id) {

          // ukoliko sve postoji, spremam id, username, ime i prezime u varijablu updatedProfile tipa 'Profile'
          const updatedProfile: Profile = res.data;

          // u varijablu updatedUser spremam id prijavljenog korisnika, njegov email, token i nove profile podatke
          const updatedUser: User = {id: userData.id, username: userData.username, email: userData.email, token, profile: updatedProfile};

          // brišem localStorage
          localStorage.clear();

          // spremam u localStorage korisnika sa svim novim podatcima
          localStorage.setItem('user', JSON.stringify(updatedUser));

          // spremam u localStorage token tog korisnika
          localStorage.setItem('token', userData.token);

          // spremam u 'user' state korisnika sa svim novim podatcima
          setUser(updatedUser);

          if(path != '/') {
            window.location.reload();
          }
        }
      }
    } catch(error) {
      console.error('Could not update image: ', error);
    }
  }
  

  // async funkcija register koja služi za registriranje novih korisnika, prima username, email, lozinku i potvrdjenu lozinku
  const register = async(username: string, email: string, password: string, confirmPassword: string) => {
    try {

      // šaljem axios post request na API, primam response tipa 'User', a prenosim username, email, lozinku i potvrdjenu lozinku
      const res = await axios.post<User>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/register', {username, email, password, confirmPassword});

      // spremam primljene podatke u varijablu newUser tipa User
      const newUser: User = res.data;

      // provjeravam sadrže li primljeni podatci token, id, username i email
      if(newUser.token && newUser.id && newUser.username && newUser.email) {

        // ukoliko sadrže, spremam token u localStorage
        localStorage.setItem('token', newUser.token);

        // postavljam state 'user' da sadrži primljene podatke tj korisnika
        setUser(newUser);

        // spremam korisnika u localStorage
        localStorage.setItem('user', JSON.stringify(newUser));

        // postavljam isLoggedIn state na true kako bi se znalo da je korisnik prijavljen
        setIsLoggedIn(true);

        // preusmjeravam na home page
        router.push('/');
      } else {
        // ukoliko dođe do greške ispisuje se u konzoli
        console.error('Invalid response structure');
      }
      
    } catch(error) {
      // ukoliko dođe do greške ispisuje se u konzoli
      console.error('Registration failed', error);
    }
  };

  // async funkcija login koja služi za prijavljivanje korisnika, prima name(username/email) i lozinku
  const login = async (name: string, password: string) => {
    try {

      // šaljem axios post request na API, primam response tipa 'User', a prenosim name(username/email) i lozinku
      const res = await axios.post<User>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/login', {
        name,
        password
      });

      // spremam primljene podatke u varijablu 'loggedUser' tipa 'User'
      const loggedUser: User = res.data;

      // provjeravam sadrže li primljeni podatci token, id, username i email
      if(loggedUser.token && loggedUser.id && loggedUser.username && loggedUser.email) {
        if(name === loggedUser.username || name === loggedUser.email) {

          // ukoliko je uneseni username jednak usernameu vraćenog korisnika ili unešeni email jednak emailu vraćenog korisnika, spremam token u localStorage
          localStorage.setItem('token', loggedUser.token);


          // spremam korisnika u state 'user'
          setUser(loggedUser);

          // spremam korisnika u localStorage
          localStorage.setItem('user', JSON.stringify(loggedUser));

          // mjenjam isLoggedIn state u true kako bi se znalo da je korisnik prijavljen
          setIsLoggedIn(true);

          // preusmjeravam na home page
          router.push('/');
        } else {
          // ukoliko dođe do greške ispisuje se u konzoli
          throw new Error(`This username/email doesn't exist.`);
        }
      } else {
        // ukoliko dođe do greške ispisuje se u konzoli
        throw new Error('Invalid response structure');
      }
      
    } catch (error) {
      // ukoliko dođe do greške ispisuje se u konzoli
      console.error("Login failed:", error);
      throw new Error("Invalid credentials");
    }
  };


  // funckija za odjavu korisnika
  const logout = () => {
    // kada se pozove briše se localStorage, user i profile state se postavlja na null, a isLoggedIn state na false kako bi se znalo da nema prijavljenog korisnika
    localStorage.clear();
    setUser(null);
    setProfile(null);
    setIsLoggedIn(false);

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
        const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/delete-user/${userData.id}`);

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
  const fullyRegistered = user?.profile?.firstName !== null && user?.profile?.lastName !== null;

  const defaultPicture = user?.profile?.pictureUrl === 'https://snetblobstorage.blob.core.windows.net/snetprofiles/default.jpg';

  // ukoliko je trenutno stanje loading statea true vraća null
  if(loading) return null;

  // AuthContext.Provider prenosi unešene vrijednosti kako bi ih mogao koristiti u drugim fileovima
  return (
    <AuthContext.Provider value={{ user, login, register, addDetails, addImage, logout, deleteAccount, isAuthenticated, fullyRegistered, defaultPicture, loading }}>
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
