/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import { getCookieServer } from './getToken';
import {getCookie, setCookie} from 'cookies-next';
import { Auth } from '../types/types';
import { jwtDecode } from 'jwt-decode';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const API_BASE_URL = 'https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/';

// Kreiramo axios instancu s osnovnim URL-om i headerima
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const IS_SERVER = typeof window === 'undefined';

// Koristimo interceptors za dodavanje auth tokena u svaki zahtjev
api.interceptors.request.use(async(config) => {
    const token = IS_SERVER ? await getCookieServer("token") : getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// pomoćna funkcija za API pozive
const handleResponse = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const accountApi = {
  
  // async funkcija register koja služi za registriranje novih korisnika, prima username, email, lozinku i potvrdjenu lozinku
  register: async(username: string, email: string, password: string, confirmPassword: string) => {
    try {

      // šaljem axios post request na API, primam response tipa 'User', a prenosim username, email, lozinku i potvrdjenu lozinku
      const res = await axios.post<Auth>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/register', {username, email, password, confirmPassword});

      // spremam primljene podatke u varijablu newUser tipa User
      const newUser: Auth = res.data;

      // provjeravam sadrže li primljeni podatci token, id i username
      if(newUser.token && newUser.user.userId && newUser.user.username) {

        axios.defaults.headers.common['Authorization'] = `Bearer ${newUser.token}`;

        // spremam korisnika u localStorage
        setCookie('user', JSON.stringify(newUser.user));
        setCookie('feed', 'Popular');
        setCookie('role', 'user');
        setCookie("token", newUser.token, {path: "/"});

        return res;
      }
    } catch (error: any) {
      // ukoliko dođe do greške ispisuje se u konzoli
      if(error.response && error.response.data) {
        throw new Error(error.response.data.detail || 'Registration failed');
      }
      throw new Error("Invalid credentials");
    }
  },

  // async funkcija login koja služi za prijavljivanje korisnika, prima name(username/email) i lozinku
  login: async (name: string, password: string) => {
    try {

      // šaljem axios post request na API, primam response tipa 'User', a prenosim name(username/email) i lozinku
      const res = await axios.post<Auth>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/login', {
        name,
        password
      });

      // spremam primljene podatke u varijablu 'loggedUser' tipa 'User'
      const loggedUser: Auth = res.data;

      if(res) {
        // provjeravam sadrže li primljeni podatci token, id i username 
        if(loggedUser.token && loggedUser.user.userId && loggedUser.user.userId) {
  
          // spremam korisnika u localStorage
          setCookie('user', JSON.stringify(loggedUser.user));
          setCookie('feed', 'Popular');
  
          const role = accountApi.getRoleFromToken(loggedUser.token);
          
          if(role === null) {
            return;
          }
          setCookie('role', role);
          setCookie("token", loggedUser.token, {path: "/"});
        }
        return res;
      }

    } catch (error: any) {
      // ukoliko dođe do greške ispisuje se u konzoli
      throw error;
    }
  },

  // dobijamo role iz tokena
  getRoleFromToken: (token: string): "admin" | "user" | null => {
    try {
      const decoded: {role?: "admin" | "user"} = jwtDecode(token)
      return decoded.role ?? null;
    } catch(err) {
      console.error(err);
      return null;
    }
  },

  // async funkcija za brisanje računa
  deleteAccount: async () => {
    try {
      const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/account/delete-user`);
      document.cookie.replace(/(?<=^|;).+?(?=\=|;|$)/g, name => location.hostname.split('.').reverse().reduce(domain => (domain=domain.replace(/^\.?[^.]+/, ''),document.cookie=`${name}=;max-age=0;path=/;domain=${domain}`,domain), location.hostname));
      return res;
    } catch(err) {
       // ukoliko dođe do greške ispisuje se u konzoli
      console.error('Could not delete account. ' + err);
      throw new Error('Deleting account failed. ' + err);
    }
  },
}

// Comments API
export const commentsApi = {
  getComments: async (postId: string) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/comments/${postId}`)
      );
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },
  addComment: async (postId: string, content: string) => {
    try {
      return await handleResponse(() => 
        api.post(`/api/comments/add/${postId}`, {content: content})
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },
  
  addReply: async (commentId: string, content: string) => {
    try {
      return await handleResponse(() => 
        api.post(`/api/comments/add-reply/${commentId}`, content)
      );
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  },
  
  updateComment: async (commentId: string, content: string) => {
    try {
      return await handleResponse(() => 
        api.put(`/api/comments/update/${commentId}`, {content: content})
      );
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },
  
  deleteComment: async (commentId: string) => {
    try {
      return await handleResponse(() => 
        api.delete(`/api/comments/delete/${commentId}`)
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};

// Follows API
export const followsApi = {
  getFollowed: async (userId: string) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/follows/get-followed/${userId}`)
      );
    } catch (error) {
      console.error('Error getting followed users:', error);
      throw error;
    }
  },
  
  addFollow: async (userId: string) => {
    try {
      return await handleResponse(() => 
        api.post(`/api/follows/add-follow/${userId}`)
      );
    } catch (error) {
      console.error('Error adding follow:', error);
      throw error;
    }
  },
  
  unfollow: async (userId: string) => {
    try {
      return await handleResponse(() => 
        api.delete(`/api/follows/unfollow/${userId}`)
      );
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }
};

// Friends API
export const friendsApi = {
  getSentFriendRequests: async () => {
    try {
      return await handleResponse(() => 
        api.get('/api/friends/friend-requests/sent')
      );
    } catch (error) {
      console.error('Error getting sent friend requests:', error);
      throw error;
    }
  },
  
  getReceivedFriendRequests: async () => {
    try {
      return await handleResponse(() => 
        api.get('/api/friends/friend-requests/received')
      );
    } catch (error) {
      console.error('Error getting received friend requests:', error);
      throw error;
    }
  },
  
  sendFriendRequest: async (receiverUserId: string) => {
    try {
      return await handleResponse(() => 
        api.post(`/api/friends/friend-requests/send/${receiverUserId}`)
      );
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  },
  
  acceptFriendRequest: async (userId: string) => {
    try {
      return await handleResponse(() => 
        api.post(`/api/friends/friend-requests/accept/${userId}`)
      );
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  },
  
  declineFriendRequest: async (userId: string) => {
    try {
      return await handleResponse(() => 
        api.delete(`/api/friends/friend-requests/decline/${userId}`)
      );
    } catch (error) {
      console.error('Error declining friend request:', error);
      throw error;
    }
  },
  
  getFriends: async (userId: string) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/friends/${userId}`)
      );
    } catch (error) {
      console.error('Error getting friends:', error);
      throw error;
    }
  },
  
  deleteFriend: async (userId: string) => {
    try {
      return await handleResponse(() => 
        api.delete(`/api/friends/delete/${userId}`)
      );
    } catch (error) {
      console.error('Error deleting friend:', error);
      throw error;
    }
  }
};

// Posts API
export const postsApi = {
  getPopularFeed: async (page = 0) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/posts/popular-feed?page=${page}`)
      );
    } catch (error) {
      console.error('Error getting popular feed:', error);
      throw error;
    }
  },
  
  getYourFeed: async (page = 0) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/posts/your-feed?page=${page}`)
      );
    } catch (error) {
      console.error('Error getting your feed:', error);
      throw error;
    }
  },
  
  getPost: async (postId: string) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/posts/${postId}`)
      );
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  },
  
  getUserPosts: async (userId: string, page = 0) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/posts/user/${userId}?page=${page}`)
      );
    } catch (error) {
      console.error('Error getting user posts:', error);
      throw error;
    }
  },
  
  getUserPostsByUsername: async (username: string, page = 0) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/posts/username/${username}?page=${page}`)
      );
    } catch (error) {
      console.error('Error getting user posts by username:', error);
      throw error;
    }
  },
  
  addPost: async (formData: FormData) => {
    try {
      return await handleResponse(() => 
        api.post('/api/posts/add-post', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  },
  
  updatePost: async (postId: string, postData: {content: string, updatedFiles: string[]}) => {
    try {
      const processFiles = async () => {
        const filePromises = postData.updatedFiles.map(async (image, index) => {
          const response = await fetch(image);
          const blob = await response.blob();
          return new File([blob], `image${index}.jpg`, { type: blob.type });
        });
      
        // Wait for all files to be processed and then save to processedFiles
        const processedFiles = await Promise.all(filePromises);
      
        // Append each file to formData
        const formData = new FormData();
        processedFiles.forEach((file) => {
          formData.append("Files", file);
        });
          
        formData.append('Content', postData.content);
      
        return formData;
      };

      const formData = await processFiles();

      const res = await handleResponse(() => 
        api.put(`/api/posts/update-post/${postId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );

      return res;
    
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },
  
  deletePost: async (postId: string) => {
    try {
      return await handleResponse(() => 
        api.delete(`/api/posts/delete-post/${postId}`)
      );
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
};

// Profile API
export const profileApi = {
  getProfiles: async (limit = 100) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/profiles?limit=${limit}`)
      );
    } catch (error) {
      console.error('Error getting profiles:', error);
      throw error;
    }
  },
  
  searchProfiles: async (searchTerm: string, limit = 6) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/profiles/search?searchTerm=${searchTerm}&limit=${limit}`)
      );
    } catch (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
  },
  
  getPopularProfiles: async (limit = 10) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/profiles/popular?limit=${limit}`)
      );
    } catch (error) {
      console.error('Error getting popular profiles:', error);
      throw error;
    }
  },
  
  getFollowSuggestions: async (limit = 4) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/profiles/follow-suggestions?limit=${limit}`)
      );
    } catch (error) {
      console.error('Error getting follow suggestions:', error);
      throw error;
    }
  },
  
  getMutualFriends: async (userId: string, limit = 4) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/profiles/mutual/${userId}?limit=${limit}`)
      );
    } catch (error) {
      console.error('Error getting mutual friends:', error);
      throw error;
    }
  },
  
  getProfile: async (userId: string) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/profiles/${userId}`)
      );
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },
  
  getProfileByUsername: async (username: string) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/profiles/username/${username}`)
      );
    } catch (error) {
      console.error('Error getting profile by username:', error);
      throw error;
    }
  },
  
  getFriendshipStatus: async (userId: string) => {
    try {
      return await handleResponse(() => 
        api.get(`/api/profiles/friendship-status/${userId}`)
      );
    } catch (error) {
      console.error('Error getting friendship status:', error);
      throw error;
    }
  },
  
  updateProfile: async (username: string, firstName: string, lastName: string, description: string | null, occupation: string | null) => {
    try {
      return await handleResponse(() => 
        api.put('/api/profiles/update-profile', {username, firstName, lastName, description, occupation})
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  updateProfilePicture: async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      return await handleResponse(() => 
        api.put('/api/profiles/update-profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  },
  
  deleteProfilePicture: async () => {
    try {
      return await handleResponse(() => 
        api.delete('/api/profiles/delete-profile-picture')
      );
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      throw error;
    }
  }
};

// Reactions API
export const reactionsApi = {
  // Post reactions
  addPostReaction: async (postId: string, reaction = 0) => {
    try {
      return await handleResponse(() => 
        api.post(`/api/reactions/posts/add/${postId}?reaction=${reaction}`)
      );
    } catch (error) {
      console.error('Error adding post reaction:', error);
      throw error;
    }
  },
  
  updatePostReaction: async (postId: string) => {
    try {
      return await handleResponse(() => 
        api.put(`/api/reactions/posts/update/${postId}`)
      );
    } catch (error) {
      console.error('Error updating post reaction:', error);
      throw error;
    }
  },
  
  deletePostReaction: async (postId: string) => {
    try {
      return await handleResponse(() => 
        api.delete(`/api/reactions/posts/delete/${postId}`)
      );
    } catch (error) {
      console.error('Error deleting post reaction:', error);
      throw error;
    }
  },
  
  // Comment reactions
  addCommentReaction: async (commentId: string, reaction = 0) => {
    try {
      return await handleResponse(() => 
        api.post(`/api/reactions/comments/add/${commentId}?reaction=${reaction}`)
      );
    } catch (error) {
      console.error('Error adding comment reaction:', error);
      throw error;
    }
  },
  
  updateCommentReaction: async (commentId: string) => {
    try {
      return await handleResponse(() => 
        api.put(`/api/reactions/comments/update/${commentId}`)
      );
    } catch (error) {
      console.error('Error updating comment reaction:', error);
      throw error;
    }
  },
  
  deleteCommentReaction: async (commentId: string) => {
    try {
      return await handleResponse(() => 
        api.delete(`/api/reactions/comments/delete/${commentId}`)
      );
    } catch (error) {
      console.error('Error deleting comment reaction:', error);
      throw error;
    }
  }
};

export default {
  commentsApi,
  followsApi,
  friendsApi,
  postsApi,
  profileApi,
  reactionsApi
};