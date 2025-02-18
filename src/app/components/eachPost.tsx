/* eslint-disable no-var */
'use client';
import React, {useState, useEffect, useRef} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpLong, faDownLong, faPen, faTrash, faArrowUp, faPaperclip, faN, faImage } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Comment, Post, User } from '../types/types';
import PostComment from './PostComment';
import EachComment from './eachComment';

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/src/components/ui/dialog';
import { ScrollArea } from "@/src/components/ui/scroll-area"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ResizableTextarea from './ResizableTextarea';
import _ from 'lodash';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/src/components/ui/command';
import { CircleFadingPlus, Ellipsis, EllipsisIcon, Pencil, Settings, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EachPost = ({post, getComments, handleLike, handleDislike, deletePost, updatePost, refreshPosts}: {post: Post, getComments: boolean, handleLike: (postId: string) => void, handleDislike: (postId: string) => void, deletePost: (postId: string) => void, updatePost: (postId: string, updatedContent: string, updatedFiles: string[]) => void, refreshPosts: () => void})=> {
  
  // DATUM POSTA

  // spremam preneseni datum u varijable
  const timestamp = post.createdOn;
  // pretvaram datum u Date objekt
  const fullDate = new Date(timestamp);

  fullDate.setUTCHours(fullDate.getUTCHours());

  const justDate = fullDate.toLocaleString('en-us', {year: 'numeric', month: 'short', day:'numeric'});
  
  // dobivam trenutan datum i vrijeme
  const currentDate = new Date();

  // računam razliku između trenutnog i prenesenog vremena u ms
  const differenceMs = currentDate.getTime() - fullDate.getTime();

  // pretvaram milisekunde u sekunde
  const totalSeconds = Math.floor(differenceMs / 1000);

  // računam dane, sate, minute i sekunde
  const days = Math.floor(totalSeconds / 86400); // 86400 seconds in a day
  const hours = Math.floor((totalSeconds % 86400) / 3600); // Remaining seconds converted to hours
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining seconds converted to minutes
  const seconds = totalSeconds % 60; // Remaining seconds after full minutes  


  // state za prikazivanje Delete i Update gumbova
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPortrait, setIsPortrait] = useState(false);
  const [updatedContent, setUpdatedContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [updatedFiles, setUpdatedFiles] = useState<File[]>([]);
  const [previousFiles, setPreviousFiles] = useState<string[]>([]);
  const [postReaction, setPostReaction] = useState<number>(post.userReacted);
  const [postLikes, setPostLikes] = useState(post.likes);
  const [postDislikes, setPostDislikes] = useState(post.dislikes);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reactionTrigger, setReactionTrigger] = useState(false);
  const [finishedUpdating, setFinishedUpdating] = useState(false);
  const [isUpdatePostDialogOpen, setIsUpdatePostDialogOpen] = useState(false);
  const {toast} = useToast();

  const role = localStorage.getItem('role');

  // dobivam usera iz localStorage-a

  const router = useRouter();
    
  useEffect(() => {
    refreshPosts();
  }, [post.userReacted]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setIsPortrait(naturalHeight > naturalWidth);
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
      
      // Use URL.createObjectURL to generate a URL for each file and add it to the state
      filesArray.forEach((file) => {
        const fileUrl = URL.createObjectURL(file);
  
        // Add the file URL to the previous files state
        setPreviousFiles((prevFiles) => [...prevFiles, fileUrl]);
      });
    }
  };

  const updateComment = async (commentId: string, newContent: string) => {
    try {
      const res = await axios.put(
      `https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/comments/update/${commentId}`,
      { content: newContent }, 
    );
      const updatedComment = comments.find((comment) => comment.commentId === commentId);
      if(!updatedComment) return null;

      updatedComment.content = newContent;
      
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const user = localStorage.getItem('user');
    // svaki put kad se korisnik dobije iz localstoragea i post.userProfile.id promjeni, re-rendera se sve.

    // ako korisnik postoji ulazi u {}, ako ne ništa se ne dešava
    if(user) {
    
      // spremam podatke korisnika iz localstoragea u varijablu userData za daljnje provjere. 
      const userData: User = JSON.parse(user);

      // ako je id korisnika koji je objavio post jednak trenutnom korisniku state se stavlja na true kako bi se gumb 'Delete' prikazao, inače na false kako se ne bi prikazao
      if(post.user.userId === userData.userId || role === "admin") {
        setShowDelete(true);
        setShowUpdate(true);
      } else {
        setShowDelete(false);
        setShowUpdate(false);
      }
    }
  }, [post.user.userId, post]);  

  const getCommentsQuery = useQuery({queryKey: ["commentsQuery"], queryFn: () => handleComments(), enabled: getComments && !comments});

  const handleComments = async () => {
    try {
      const res = await axios.get<Comment[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/comments/${post.postId}`);

      if(res.status === 200) {
        setComments(res.data);
        return res.data;
      }

    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };


  const handleUpdate = async () => {
    setUpdatedContent(post.content);

    if (post.fileUrls && Array.isArray(post.fileUrls)) {
      setPreviousFiles(post.fileUrls);
    } else {
      setPreviousFiles([]);
    }
  }

  const update = async () => {
    updatePost(post.postId, updatedContent, previousFiles);
    setIsUpdatePostDialogOpen(false);
  }


const [tajmout, setTajmout] = useState<number | NodeJS.Timeout>();

const handleReaction = async (reaction: number) => {
  clearTimeout(tajmout);
  setTajmout(undefined);
  try {
    // Handle reactions based on current state
    if (postReaction === 1 && reaction === 1) {
      // Undo a like
      setPostReaction(0);
      setPostLikes((prev) => prev - 1);
      setTajmout(setTimeout(async () => {
        await handleLike(post.postId);
      }, 500));
    } else if (postReaction === 0 && reaction === 1) {
      // Add a like
      setPostReaction(1);
      setPostLikes((prev) => prev + 1);
      setTajmout(setTimeout(async () => {
        await handleLike(post.postId); // Backend call
      }, 500));
    } else if (postReaction === 1 && reaction === -1) {
      // Switch from like to dislike
      setPostReaction(-1)
      setPostLikes((prev) => prev - 1);
      setPostDislikes((prev) => prev + 1);
      setTajmout(setTimeout(async () => {
        await handleDislike(post.postId); // Backend call
      }, 500));
    } else if (postReaction === 0 && reaction === -1) {
      // Add a dislike
      setPostReaction(-1);
      setPostDislikes((prev) => prev + 1);
      setTajmout(setTimeout(async () => {
        await handleDislike(post.postId); // Backend call
      }, 500));
    } else if (postReaction === -1 && reaction === -1) {
      // Undo a dislike
      setPostReaction(0);
      setPostDislikes((prev) => prev - 1);
      setTajmout(setTimeout(async () => {
        await handleDislike(post.postId); // Backend call
      }, 500));
    } else if (postReaction === -1 && reaction === 1) {
      // Switch from dislike to like
      setPostReaction(1);
      setPostLikes((prev) => prev + 1);
      setPostDislikes((prev) => prev - 1);
      setTajmout(setTimeout(async () => {
        await handleLike(post.postId); // Backend call
      }, 500));
    }
  } catch (err) {
    console.error("Error handling reaction:", err);
  }
};
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setPopoverOpen(false);
    };

    if (popoverOpen) {
      requestAnimationFrame(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
      });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [popoverOpen]);

  return (
    <div className="mt-2 md:max-w-[832px] w-auto h-fit flex flex-col gap-2 text-white px-1 pt-2 overflow-hidden border-t-[1px] border-[#515151]">
      <div className="flex gap-2 flex-1">
        <div className='flex flex-col w-full'>
          <div className='sm:py-2 sm:px-4 py-1 px-1 flex'>
            <button className='sm:hidden block' onClick={() => router.push(`/users/${post.user.username}`)}>
              <Avatar className='w-[45px] h-[45px] rounded-full'>
                <AvatarImage src={`${post.user.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" />
              </Avatar>
            </button>
            <button className='hidden sm:block' onClick={() => router.push(`/users/${post.user.username}`)}>
              <Avatar className='w-[60px] h-[60px] rounded-full'>
                <AvatarImage src={`${post.user.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" />
              </Avatar>
            </button>
            
            <div className="flex flex-col w-full px-1 py-1">
              <div className='flex justify-between'>
                <div className='flex gap-2 items-center px-2'>
                  <button onClick={() => router.push(`/users/${post.user.username}`)}>
                    <h1 className="truncate whitespace-nowrap text-[#EFEFEF] font-[400] font-Roboto text-sm sm:text-base py-0">{post.user.firstName} {post.user.lastName}</h1>
                  </button>
                  <p className="truncate whitespace-nowrap text-xs sm:text-sm text-[#888888]">
                  {days >= 1 ? justDate : days <= 0 && hours > 0 && minutes <= 60 ? `${hours}h ago` : days <= 0 && hours <= 24 && minutes <= 60 && minutes >= 1 ? `${minutes}m ago` : "Just now"}
                  </p>
                </div>
                <div>
                  {showUpdate && (
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger className='cursor-pointer' onClick={() => setPopoverOpen(!popoverOpen)} asChild><EllipsisIcon className="text-[#AFAFAF] size-7" /></PopoverTrigger>
                      <PopoverContent className="w-fit px-2">
                        <Command>
                          <CommandList>
                            <CommandGroup >
                              <CommandItem className="text-[#AFAFAF] text-lg cursor-pointer w-fit" onSelect={(currentValue) => {
                                  setPopoverOpen(false);
                                  setIsUpdatePostDialogOpen(true);
                                  handleUpdate();
                              }}><Pencil className="w-6 h-6"/>Update</CommandItem>
                              <CommandItem className="text-[#AFAFAF] text-lg cursor-pointer w-fit" onSelect={(currentValue) => {
                                  setPopoverOpen(false);
                                  deletePost(post.postId);
                                  toast({description: "Post successfully deleted."});
                              }}><Trash2 className="w-6 h-6"/>Delete</CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                  {showUpdate && (
                    <Dialog open={isUpdatePostDialogOpen} onOpenChange={setIsUpdatePostDialogOpen}>
                      <DialogContent className='h-fit flex flex-col px-2 lg:px-4 text-black overflow-y-auto overflow-x-hidden bg-[#222222] max-w-[90%] sm:max-w-[90%] xl:max-w-[45%] lg:min-w-fit border-transparent [&>button]:text-white'>
                        <DialogHeader className='flex flex-row gap-2'>
                          <button onClick={() => router.push(`/users/${post.user.username}`)}>
                            <Avatar className='lg:w-[40px] lg:h-[40px] rounded-full'>
                              <AvatarImage src={`${post.user.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" />
                            </Avatar>
                          </button>
                          <div className='flex justify-between w-full pr-8 !mt-0 '>
                            <div className='flex flex-col'>
                              <DialogDescription className='text-base text-[#EFEFEF]'><button onClick={() => router.push(`/users/${post.user.username}`)}>{post.user.firstName} {post.user.lastName}</button></DialogDescription>
                              <DialogTitle className='text-sm font-[500] text-[#888888] text-left'><button onClick={() => router.push(`/users/${post.user.username}`)}>@ {post.user.username}</button></DialogTitle>
                            </div>
                            <div>
                              <p className='text-[#888888] text-opacity-60'>{days >= 1 ? justDate : days <= 0 && hours > 0 && minutes <= 60 ? `${hours}h ago` : days <= 0 && hours <= 24 && minutes <= 60 && minutes >= 1 ? `${minutes}m ago` : "Just now"}</p>
                            </div>
                          </div>
                        </DialogHeader>
                        <div className="flex gap-1 items-center flex-col max-w-full rounded-md shadow-[1px_1px_2px_0px_rgba(0,_0,_0,_0.3)] bg-[#363636]">
                            <div className="flex flex-row relative w-full justify-between items-center gap-4 lg:py-4 lg:px-4 py-2 px-2">
                              <div className='flex w-full h-full justify-center'>
                                <Avatar className='w-[35px] h-[35px] lg:w-[60px] lg:h-[60px] rounded-full'>
                                  <AvatarImage src={`${post.user.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}}/>
                                </Avatar>
                                <div className="flex flex-col flex-grow relative max-h-fit ml-4 lg:max-h-fit ">
                                  <ResizableTextarea onChange={(e) =>  setUpdatedContent(e.target.value)} value={updatedContent} className="font-Roboto font-normal leading-5 scrollbar-none lg:max-w-[80%] max-h-[100px] lg:max-h-[150px] text-lg text-white outline-none py-3 rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
                                  <input type="file" id="new-file-input" placeholder="a" className="hidden" onChange={handlePostFile} multiple/>
                                  <div className="flex justify-between mt-2">
                                    <div>
                                      <label htmlFor="new-file-input" className="hover:cursor-pointer w-fit text-[#CCCCCC] font-Roboto"><FontAwesomeIcon icon={faImage} size="2x"/></label>
                                    </div>
                                    <div className='flex items-center justify-end w-fit h-full'>
                                      <button onClick={() => update()} className="rounded-full w-[100px] bg-[#5D5E5D] text-white mr-4 py-[0.30rem] text-sm lg:text-base">Update post</button>
                                    </div>
                                  </div>
                                  {previousFiles.length === 0 ? null : (
                                  <div className="flex w-full h-full mt-4 -ml-4">
                                    <div className={`grid gap-2 ${previousFiles.length <= 2 ? "grid-cols-3" : ''} ${previousFiles.length >= 3 ? "grid-rows-2 grid-cols-3" : "grid-rows-1"}`}>
                                      {previousFiles ? previousFiles.map((file, index) => (
                                        <div key={index} className='w-full relative flex justify-center sm:px-2'>
                                          <Image key={index} src={file} width={100} height={100} alt="a" className="py-2 rounded-xl h-[150px] w-full" unoptimized/>
                                          <button className="absolute text-white top-2 right-4" onClick={() => setPreviousFiles(previousFiles.filter((_, postIndex) => postIndex != index))}>X</button>
                                        </div>
                                      )) : null}
                                      <div className='w-full flex justify-center items-center'>
                                        {previousFiles.length === 0 ? null : <label htmlFor='new-file-input' className="hover:cursor-pointer text-[#646464] font-Roboto"><CircleFadingPlus className='text-[#646464] size-14' /></label>}
                                      </div>
                                    </div>
                                  </div>
                                  )}
                                </div>
                              </div>
                            </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
              <button onClick={() => router.push(`/users/${post.user.username}`)} className='w-fit h-fit px-2'>
                <p className="text-[#888888] pt-0  text-sm sm:text-md">@{post.user.username}</p>
              </button>
            </div>
          </div>
          <div className={`flex flex-col sm:mx-[90px] mx-[5px] mt-2`}>
            {/* Paragraph content */}
            <p className={`max-w-full break-words pt-1 text-justify text-[#EFEFEF] font-normal font-Roboto`} dangerouslySetInnerHTML={{ __html: post.content.replace(/\r\n/g, '<br />') }} />

            {/* Image content */}
            {post.fileUrls?.length > 0 && (
              <div>
                {post.fileUrls?.length === 1 && isPortrait ? (
                  // Single portrait image
                  <Image
                    src={post.fileUrls[0]}
                    alt="Post Image"
                    sizes="100vw"
                    width={0}
                    height={0}
                    className="w-full h-auto"
                    onLoad={handleImageLoad}
                    unoptimized
                  />
                ) : (
                  // Multiple images or single non-portrait image
                  post.fileUrls.map((file, index) => (
                    <Image
                      key={index}
                      src={file}
                      alt={`Image ${index + 1}`}
                      sizes="100vw"
                      width={0}
                      height={0}
                      className="w-full h-auto py-2"
                      onLoad={handleImageLoad}
                      unoptimized
                    />
                  ))
                )}
              </div>
            )}
          </div>
          <div className="flex gap-4 items-center justify-between">
            <div className="flex justify-between w-full">
              <div className='flex gap-1 px-2 sm:px-12 py-2 mt-6 items-center'>
                <button onClick={() => handleReaction(1)}><svg width="25" height="25" viewBox="0 0 5 5" fill={`${postReaction === 1  ? '#319357' : '#C7C7C7'}`} xmlns="http://www.w3.org/2000/svg"><path d="M0.876018 3.89022C0.876018 3.84194 0.859084 3.80016 0.825216 3.76488C0.791348 3.7296 0.751242 3.71197 0.704896 3.71197C0.656768 3.71197 0.616215 3.7296 0.583238 3.76488C0.550262 3.80016 0.533773 3.84194 0.533773 3.89022C0.533773 3.94035 0.550262 3.98259 0.583238 4.01694C0.616215 4.0513 0.656768 4.06847 0.704896 4.06847C0.751242 4.06847 0.791348 4.0513 0.825216 4.01694C0.859084 3.98259 0.876018 3.94035 0.876018 3.89022ZM1.30382 2.4642V4.24672C1.30382 4.295 1.28689 4.33678 1.25302 4.37206C1.21915 4.40734 1.17905 4.42498 1.1327 4.42498H0.362651C0.316305 4.42498 0.276198 4.40734 0.24233 4.37206C0.208462 4.33678 0.191528 4.295 0.191528 4.24672V2.4642C0.191528 2.41592 0.208462 2.37414 0.24233 2.33886C0.276198 2.30358 0.316305 2.28594 0.362651 2.28594H1.1327C1.17905 2.28594 1.21915 2.30358 1.25302 2.33886C1.28689 2.37414 1.30382 2.41592 1.30382 2.4642ZM4.46959 2.4642C4.46959 2.62388 4.42057 2.76221 4.32253 2.87919C4.34927 2.96089 4.36264 3.03145 4.36264 3.09087C4.36799 3.23198 4.32966 3.35917 4.24767 3.47244C4.27797 3.57642 4.27797 3.68504 4.24767 3.79831C4.22093 3.90414 4.1728 3.99141 4.10328 4.06011C4.11932 4.26808 4.07565 4.43612 3.97227 4.56424C3.85818 4.70535 3.68261 4.77777 3.44553 4.78148H3.10061C2.98296 4.78148 2.85462 4.76709 2.71559 4.73831C2.57655 4.70953 2.46826 4.68261 2.39072 4.65754C2.31318 4.63247 2.20578 4.5958 2.06853 4.54752C1.84928 4.46768 1.70846 4.42683 1.64607 4.42498C1.59972 4.42312 1.55962 4.40501 1.52575 4.37066C1.49188 4.33631 1.47495 4.295 1.47495 4.24672V2.46141C1.47495 2.41499 1.49099 2.37461 1.52308 2.34026C1.55516 2.3059 1.59349 2.28687 1.63805 2.28316C1.68083 2.27945 1.74856 2.22467 1.84126 2.11883C1.93395 2.01299 2.02397 1.90066 2.11131 1.78182C2.23252 1.62028 2.32254 1.50887 2.38136 1.4476C2.41345 1.41418 2.44108 1.36961 2.46425 1.31391C2.48742 1.25821 2.50302 1.21318 2.51104 1.17883C2.51906 1.14448 2.53109 1.08831 2.54714 1.01032C2.55961 0.937909 2.57076 0.881276 2.58056 0.840427C2.59036 0.799577 2.60774 0.751301 2.6327 0.695597C2.65765 0.639893 2.68796 0.593473 2.72361 0.556337C2.75747 0.521058 2.79758 0.503418 2.84393 0.503418C2.92592 0.503418 2.99945 0.513166 3.06451 0.532663C3.12958 0.552159 3.18305 0.576297 3.22494 0.605078C3.26683 0.633858 3.30248 0.671458 3.33189 0.717878C3.36131 0.764298 3.3827 0.806076 3.39606 0.843212C3.40943 0.880348 3.42013 0.926768 3.42815 0.982472C3.43617 1.03818 3.44063 1.07995 3.44152 1.10781C3.44241 1.13566 3.44286 1.17187 3.44286 1.21643C3.44286 1.28699 3.43439 1.35755 3.41745 1.4281C3.40052 1.49866 3.38359 1.55437 3.36665 1.59522C3.34972 1.63606 3.32521 1.68806 3.29312 1.75119C3.28778 1.76233 3.27886 1.77904 3.26639 1.80132C3.25391 1.8236 3.2441 1.84403 3.23697 1.86259C3.22984 1.88116 3.22271 1.90344 3.21558 1.92944H3.95622C4.09526 1.92944 4.21558 1.98236 4.31718 2.0882C4.41879 2.19403 4.46959 2.31937 4.46959 2.4642Z"/></svg></button>
                <p className={`${postReaction === 1  ? 'text-[#319357]' : 'text-[#C7C7C7]'}`}>{postLikes}</p>
                <button onClick={() => handleReaction(-1)}><svg width="27" height="27" viewBox="0 0 6 5" fill={`${postReaction === -1  ? '#D25551' : '#C7C7C7'}`} xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_54_1050)"><path d="M1.8447 1.57156C1.8447 1.61885 1.82742 1.65978 1.79286 1.69434C1.7583 1.7289 1.71738 1.74618 1.67008 1.74618C1.62097 1.74618 1.57959 1.7289 1.54594 1.69434C1.51229 1.65978 1.49547 1.61885 1.49547 1.57156C1.49547 1.52245 1.51229 1.48107 1.54594 1.44742C1.57959 1.41377 1.62097 1.39695 1.67008 1.39695C1.71738 1.39695 1.7583 1.41377 1.79286 1.44742C1.82742 1.48107 1.8447 1.52245 1.8447 1.57156ZM2.28124 2.96848V1.22233C2.28124 1.17504 2.26396 1.13411 2.2294 1.09955C2.19484 1.065 2.15391 1.04772 2.10662 1.04772H1.32086C1.27356 1.04772 1.23264 1.065 1.19808 1.09955C1.16352 1.13411 1.14624 1.17504 1.14624 1.22233V2.96848C1.14624 3.01577 1.16352 3.0567 1.19808 3.09126C1.23264 3.12581 1.27356 3.14309 1.32086 3.14309H2.10662C2.15391 3.14309 2.19484 3.12581 2.2294 3.09126C2.26396 3.0567 2.28124 3.01577 2.28124 2.96848ZM5.36155 2.56195C5.46159 2.67291 5.51161 2.80842 5.51161 2.96848C5.50979 3.11035 5.4575 3.23313 5.35473 3.33681C5.25196 3.44048 5.12964 3.49232 4.98777 3.49232H4.23201C4.23929 3.51779 4.24656 3.53962 4.25384 3.5578C4.26111 3.57599 4.27112 3.596 4.28385 3.61783C4.29658 3.63965 4.30568 3.65602 4.31113 3.66694C4.34387 3.73424 4.36843 3.78608 4.3848 3.82245C4.40117 3.85883 4.41845 3.91204 4.43664 3.98206C4.45483 4.05209 4.46392 4.12166 4.46392 4.19078C4.46392 4.23444 4.46347 4.26991 4.46256 4.29719C4.46165 4.32447 4.4571 4.3654 4.44892 4.41997C4.44073 4.47453 4.42982 4.52 4.41618 4.55638C4.40253 4.59276 4.38071 4.63369 4.3507 4.67916C4.32068 4.72463 4.28431 4.76146 4.24156 4.78966C4.19882 4.81785 4.14425 4.8415 4.07786 4.86059C4.01147 4.87969 3.93644 4.88924 3.85277 4.88924C3.80548 4.88924 3.76455 4.87196 3.72999 4.8374C3.69362 4.80103 3.66269 4.75555 3.63723 4.70099C3.61177 4.64642 3.59403 4.59913 3.58403 4.55911C3.57402 4.5191 3.56265 4.46362 3.54992 4.39268C3.53355 4.31629 3.52127 4.26127 3.51309 4.22762C3.5049 4.19397 3.48899 4.14986 3.46534 4.09529C3.4417 4.04072 3.4135 3.99707 3.38076 3.96433C3.32074 3.90431 3.22889 3.79517 3.1052 3.63693C3.01607 3.52052 2.92422 3.41047 2.82964 3.3068C2.73505 3.20312 2.66593 3.14946 2.62228 3.14582C2.57681 3.14218 2.5377 3.12354 2.50496 3.08989C2.47222 3.05624 2.45585 3.01668 2.45585 2.97121V1.22233C2.45585 1.17504 2.47313 1.13457 2.50769 1.10092C2.54225 1.06727 2.58317 1.04953 2.63047 1.04772C2.69413 1.0459 2.83782 1.00588 3.06155 0.927668C3.2016 0.880377 3.31119 0.844453 3.39031 0.819898C3.46944 0.795343 3.57993 0.768969 3.72181 0.740776C3.86368 0.712583 3.99464 0.698486 4.11469 0.698486H4.46665C4.70856 0.702124 4.88773 0.773061 5.00414 0.911298C5.10963 1.0368 5.1542 1.20141 5.13783 1.40513C5.20876 1.47243 5.25787 1.55792 5.28516 1.6616C5.31608 1.77255 5.31608 1.87896 5.28516 1.98081C5.36883 2.09177 5.40793 2.21636 5.40248 2.3546C5.40248 2.4128 5.38883 2.48192 5.36155 2.56195Z"/></g><defs><clipPath id="clip0_54_1050"><rect width="4.88921" height="4.88921" transform="translate(0.971436)"/></clipPath></defs></svg></button>
                <p className={`${postReaction === -1  ? 'text-[#D25551]' : 'text-[#C7C7C7]'}`}>{postDislikes}</p>
              </div>
              <Dialog>
                <DialogTrigger className='flex sm:px-8 py-2 mt-6 rounded-md w-fit text-[#C7C7C7]' onClick={() => handleComments()}><svg className='mr-1' width="24" height="24" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_54_1461)"> <path d="M7.34927 2.1044C7.12027 1.42273 6.57694 0.879395 5.89561 0.650729C4.63761 0.228729 3.36194 0.228729 2.10427 0.650729C1.42261 0.879395 0.879273 1.42273 0.650606 2.10406C0.228606 3.36206 0.228606 4.6374 0.650606 5.8954C0.879273 6.57673 1.42261 7.1204 2.10427 7.34906C2.73227 7.55973 3.36994 7.6664 3.99994 7.6664C5.00727 7.6664 6.02794 7.53373 7.03361 7.27206C7.15061 7.24173 7.24194 7.1504 7.27227 7.0334C7.53394 6.02773 7.66661 5.00706 7.66661 3.99973C7.66661 3.37006 7.55994 2.7324 7.34927 2.10406V2.1044ZM6.67527 6.67506C5.78627 6.89073 4.88727 7.00006 4.00027 7.00006C3.44294 7.00006 2.87627 6.90473 2.31694 6.71706C1.83227 6.55439 1.44594 6.16806 1.28327 5.68339C0.908273 4.56639 0.908273 3.4334 1.28327 2.3164C1.44561 1.83173 1.83194 1.4454 2.31694 1.28306C2.87527 1.09573 3.43794 1.00173 4.00027 1.00173C4.56261 1.00173 5.12527 1.0954 5.68394 1.28306C6.16861 1.4454 6.55494 1.83173 6.71761 2.31673C6.90527 2.8764 7.00061 3.44273 7.00061 4.00006C7.00061 4.8874 6.89127 5.78606 6.67561 6.67506H6.67527Z" fill="#C7C7C7"/> <path d="M5.68797 3.66675H2.31197C2.12797 3.66675 1.97864 3.81608 1.97864 4.00008C1.97864 4.18408 2.12797 4.33341 2.31197 4.33341H5.68797C5.87197 4.33341 6.0213 4.18408 6.0213 4.00008C6.0213 3.81608 5.87197 3.66675 5.68797 3.66675Z" fill="#C7C7C7"/> <path d="M5.35468 5.00708H2.64535C2.46135 5.00708 2.31201 5.15641 2.31201 5.34041C2.31201 5.52441 2.46135 5.67375 2.64535 5.67375H5.35468C5.53868 5.67375 5.68801 5.52441 5.68801 5.34041C5.68801 5.15641 5.53868 5.00708 5.35468 5.00708Z" fill="#C7C7C7"/> <path d="M2.64535 2.99308H3.61335C3.79735 2.99308 3.94668 2.84375 3.94668 2.65975C3.94668 2.47575 3.79735 2.32642 3.61335 2.32642H2.64535C2.46135 2.32642 2.31201 2.47575 2.31201 2.65975C2.31201 2.84375 2.46135 2.99308 2.64535 2.99308Z" fill="#C7C7C7"/> </g> <defs> <clipPath id="clip0_54_1461"> <rect width="8" height="8" fill="white"/></clipPath></defs></svg>{post.commentCount}</DialogTrigger>
                <DialogContent className='w-full px-2 sm:px-4 h-[85vh] flex flex-col bg-[#222222] text-black overflow-y-auto max-w-[90%] sm:max-w-[55%] lg:max-w-[45%] xl:max-w-[35%] border-transparent [&>button]:text-white'>
                  <DialogHeader className='flex flex-row gap-2'>
                    <button onClick={() => router.push(`/users/${post.user.username}`)}>
                      <Avatar className='w-[45px] h-[45px] rounded-full'>
                        <AvatarImage src={`${post.user.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover"/>
                      </Avatar>
                    </button>
                    <div className='flex justify-between w-full pr-8 !mt-0 '>
                      <div className='flex flex-col'>
                        <DialogDescription className='text-base text-[#EFEFEF] text-left'><button onClick={() => router.push(`/users/${post.user.username}`)}>{post.user.firstName} {post.user.lastName}</button></DialogDescription>
                        <DialogTitle className='text-sm font-[500] text-[#888888] text-left'><button onClick={() => router.push(`/users/${post.user.username}`)}>@ {post.user.username}</button></DialogTitle>
                      </div>
                      <div>
                        <p className='text-[#888888] text-opacity-60'>{days >= 1 ? justDate : days <= 0 && hours > 0 && minutes <= 60 ? `${hours}h ago` : days <= 0 && hours <= 24 && minutes <= 60 && minutes >= 1 ? `${minutes}m ago` : "Just now"}</p>
                      </div>
                    </div>
                  </DialogHeader>
                  <ScrollArea className="rounded-md py-2 w-[100%]">
                    <div className={`flex flex-col sm:mx-[45px] mx-[5px] mt-2`}>
                      {/* Paragraph content */}
                      <p className={`max-w-full break-words pt-1 text-justify text-[#EFEFEF] font-normal font-Roboto`} dangerouslySetInnerHTML={{ __html: post.content.replace(/\r\n/g, '<br />') }} />

                      {/* Image content */}
                      {post.fileUrls?.length > 0 && (
                        <div>
                          {post.fileUrls?.length === 1 && isPortrait ? (
                            // Single portrait image
                            <Image
                              src={post.fileUrls[0]}
                              alt="Post Image"
                              sizes="100vw"
                              width={0}
                              height={0}
                              className="w-full h-auto"
                              onLoad={handleImageLoad}
                              unoptimized
                            />
                          ) : (
                            // Multiple images or single non-portrait image
                            post.fileUrls.map((file, index) => (
                              <Image
                                key={index}
                                src={file}
                                alt={`Image ${index + 1}`}
                                sizes="100vw"
                                width={0}
                                height={0}
                                className="w-full h-auto py-2"
                                onLoad={handleImageLoad}
                                unoptimized
                              />
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    <div className='flex gap-1 sm:gap-2 w-[95%] pt-4 pb-0'>
                      <button onClick={() => handleReaction(1)} disabled={isProcessing}><svg width="25" height="25" viewBox="0 0 5 5" fill={`${postReaction === 1  ? '#319357' : '#C7C7C7'}`} xmlns="http://www.w3.org/2000/svg"><path d="M0.876018 3.89022C0.876018 3.84194 0.859084 3.80016 0.825216 3.76488C0.791348 3.7296 0.751242 3.71197 0.704896 3.71197C0.656768 3.71197 0.616215 3.7296 0.583238 3.76488C0.550262 3.80016 0.533773 3.84194 0.533773 3.89022C0.533773 3.94035 0.550262 3.98259 0.583238 4.01694C0.616215 4.0513 0.656768 4.06847 0.704896 4.06847C0.751242 4.06847 0.791348 4.0513 0.825216 4.01694C0.859084 3.98259 0.876018 3.94035 0.876018 3.89022ZM1.30382 2.4642V4.24672C1.30382 4.295 1.28689 4.33678 1.25302 4.37206C1.21915 4.40734 1.17905 4.42498 1.1327 4.42498H0.362651C0.316305 4.42498 0.276198 4.40734 0.24233 4.37206C0.208462 4.33678 0.191528 4.295 0.191528 4.24672V2.4642C0.191528 2.41592 0.208462 2.37414 0.24233 2.33886C0.276198 2.30358 0.316305 2.28594 0.362651 2.28594H1.1327C1.17905 2.28594 1.21915 2.30358 1.25302 2.33886C1.28689 2.37414 1.30382 2.41592 1.30382 2.4642ZM4.46959 2.4642C4.46959 2.62388 4.42057 2.76221 4.32253 2.87919C4.34927 2.96089 4.36264 3.03145 4.36264 3.09087C4.36799 3.23198 4.32966 3.35917 4.24767 3.47244C4.27797 3.57642 4.27797 3.68504 4.24767 3.79831C4.22093 3.90414 4.1728 3.99141 4.10328 4.06011C4.11932 4.26808 4.07565 4.43612 3.97227 4.56424C3.85818 4.70535 3.68261 4.77777 3.44553 4.78148H3.10061C2.98296 4.78148 2.85462 4.76709 2.71559 4.73831C2.57655 4.70953 2.46826 4.68261 2.39072 4.65754C2.31318 4.63247 2.20578 4.5958 2.06853 4.54752C1.84928 4.46768 1.70846 4.42683 1.64607 4.42498C1.59972 4.42312 1.55962 4.40501 1.52575 4.37066C1.49188 4.33631 1.47495 4.295 1.47495 4.24672V2.46141C1.47495 2.41499 1.49099 2.37461 1.52308 2.34026C1.55516 2.3059 1.59349 2.28687 1.63805 2.28316C1.68083 2.27945 1.74856 2.22467 1.84126 2.11883C1.93395 2.01299 2.02397 1.90066 2.11131 1.78182C2.23252 1.62028 2.32254 1.50887 2.38136 1.4476C2.41345 1.41418 2.44108 1.36961 2.46425 1.31391C2.48742 1.25821 2.50302 1.21318 2.51104 1.17883C2.51906 1.14448 2.53109 1.08831 2.54714 1.01032C2.55961 0.937909 2.57076 0.881276 2.58056 0.840427C2.59036 0.799577 2.60774 0.751301 2.6327 0.695597C2.65765 0.639893 2.68796 0.593473 2.72361 0.556337C2.75747 0.521058 2.79758 0.503418 2.84393 0.503418C2.92592 0.503418 2.99945 0.513166 3.06451 0.532663C3.12958 0.552159 3.18305 0.576297 3.22494 0.605078C3.26683 0.633858 3.30248 0.671458 3.33189 0.717878C3.36131 0.764298 3.3827 0.806076 3.39606 0.843212C3.40943 0.880348 3.42013 0.926768 3.42815 0.982472C3.43617 1.03818 3.44063 1.07995 3.44152 1.10781C3.44241 1.13566 3.44286 1.17187 3.44286 1.21643C3.44286 1.28699 3.43439 1.35755 3.41745 1.4281C3.40052 1.49866 3.38359 1.55437 3.36665 1.59522C3.34972 1.63606 3.32521 1.68806 3.29312 1.75119C3.28778 1.76233 3.27886 1.77904 3.26639 1.80132C3.25391 1.8236 3.2441 1.84403 3.23697 1.86259C3.22984 1.88116 3.22271 1.90344 3.21558 1.92944H3.95622C4.09526 1.92944 4.21558 1.98236 4.31718 2.0882C4.41879 2.19403 4.46959 2.31937 4.46959 2.4642Z"/></svg></button>
                      <p className={`${postReaction === 1  ? 'text-[#319357]' : 'text-[#C7C7C7]'}`}>{postLikes}</p>
                      <button onClick={() => handleReaction(-1)} disabled={isProcessing}><svg width="27" height="27" viewBox="0 0 6 5" fill={`${postReaction === -1  ? '#D25551' : '#C7C7C7'}`} xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_54_1050)"><path d="M1.8447 1.57156C1.8447 1.61885 1.82742 1.65978 1.79286 1.69434C1.7583 1.7289 1.71738 1.74618 1.67008 1.74618C1.62097 1.74618 1.57959 1.7289 1.54594 1.69434C1.51229 1.65978 1.49547 1.61885 1.49547 1.57156C1.49547 1.52245 1.51229 1.48107 1.54594 1.44742C1.57959 1.41377 1.62097 1.39695 1.67008 1.39695C1.71738 1.39695 1.7583 1.41377 1.79286 1.44742C1.82742 1.48107 1.8447 1.52245 1.8447 1.57156ZM2.28124 2.96848V1.22233C2.28124 1.17504 2.26396 1.13411 2.2294 1.09955C2.19484 1.065 2.15391 1.04772 2.10662 1.04772H1.32086C1.27356 1.04772 1.23264 1.065 1.19808 1.09955C1.16352 1.13411 1.14624 1.17504 1.14624 1.22233V2.96848C1.14624 3.01577 1.16352 3.0567 1.19808 3.09126C1.23264 3.12581 1.27356 3.14309 1.32086 3.14309H2.10662C2.15391 3.14309 2.19484 3.12581 2.2294 3.09126C2.26396 3.0567 2.28124 3.01577 2.28124 2.96848ZM5.36155 2.56195C5.46159 2.67291 5.51161 2.80842 5.51161 2.96848C5.50979 3.11035 5.4575 3.23313 5.35473 3.33681C5.25196 3.44048 5.12964 3.49232 4.98777 3.49232H4.23201C4.23929 3.51779 4.24656 3.53962 4.25384 3.5578C4.26111 3.57599 4.27112 3.596 4.28385 3.61783C4.29658 3.63965 4.30568 3.65602 4.31113 3.66694C4.34387 3.73424 4.36843 3.78608 4.3848 3.82245C4.40117 3.85883 4.41845 3.91204 4.43664 3.98206C4.45483 4.05209 4.46392 4.12166 4.46392 4.19078C4.46392 4.23444 4.46347 4.26991 4.46256 4.29719C4.46165 4.32447 4.4571 4.3654 4.44892 4.41997C4.44073 4.47453 4.42982 4.52 4.41618 4.55638C4.40253 4.59276 4.38071 4.63369 4.3507 4.67916C4.32068 4.72463 4.28431 4.76146 4.24156 4.78966C4.19882 4.81785 4.14425 4.8415 4.07786 4.86059C4.01147 4.87969 3.93644 4.88924 3.85277 4.88924C3.80548 4.88924 3.76455 4.87196 3.72999 4.8374C3.69362 4.80103 3.66269 4.75555 3.63723 4.70099C3.61177 4.64642 3.59403 4.59913 3.58403 4.55911C3.57402 4.5191 3.56265 4.46362 3.54992 4.39268C3.53355 4.31629 3.52127 4.26127 3.51309 4.22762C3.5049 4.19397 3.48899 4.14986 3.46534 4.09529C3.4417 4.04072 3.4135 3.99707 3.38076 3.96433C3.32074 3.90431 3.22889 3.79517 3.1052 3.63693C3.01607 3.52052 2.92422 3.41047 2.82964 3.3068C2.73505 3.20312 2.66593 3.14946 2.62228 3.14582C2.57681 3.14218 2.5377 3.12354 2.50496 3.08989C2.47222 3.05624 2.45585 3.01668 2.45585 2.97121V1.22233C2.45585 1.17504 2.47313 1.13457 2.50769 1.10092C2.54225 1.06727 2.58317 1.04953 2.63047 1.04772C2.69413 1.0459 2.83782 1.00588 3.06155 0.927668C3.2016 0.880377 3.31119 0.844453 3.39031 0.819898C3.46944 0.795343 3.57993 0.768969 3.72181 0.740776C3.86368 0.712583 3.99464 0.698486 4.11469 0.698486H4.46665C4.70856 0.702124 4.88773 0.773061 5.00414 0.911298C5.10963 1.0368 5.1542 1.20141 5.13783 1.40513C5.20876 1.47243 5.25787 1.55792 5.28516 1.6616C5.31608 1.77255 5.31608 1.87896 5.28516 1.98081C5.36883 2.09177 5.40793 2.21636 5.40248 2.3546C5.40248 2.4128 5.38883 2.48192 5.36155 2.56195Z"/></g><defs><clipPath id="clip0_54_1050"><rect width="4.88921" height="4.88921" transform="translate(0.971436)"/></clipPath></defs></svg></button>
                      <p className={`${postReaction === -1  ? 'text-[#D25551]' : 'text-[#C7C7C7]'}`}>{postDislikes}</p>
                    </div>
                    <hr className='my-4 w-[97%] h-[1px] bg-black'/>
                    <PostComment post={post} refreshPosts={refreshPosts} refreshComments={handleComments} setComments={setComments}/>
                    <h1 className='text-2xl font-Roboto mt-4 text-[#EFEFEF]'>Comments</h1>
                    {comments.map((comment, index) => (
                      <div key={index} className='py-2'>
                        <EachComment post={post} comment={comment} refreshComments={handleComments} updateComment={updateComment} />
                      </div>
                    ))}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EachPost;