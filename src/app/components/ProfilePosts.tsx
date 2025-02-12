'use client';

import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/src/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Post, Profile, User } from '../types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import ResizableTextarea from './ResizableTextarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { CircleFadingPlus } from 'lucide-react';
import PostSkeleton from './PostSkeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import EachPost from './eachPost';

const ProfilePosts = ({pathUser}: {pathUser: Profile | undefined}) => {

    const [postPopoverOpen, setPostPopoverOpen] = useState(false);
    const [postDialogOpen, setPostDialogOpen] = useState(false);
    const [postsState, setPostsState] = useState<'Someones' | 'My profile'>('Someones');
    const [posts, setPosts] = useState<Post[]>([]);
    const [content, setContent] = useState('');
    const [postFile, setPostFile] = useState<File[]>([]);
    const [myProfile, setMyProfile] = useState(false);
    const [isRendering, setIsRendering] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [getComments, setGetComments] = useState(false);

    const user = localStorage.getItem('user');
    const queryClient = useQueryClient();
    const {toast} = useToast();

    useEffect(() => {
      if(user) {
        const userData: User = JSON.parse(user);
        if(userData.username === pathUser?.username) {
          setMyProfile(true);
          setPostsState('My profile');
        }
      }
    }, [pathUser?.username, user]);

    
    const getPosts = async (page: number) => {
      try {
        if(page === 0) {
          setPosts([]);
        }
        const res = await axios.get<Post[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/username/${pathUser?.username}?page=${page}`);
        if (res.status === 200) {
          if (page === 0) {
            if(res.data.length < 20) {
              setHasMore(false);
            }
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
        }
        return [];
      } catch (err) {
        console.error('Could not fetch posts', err);
      }
    }

    useEffect(() => {
      if (posts.length === 0 && currentPage >= 1) {
          setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
    }, [posts, currentPage]);

    const getPostsQuery = useQuery({queryKey: ["getPosts"], queryFn: () => getPosts(currentPage), enabled: pathUser !== undefined});

    useEffect(() => {
      if (getPostsQuery.data) {
        setPosts(getPostsQuery.data);
        const timeout = setTimeout(() => setIsRendering(false), 500);
        return () => clearTimeout(timeout);
      }
    }, [getPostsQuery.data]);

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
          queryClient.invalidateQueries({queryKey: [getPosts]});
          toast({description: "Post successfully posted!", duration: 1000});
        }
      } catch(err) {
          // ukoliko je došlo do greške, ispisuje se u konzoli
          console.error('Could not add post', err);
      }
    }
    const [showPostFiles, setShowPostFiles] = useState(false);
    const handlePostFile = (event: React.ChangeEvent<HTMLInputElement>) => {

      if (event.target.files && event.target.files.length > 0) {
        const filesArray = Array.from(event.target.files);
        // Use the spread operator to append new files without removing previous ones.
        setPostFile((prevFiles) => [...prevFiles, ...filesArray]);

      }        
    };

    useEffect(() => {
      if(postFile.length > 0) {
        setShowPostFiles(true);
      }
    }, [postFile])

    const fetchMoreData = () => {
      getPosts(currentPage + 1);
      setCurrentPage((prevPage) => prevPage + 1);  // Increment page
    };

    const handleFeedState = () => {
        return;
    }

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

    if(!pathUser) {
        return null;
    }

  return (
    <div className="border-1 border-gray-900 h-full flex flex-col items-center gap-4 w-full 2xl:py-12 py-0 overflow-y-hidden">
        <div className='flex flex-col md:hidden w-full justify-center'>
          {myProfile ? (
            <div className="flex items-center w-full flex-col">
              <div className="flex flex-col w-[85%] relative mt-6 py-2 px-4 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.3)] bg-[#363636] rounded-full">
                  <div className='w-full flex justify-between items-center gap-2' onClick={() => setPostDialogOpen(true)}>
                      <Avatar className='w-[32px] h-[32px] rounded-full'>
                          <AvatarImage src={`${pathUser.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 6px 6px 0px #00000040'}} />
                      </Avatar>
                      <div className="flex flex-col w-full">
                        <div className='flex justify-between items-center w-full'>
                            <textarea value={`What's on your mind, ${pathUser.firstName}`} readOnly onClick={() => setPostDialogOpen(true)} className="resize-none truncate whitespace-nowrap font-Roboto font-normal scrollbar-none h-[20px] md:min-w-[310px] w-full md:w-full pr-2 text-sm text-[#fff] outline-none rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
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
                                      <AvatarImage src={`${pathUser?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}}/>
                                  </Avatar>
                                  <div className='flex flex-col flex-grow gap-4'>  
                                    <ResizableTextarea onChange={(e) => setContent(e.target.value)} value={content} placeholder={`What's on your mind, ${pathUser?.firstName}`} className="font-Roboto font-normal leading-5 scrollbar-none w-full max-h-[100px] lg:max-h-[150px] text-sm lg:text-lg text-[#EFEFEF] outline-none rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
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
          ) : null}
          <h1 className='text-[#EDEDED] text-center font-Roboto text-3xl pt-8 sm:hidden'>{myProfile ? 'Your posts' : 'Their posts'}</h1>
          <div className='flex sm:hidden flex-col py-8'>
            {getPostsQuery.isFetching || isRendering ? <PostSkeleton /> : posts.length === 0 ? <h1 className='text-center text-[#AFAFAF]'>There are no posts yet!</h1> : (
              <InfiniteScroll className='w-full flex flex-col bg-transparent' dataLength={posts.length} next={fetchMoreData} hasMore={hasMore} loader={<h1>Loading...</h1>} endMessage={<h1 className='text-center text-white'>No more posts!</h1>}>
                  { posts.map((post, index) => (
                    <div key={index}>
                      <EachPost key={index} post={post} getComments={getComments} handleLike={handleLike} handleDislike={handleDislike} deletePost={deletePost} updatePost={updatePost} refreshPosts={() => handleFeedState}/>
                    </div>
                    )
                  )}
              </InfiniteScroll>
            )}
          </div>
        </div>
        {myProfile ? (
          <div className="md:flex hidden gap-2 items-center flex-col w-fit">
            <div className="flex gap-2 items-center flex-col max-w-full rounded-3xl bg-[#363636] shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.3)]">
                <div className="flex flex-col justify-between relative w-full min-h-fit items-center gap-4 pt-4 px-4">
                  <div className='w-full h-full flex gap-4 pb-2 '>
                      <Avatar className='w-[45px] h-[45px] lg:w-[60px] lg:h-[60px] rounded-full'>
                          <AvatarImage src={`${pathUser.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}}/>
                      </Avatar>
                      <div className='flex flex-col flex-grow gap-4'>  
                        <ResizableTextarea onChange={(e) => setContent(e.target.value)} value={content} placeholder={`What's on your mind, ${pathUser.firstName}`} className="font-Roboto font-normal leading-5 scrollbar-none w-[500px] max-h-[100px] lg:max-h-[150px] text-sm md:text-lg text-[#EFEFEF] outline-none rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
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
              <div className={`grid gap-2 ${postFile.length <= 2 ? "grid-cols-3" : ''} ${postFile.length >= 3 ? "grid-rows-2 grid-cols-3" : "grid-rows-1"}`} >
                {postFile.map((file, index) => (
                  <div key={index} className='w-full relative flex justify-center px-2'>
                    <Image key={index} src={URL.createObjectURL(file)} width={100} height={100} alt="a" className="py-2 opacity-80 rounded-xl h-[150px] w-full"/>
                    <button className="absolute text-white top-2 right-4" onClick={() => setPostFile(postFile.filter((_, postIndex) => postIndex != index))}>X</button>
                  </div>
                ))}
                <div className='w-full flex justify-center items-center'>
                  {postFile.length === 0 ? null : <label htmlFor="file-input-pc" className="hover:cursor-pointer text-[#646464] font-Roboto"><CircleFadingPlus className='text-[#646464] size-14' /></label>}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="h-full w-full sm:flex hidden flex-col items-center overflow-x-hidden">
          <div className={`flex gap-4 ${myProfile ? 'pt-6' : 'py-0'} items-center`}>
            <h1 className='text-[#EDEDED] font-Roboto text-3xl'>{myProfile ? 'Your posts' : 'Their posts'}</h1>
          </div>
          <div className='w-full lg:min-w-[832px] flex flex-col justify-center mt-6'>
              {getPostsQuery.isFetching || isRendering ? <PostSkeleton /> : posts.length === 0 ? <h1 className='text-center text-[#AFAFAF]'>There are no posts yet!</h1> : (
                  <InfiniteScroll className='w-full flex flex-col items-center bg-transparent px-8 sm:px-4 2k:min-w-[832px]' dataLength={posts.length} next={fetchMoreData} hasMore={hasMore} loader={<h1 className='text-white'>Loading...</h1>} endMessage={<h1 className='text-center text-white'>No more posts!</h1>}>
                      {posts.map((post, index) => (
                        <div key={index} className='max-w-[832px] w-full'>
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

export default ProfilePosts