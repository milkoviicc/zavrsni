/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, {useState, useEffect} from 'react'
import ResizableTextarea from './ResizableTextarea'
import { FollowSuggestion, Friendship, FriendshipStatus, Post, Profile, User } from '../types/types'
import Image from 'next/image'
import EachPost from './eachPost'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserComponent from './userComponent';
import Suggestion from './suggestion';
import { filter } from 'lodash';

import {Popover, PopoverContent, PopoverTrigger} from "../../components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../../components/ui/command";
import {Button} from "../../components/ui/button";
import { Check, ChevronDown, ChevronsDown, ChevronsUpDown, ChevronUp, Circle} from 'lucide-react';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { profile } from 'console';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { CircleFadingPlus } from "lucide-react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PostSkeleton from './PostSkeleton';
import { useToast } from '@/hooks/use-toast';



const FullPosts = ({user, popularUsers}: {user: User, popularUsers: User[]}) => {

  const queryClient = useQueryClient();
  // stateovi

  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [reactionTrigger, setReactionTrigger] = useState(false);
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [postFile, setPostFile] = useState<File[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [randomNmbs, setRandomNmbs] = useState<number[]>();
  const [postsState, setPostsState] = useState('');
  const [postPopoverOpen, setPostPopoverOpen] = useState(false);
  const [suggestionsChecked, setSuggestionsChecked] = useState(false);
  const [fillSuggestions, setFillSuggestions] = useState<User[]>([]);
  const [postDialogOpen, setPostDialogOpen] = useState(false);  
  const [postsPage, setPostsPage] = useState(0);

  const feed = localStorage.getItem('feed');

  useEffect(() => {
    if(feed) {
      setPostsState(feed);
    }
  }, [feed])



  const popularFeedQuery = useQuery({queryKey: ["popularFeed"], queryFn: () => getPosts(postsPage), enabled: postsState === 'Popular'});
  const yourFeedQuery = useQuery({queryKey: ["yourFeed"], queryFn: () => getYourFeed(postsPage), enabled: postsState === 'Your Feed'});
  const getFollowedQuery = useQuery({queryKey: ["getFollowed"], queryFn: () => getFollowedUsers()});
  
  const getFollowedUsers = async () => {
    try {
        const res = await axios.get<string[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/follows/get-followed/${user.userId}`);
        return res.data; // Return the string[]
    } catch (error) {
        console.error("Error fetching followed users:", error);
        throw error; // Rethrow error so it can be handled by React Query
    }
};

  const getPosts = async (page: number) => {
    try {
      if(page === 0) {
        setPosts([]);
      }
      const res = await axios.get<Post[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/popular-feed?page=${page}`);
      if (res.status === 200) {
        if (page === 0) {
          setPosts(res.data);
          return res.data;
        } else {
          // Dodajem nove postove trenutnima i pazim da se ne bi postovi ponavljali
          setPosts((prevPosts) => {
            const newPosts = res.data.filter((newPost) => !prevPosts.some((existingPost) => existingPost.postId === newPost.postId));
            return [...prevPosts, ...newPosts];
          });
        }
        if (res.data.length === 0) {
          setHasMore(false);
        }
        setLoading(false);
      }
      setLoading(false);
    } catch (err) {
      console.error('Could not fetch posts', err);
    }
  };

  
  
  const getYourFeed = async (page: number) => {
    try {
      if(page === 0) {
        setPosts([]);
      }
      const res = await axios.get<Post[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/your-feed?page=${page}`);

      if (res.status === 200) {
        if (page === 0) {
          setPosts(res.data);
          return res.data;
        } else {
          setPosts((prevPosts) => {
            const newPosts = res.data.filter((newPost) => !prevPosts.some((existingPost) => existingPost.postId === newPost.postId));
            return [...prevPosts, ...newPosts];
          });
        }

        if (res.data.length === 0) {
          setHasMore(false);
        }
        setLoading(false);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };



const getFollowSuggestions = async () => {
  try {
    const res = await axios.get<User[]>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/profiles/follow-suggestions?limit=4');
  
    if(res.status === 200 && res.data.length < 4) {
      checkFollowSuggestions(res.data);
      return [];
    }
    return res.data;
  } catch(err) {
    console.error(err);
    return[];
  }
}



const suggestionsQuery = useQuery({queryKey: ["suggestions"], queryFn:getFollowSuggestions, enabled: getFollowedQuery.isSuccess});

const checkFollowSuggestions = async (existingSuggestions: User[]) => {
  if(suggestionsChecked) return;

  setSuggestionsChecked(true);
  const neededProfiles = 4 - existingSuggestions.length;

  const existingUsersIds = new Set(existingSuggestions.map(existingSuggestion => existingSuggestion.userId));

  const followedUserIds = new Set(getFollowedQuery.data);

  const filteredPopularUsers = popularUsers.filter(popularUser => !existingUsersIds.has(popularUser.userId) && !followedUserIds?.has(popularUser.userId) && popularUser.userId !== user.userId).slice(0, neededProfiles);


  const mergedUsers: User[] = [...existingSuggestions, ...filteredPopularUsers];

  setFillSuggestions(mergedUsers);
  queryClient.setQueryData(['suggestions'], mergedUsers);
}; 

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handlePostFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      
      // Use the spread operator to append new files without removing previous ones.
      setPostFile((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  
  // async funkcija koja se poziva kada se klikne na gumb 'Send'
  const sendPost = async () => {
    try {
      if(content !== '' || postFile.length !== 0) {
        setContent('');
        setPostFile([]);
        setPostDialogOpen(false);
      }

      const formData = new FormData();
      formData.append('Content', content);

      // If there are files, append them to FormData
      postFile.forEach((file) => {
        formData.append(`Files`, file);
      });
      

      // šalje se axios post request na API i prenosi se vrijednost content statea, tj. uneseni tekst posta
      const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/add-post`, formData, {headers: { 'Content-Type': 'multipart/form-data'}});

      // ukoliko je res.status jednak 200 novi post je dodan i vrijednost content statea se ponovno stavlja na empty string tj. ''
      if(res.status === 200) {
        const newPost: Post = res.data;
        setPosts((prev) => [newPost, ...prev]);
        queryClient.invalidateQueries({queryKey: [postsState === "Popular" ? "popularFeed" : "yourFeed"]});
        toast({description: "Post successfully posted!", duration: 1000});
      }
    } catch(err) {
        // ukoliko je došlo do greške, ispisuje se u konzoli
        console.error('Could not add post', err);
    }
  }
  
  const fetchMoreData = () => {
    if (postsState === 'Popular') {
      getPosts(currentPage + 1);
    } else if (postsState === 'Your Feed') {
      getYourFeed(currentPage + 1);
    }
    setCurrentPage((prevPage) => prevPage + 1);  // Increment page
  };

  
  // async funckija koja se poziva klikom na gumb 'delete'
  const deletePost = async (postId: string) => {
      try {
          // šaljem axios delete request na API sa id-em posta i spremam response u varijablu 'res'
          const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/delete-post/${postId}`);
          
          // ako je res.status jednak 200 znači da je post obrisan i onda mjenjam reactionTrigger state kako bi se postovi re-renderali na stranici.
          if (res.status === 200) {
              // Izbacujem obrisani post
              setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
          }
      } catch(err) {
          // ukoliko dođe do greške ispisat će se u konzoli
          console.error('Could not delete post: ', err);
      }
  }

  const handleFeedState = (feedState: string) => {
    const currentFeed = localStorage.getItem('feed');
    if(currentFeed === 'Popular' && feedState === 'Popular') {
      return;
    } else if (currentFeed === 'Popular' && feedState === 'Your Feed') {
      localStorage.setItem('feed', 'Your Feed');
      setCurrentPage(0);
      setPosts([]);
    } else if (currentFeed === 'Your Feed' && feedState === 'Popular') {
      localStorage.setItem('feed', 'Popular');
      setCurrentPage(0);
      setPosts([]);
    } else if (currentFeed === 'Your Feed' && feedState === 'Your Feed') {
      return;
    }
}

  useEffect(() => {
      if (posts.length === 0 && currentPage >= 1) {
          setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
  }, [posts, currentPage]);

  useEffect(() => {
    handleFeedState(postsState);
  }, [postsState])

  useEffect(() => {
    setContent('');
  }, [postDialogOpen]);

  // async funckija koja se poziva klikom na gumb 'Like' i prima postId
  const handleLike = async (postId: string) => {
      try {

          // pokušavam pronaći post koji je likean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u
          const post = posts.find((post) => post.postId === postId);

          // ukoliko se ne uspije pronaći post vraća se tj izlazi iz funkcije.
          if(!post) return;

          // ukoliko je trenutan post likean (1) briše se like axios delete requestom na API
          if(post.userReacted === 1) {
              post.userReacted = 0;
              await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/delete/${postId}`);
              return;
          }

          // ukoliko je trenutan post dislikean (-1) mjenja se iz dislike u like axios put requestom na API
          if(post.userReacted === -1) {
              post.userReacted = 1;
              await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/update/${postId}`);
              return;
          }

          // ukoliko trenutan post nije ni likean ni dislikean, šalje se axios post request na API sa query vrijednošću 1 kako bi se post likeao
          if (post.userReacted === 0) {
              post.userReacted = 1;
              await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/add/${postId}?reaction=1`);   
              return;
          }
          
      } catch(err) {
          // ukoliko dođe do greške ispisat će se u konzoli
          console.error(err);
      }
  }

  // async funckija koja se poziva klikom na gumb 'Dislike'
  const handleDislike = async (postId: string) => {
      try {

          // pokušavam pronaći post koji je dislikean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u
          const post = posts.find((post) => post.postId === postId);

          // ukoliko se ne uspije pronaći post vraća se tj izlazi iz funkcije.
          if(!post) return;

          // ukoliko je trenutan post likean (1) mjenja se iz likean u dislikean axios put requestom na API
          if(post.userReacted === 1) {
              post.userReacted = -1;
              await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/update/${postId}`);
              return;
          }

          // ukoliko je trenutan post dislikean (-1) briše se dislike axios delete requestom na API
          if(post.userReacted === -1) {
              post.userReacted = 0;
              await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/delete/${postId}`);
              return;
          }

           // ukoliko trenutan post nije ni likean ni dislikean, šalje se axios post request na API sa query vrijednošću -1 kako bi se post dislikeao
          if (post.userReacted === 0) {
              post.userReacted = -1;
              await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/add/${postId}?reaction=-1`);
              return;
          }

      } catch(err) {
          // ukoliko dođe do greške ispisat će se u konzoli
          console.error(err);
      }
  }

  const convertUrlsToFiles = async (urls: string[]): Promise<File[]> => {
    const filePromises = urls.map(async (url) => {
      // Fetch the file from the URL (which is a Blob URL)
      const response = await fetch(url, {method: 'GET', mode: 'cors'});
      const blob = await response.blob();
  
      // Optionally, you can define a name or use the original file name if available
      const fileName = "file" + Math.random();  // Replace with actual file name if you have it
  
      // Create a File object from the Blob
      const file = new File([blob], fileName, { type: blob.type });
      return file;
    });
  
    // Wait for all promises to resolve and return the array of File objects
    return await Promise.all(filePromises);
  };

  const updatePost = async (postId: string, updatedContent: string, updatedFiles: string[]) => {
      try {

          const processFiles = async () => {
            const filePromises = updatedFiles.map(async (image, index) => {
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
              
            formData.append('Content', updatedContent);
          
            return formData;
          };

          processFiles().then(async (formData) => {
            const res = await axios.put<Post>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/update-post/${postId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
          
            if(res.status === 200) {
              toast({description: "Post successfully updated!", duration: 1000});
            }
          });

          const updatedPost = posts.find((post) => post.postId === postId);

          if(!updatedPost) return null;

          updatedPost.content = updatedContent;
          updatedPost.fileUrls = updatedFiles;
      } catch(err) {
        console.error(err);
      }
  }
  
  useEffect(() => {

    const newRandomNmbs: number[] = [];
    for(let i = 10; i<= 100; i+=10) {
      const max: number = i;
      const min: number = i-9;
      let nmb = Math.floor(Math.random() * (max-min+1) + min);
      while(nmb === 0 || newRandomNmbs.includes(nmb)) {
        nmb = Math.floor(Math.random() * max);
      }

     newRandomNmbs.push(nmb);
    }
    
    setRandomNmbs(newRandomNmbs);
  }, []);

  const [getComments, setGetComments] = useState(false);
  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    if (popularFeedQuery.data) {
      const timeout = setTimeout(() => setIsRendering(false), 500);
      return () => clearTimeout(timeout);
    }
    if(yourFeedQuery.data) {
      const timeout = setTimeout(() => setIsRendering(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [popularFeedQuery.data, yourFeedQuery.data]);


  const {toast} = useToast();

  return (
    <div className="border-1 border-gray-900 h-full flex flex-col items-center gap-4 w-full 2xl:py-12 py-0">
        <div className='flex flex-col md:hidden text-white w-full justify-center'>
          <div className="flex items-center w-full flex-col">
            <div className='w-full sm:hidden flex items-center px-2 py-2'>
              <Popover open={postPopoverOpen} onOpenChange={setPostPopoverOpen}>
                <PopoverTrigger asChild className='bg-[#222222] text-[#AFAFAF] w-fit'>
                  <Button role="combobox" aria-expanded={postPopoverOpen} className="py-0 px-0 w-fit justify-start bg-[#222222] focus:bg-[#222222] text-[#AFAFAF] border-none shadow-none text-lg">{postsState} {!postPopoverOpen ? <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' /> : <ChevronUp className='ml-2 h-4 w-4 shrink-0 opacity-50'/>}</Button>
                </PopoverTrigger>
                <PopoverContent className='w-fit'>
                <Command>
                  <CommandList>
                    <CommandGroup className='bg-[#222222]'>
                      <CommandItem onSelect={(currentValue) => {
                          setPostsState(currentValue === 'Popular' ? 'Popular' : currentValue);
                          setPostPopoverOpen(false);
                          handleFeedState(currentValue);
                      }} className='text-[#AFAFAF] text-lg'>Popular</CommandItem>
                      <CommandItem onSelect={(currentValue) => {
                          setPostsState(currentValue === 'Your Feed' ? 'Your Feed' : currentValue);
                          setPostPopoverOpen(false);
                          handleFeedState(currentValue);
                      }} className=' text-[#AFAFAF] text-lg'>Your Feed</CommandItem>
                    </CommandGroup>
                  </CommandList>
                  </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col w-[85%] relative mt-6 py-2 px-4 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.3)] bg-[#363636] rounded-full">
                  <div className='w-full flex justify-between items-center gap-2' onClick={() => setPostDialogOpen(true)}>
                    <Avatar className='w-[32px] h-[32px] rounded-full'>
                        <AvatarImage src={`${user?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 6px 6px 0px #00000040'}} />
                    </Avatar>
                    <div className="flex flex-col w-full">
                      <div className='flex justify-between items-center w-full'>
                        <textarea value={`What's on your mind, ${user.firstName}`} readOnly onClick={() => setPostDialogOpen(true)} className="resize-none truncate whitespace-nowrap font-Roboto font-normal scrollbar-none h-[20px] md:min-w-[310px] w-full md:w-full pr-2 text-sm text-[#fff] outline-none rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
                        <input type="file" id="file-input" accept="image/*, video/*, .webp" className="hidden" onChange={handlePostFile} multiple/>
                        <div className="flex justify-between">
                          <div>
                            <label htmlFor="file-input" className="hover:cursor-pointer text-[#CCCCCC] font-Roboto"><FontAwesomeIcon icon={faImage} size="2x" /></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
                  <DialogContent className='top-[35%] rounded-3xl h-fit flex flex-col px-2 lg:px-4 text-black overflow-y-auto overflow-x-hidden bg-[#222222] max-w-[90%] lg:max-w-[45%] lg:min-w-fit border-transparent'>
                    <DialogHeader>
                      <DialogTitle className='text-[#EFEFEF] font-Roboto text-left px-1 font-normal'>Post something</DialogTitle>
                    </DialogHeader>
                      <div className="flex gap-2 items-center flex-col max-w-full rounded-3xl shadow-[1px_1px_2px_0px_rgba(0,_0,_0,_0.3)] bg-[#363636]">
                          <div className="flex flex-col justify-between relative w-full min-h-fit items-center gap-4 pt-4 px-4">
                              <div className='w-full h-full flex gap-4 pb-2'>
                                  <Avatar className='w-[45px] h-[45px] lg:w-[60px] lg:h-[60px] rounded-full'>
                                      <AvatarImage src={`${user.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}}/>
                                  </Avatar>
                                  <div className='flex flex-col flex-grow gap-4'>  
                                    <ResizableTextarea onChange={(e) => setContent(e.target.value)} value={content} placeholder={`What's on your mind, ${user.firstName}`} className="font-Roboto font-normal leading-5 scrollbar-none w-full max-h-[100px] lg:max-h-[150px] text-sm lg:text-lg text-[#EFEFEF] outline-none rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
                                    <div className='flex justify-end gap-4 items-center'>
                                        <div className='flex h-full justify-center items-center'>
                                          <input type="file" id="file-input" accept="image/*, video/*, .webp"  disabled className="hidden" onChange={handlePostFile} multiple/>
                                          <div className='flex w-full h-full items-center'>
                                            <label htmlFor="file-input" className="hover:cursor-pointer text-[#646464] font-Roboto"><FontAwesomeIcon icon={faImage} size="2x" className='pt-[3px]'/></label>
                                          </div>
                                        </div>
                                        <button onClick={() => sendPost()} className="rounded-full w-[100px] bg-[#5D5E5D] text-[#EFEFEF] py-[0.30rem] text-base font-Roboto">Post it</button>
                                    </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="flex w-full h-full sm:ml-4">
                        <div className={`grid gap-2 ${postFile.length <= 2 ? "grid-cols-3" : ''} ${postFile.length >= 3 ? "grid-rows-2 grid-cols-3" : "grid-rows-1"}`}>
                          {postFile ? postFile.map((file, index) => (
                            <div key={index} className='w-full relative flex justify-center sm:px-2'>
                              <Image key={index} src={URL.createObjectURL(file)} width={100} height={100} alt="a" className="py-2 opacity-80] rounded-xl h-[150px] w-full"/>
                              <button className="absolute text-white top-2 right-4" onClick={() => setPostFile(postFile.filter((_, postIndex) => postIndex != index))}>X</button>
                            </div>
                          )) : null}
                          <div className='w-full flex justify-center items-center'>
                            {postFile.length === 0 ? null : <label htmlFor="file-input" className="hover:cursor-pointer text-[#646464] font-Roboto"><CircleFadingPlus className='text-[#646464] size-14' /></label>}
                          </div>
                        </div>
                      </div>
                  </DialogContent>
              </Dialog>
          </div>
          <div className='flex sm:hidden flex-col py-8'>
            {popularFeedQuery.isFetching || yourFeedQuery.isFetching || isRendering ? <PostSkeleton /> : posts.length === 0 ? <h1 className='text-center text-[#AFAFAF]'>There are no posts yet!</h1> : (
              <InfiniteScroll className='w-full flex flex-col bg-transparent' dataLength={posts.length} next={fetchMoreData} hasMore={hasMore} loader={<h1>Loading...</h1>} endMessage={<h1 className='text-center text-white'>No more posts!</h1>} scrollThreshold={1}>
                  { posts.map((post, index) => (
                    <div key={index}>
                      {randomNmbs?.includes(index) && suggestionsQuery.data?.length !== 0 ? (
                        <div className='flex items-center flex-col my-4 py-2 border-t-[1px] border-t-[#515151]'>
                          <p className='text-[#8A8A8A] text-xs'>You might like these</p>
                          <div className='grid grid-cols-2 grid-rows-2 gap-2'>
                            {suggestionsQuery.data?.map((suggestion, index) => (
                              <Suggestion key={suggestion.userId} profileSuggestion={suggestion} handleRoute={null}/>
                            ))}
                            {suggestionsQuery.data?.length !== 4 ? 
                              fillSuggestions.map((suggestion, index) => (
                                <Suggestion key={suggestion.userId} profileSuggestion={suggestion} handleRoute={null}/>
                              )) : null
                            }
                          </div>
                        </div>
                      ) : randomNmbs?.includes(index) && suggestionsQuery.data?.length === 0 ? (
                        <div className='grid grid-cols-2 grid-rows-2 gap-4 border-t-[1px] border-[#515151]'>
                            {fillSuggestions.map((suggestion, index) => (
                                <Suggestion key={suggestion.userId} profileSuggestion={suggestion} handleRoute={null}/>
                              ))
                            }
                          </div>
                      ): null}
                      <EachPost key={index} post={post} getComments={getComments} handleLike={handleLike} handleDislike={handleDislike} deletePost={deletePost} updatePost={updatePost} refreshPosts={() => handleFeedState}/>
                    </div>
                    )
                  )}
              </InfiniteScroll>
            )}
          </div>
        </div>
        <div className="md:flex hidden gap-2 items-center flex-col w-fit">
          <div className="flex gap-2 items-center flex-col max-w-full rounded-3xl bg-[#363636] shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.3)]">
              <div className="flex flex-col justify-between relative w-full min-h-fit items-center gap-4 pt-4 px-4">
                  <div className='w-full h-full flex gap-4 pb-2 '>
                      <Avatar className='w-[45px] h-[45px] lg:w-[60px] lg:h-[60px] rounded-full'>
                          <AvatarImage src={`${user.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}}/>
                      </Avatar>
                      <div className='flex flex-col flex-grow gap-4'>  
                        <ResizableTextarea onChange={(e) => setContent(e.target.value)} value={content} placeholder={`What's on your mind, ${user.firstName}`} className="font-Roboto font-normal leading-5 scrollbar-none w-[500px] max-h-[100px] lg:max-h-[150px] text-sm md:text-lg text-[#EFEFEF] outline-none rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
                        <div className='flex justify-end gap-4 items-center'>
                            <div className='flex h-full justify-center items-center'>
                              <input type="file" id="file-input-pc" accept="image/*, video/*, .webp" className="hidden" onChange={handlePostFile} multiple/>
                              <div className='flex w-full h-full items-center'>
                                <label htmlFor="file-input-pc" className="hover:cursor-pointer text-[#646464] font-Roboto"><FontAwesomeIcon icon={faImage} size="2x" className='pt-[3px]'/></label>
                              </div>
                            </div>
                            <button onClick={() => sendPost()} className="rounded-full w-[100px] bg-[#5D5E5D] text-[#EFEFEF] py-[0.30rem] text-base font-Roboto">Post it</button>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="flex w-full h-full ml-4">
            <div className={`grid gap-2 ${postFile.length <= 2 ? "grid-cols-3" : ''} ${postFile.length >= 3 ? "grid-rows-2 grid-cols-3" : "grid-rows-1"}`}>
              {postFile ? postFile.map((file, index) => (
                <div key={index} className='w-full relative flex justify-center px-2'>
                  <Image key={index} src={URL.createObjectURL(file)} width={100} height={100} alt="a" className="py-2 opacity-80 rounded-xl h-[150px] w-full"/>
                  <button className="absolute text-white top-2 right-4" onClick={() => setPostFile(postFile.filter((_, postIndex) => postIndex != index))}>X</button>
                </div>
              )) : null}
              <div className='w-full flex justify-center items-center'>
                {postFile.length === 0 ? null : <label htmlFor="file-input-pc" className="hover:cursor-pointer text-[#646464] font-Roboto"><CircleFadingPlus className='text-[#646464] size-14' /></label>}
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-full sm:flex hidden flex-col items-center">
            <div className="flex gap-4 py-6 items-center">
              <div>
                  <button className={`text-2xl text-[#8A8A8A] ${postsState === "Popular" ? ' text-[#EFEFEF]' : null}`} onClick={() => setPostsState('Popular')}>Popular</button>
                  <span className={`${postsState === 'Popular' ? 'block bg-[#EFEFEF]' : 'hidden'} w-full h-[2px]`}></span>
              </div>
              <span className="h-10 block border-black bg-[#8A8A8A] w-[1px]"></span>
              <div>
                  <button className={`text-2xl text-[#8A8A8A] ${postsState === "Your Feed" ? 'text-[#EFEFEF]' : null}`} onClick={() => setPostsState('Your Feed')}>Your Feed</button>
                  <span className={`${postsState === 'Your Feed' ? 'block bg-[#EFEFEF]' : 'hidden'} w-full h-[1px]`}></span>
              </div>
            
            </div>
            <div className='w-full lg:min-w-[832px] flex flex-col justify-center items-center mt-10'>
                {popularFeedQuery.isFetching || yourFeedQuery.isFetching || isRendering ? <PostSkeleton /> : posts.length === 0 ? <h1 className='text-center text-[#AFAFAF]'>There are no posts yet!</h1> : (
                    <InfiniteScroll className='w-full flex flex-col bg-transparent px-8 sm:px-4 2k:min-w-[832px]' dataLength={posts.length} next={fetchMoreData} hasMore={hasMore} loader={<h1>Loading...</h1>} endMessage={<h1 className='text-center text-white'>No more posts!</h1>} scrollThreshold={1}>
                        {posts.map((post, index) => (
                          <div key={index}>
                            {randomNmbs?.includes(index) && suggestionsQuery.data?.length !== 0 ? (
                              <div className='flex items-center flex-col my-4 py-2 border-t-[1px] border-[#515151]'>
                                <p className='text-[#8A8A8A]'>You might like these</p>
                                <div className='min-w-[90%] grid grid-cols-2 grid-rows-2 gap-4'>
                                  {suggestionsQuery.isSuccess ? suggestionsQuery.data?.map((suggestion, index) => (
                                    <Suggestion key={suggestion.userId} profileSuggestion={suggestion} handleRoute={null}/>
                                  )) : null}
                                  {suggestionsQuery.data?.length !== 4 ? 
                                    fillSuggestions.map((suggestion, index) => (
                                      <Suggestion key={suggestion.userId} profileSuggestion={suggestion} handleRoute={null}/>
                                    )) : null
                                  }
                                </div>
                              </div>
                            ) : randomNmbs?.includes(index) && suggestionsQuery.data?.length === 0 ? (
                              <div className='border-t-[1px] border-[#515151]'>
                                <p className='text-[#8A8A8A] text-center font-Roboto py-2'>You might like these</p>
                                <div className='grid grid-cols-2 grid-rows-2 gap-4 place-items-center'>
                                  {fillSuggestions.map((suggestion, index) => (
                                      <Suggestion key={suggestion.userId} profileSuggestion={suggestion} handleRoute={null}/>
                                    ))
                                  }
                                </div>
                              </div>
                            ): null}
                            <EachPost key={index} post={post} getComments={getComments} handleLike={handleLike} handleDislike={handleDislike} deletePost={deletePost} updatePost={updatePost} refreshPosts={() => handleFeedState}/>
                          </div>
                          )
                        )}
                    </InfiniteScroll>
                )}
            </div>
        </div>
    </div>
  )
}

export default FullPosts;