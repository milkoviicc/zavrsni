/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '../ui/dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import ResizableTextarea from '../other/ResizableTextarea';
import {Button as HeroUiBtn} from '@heroui/button';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { CircleFadingPlus } from 'lucide-react';
import { Post } from '@/src/types/types';
import { useAuth } from '@/src/context/AuthProvider';
import {toast} from 'sonner';
import { postsApi } from '@/src/lib/utils';
import {FFmpeg} from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Spinner } from '@radix-ui/themes';

const NewPost = ({addNewPost}: {addNewPost: (newPost: Post) => void}) => {

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [postFile, setPostFile] = useState<File[]>([]);
    const [postDialogOpen, setPostDialogOpen] = useState(false); 
    const [content, setContent] = useState(''); 
    const [isVideoCompressing, setIsVideoCompressing] = useState(false);
    const [processingToastId, setProcessingToastId] = useState<string | number | null>(null);

    const handlePostFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const filesArray = Array.from(event.target.files);
            
            // Use the spread operator to append new files without removing previous ones.
            setPostFile((prevFiles) => [...prevFiles, ...filesArray]);
        }
    };

    // async funkcija koja se poziva kada se klikne na gumb 'Send'
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = new FFmpeg();

    const sendPost = async () => {
        try {
            if (content !== '' || postFile.length !== 0) {
                setContent('');
                setPostFile([]);
                setPostDialogOpen(false);
            } else {
                toast("Text or image is required!", { duration: 1500, style: { backgroundColor: "#CA3C3C", border: "none", color: "#fff" } });
                return;
            }
    
            // Load ffmpeg
            if (!ffmpeg.loaded) {
                await ffmpeg.load();
            }
    
            const formData = new FormData();
            formData.append('Content', content);
    
            // Check for videos and compress if needed
            for (const file of postFile) {
                if (file.type.startsWith('video/')) {
                  // Write the video file to FFmpeg's virtual file system
                  await ffmpeg.writeFile('input.mp4', await fetchFile(file));
                  
                  setIsVideoCompressing(true);
                  // Run FFmpeg command to compress the video
                  await ffmpeg.exec(['-i', 'input.mp4', '-vcodec', 'libx264', '-b:v', '800k', '-preset', 'fast', 'output.mp4']);
                  // Read the compressed video from FFmpeg's virtual file system
                  const compressedData = await ffmpeg.readFile('output.mp4');
                  
                  // Create a new File object from the compressed data
                  const compressedFile = new File([compressedData], 'compressed.mp4', { type: 'video/mp4' });
                  
                  // Append the compressed file to FormData
                  formData.append('Files', compressedFile);
                } else {
                    // Append non-video files directly
                    formData.append('Files', file);
                }
            }
    
            // Send the request
            const res = await postsApi.addPost(formData);
            
            if (res.status === 200) {
                setIsVideoCompressing(false);
                const newPost: Post = res.data;
                addNewPost(newPost);
                toast("Post successfully posted", { duration: 1500, style: { backgroundColor: "#1565CE", border: "none", color: "#fff" } });
            }
        } catch (err) {
            console.error('Could not add post', err);
        }
    };

    useEffect(() => {
        if(isVideoCompressing) {
            const videoId = toast(<div className='flex gap-2'><Spinner size="3"/>Processing files, please wait shortly!</div>, { duration: Infinity, style: { backgroundColor: "#1565CE", border: "none", color: "#fff" }});
            setProcessingToastId(videoId);
        } else {
            if(processingToastId) {
                
                toast.dismiss(processingToastId);
                setProcessingToastId(null);
            }
        }
    }, [isVideoCompressing]);

    const {user} = useAuth();

  return (
    <div className='flex justify-center'>
        <div className="flex md:hidden items-center w-full flex-col py-4">
            <div className="flex flex-col w-[85%] relative mt-6 py-2 px-4 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.3)] bg-[#363636] rounded-full">
                <div className='w-full flex justify-between items-center gap-2' onClick={() => setPostDialogOpen(true)}>
                    <Avatar className='w-[45px] h-[45px] rounded-full'>
                        <AvatarImage src={`${user?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 6px 6px 0px #00000040'}} />
                    </Avatar>
                    <div className="flex flex-col w-full px-2">
                        <div className='flex justify-between items-center w-full'>
                        <textarea value={`What's on your mind, ${user?.firstName}`} readOnly onClick={() => setPostDialogOpen(true)} className="resize-none truncate whitespace-nowrap font-Roboto font-normal scrollbar-none h-[20px] md:min-w-[310px] w-full md:w-full pr-2 text-sm text-[#fff] outline-none rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
                        <input type="file" id="file-input" accept="image/*, video/*, .webp" className="hidden" onChange={handlePostFile} multiple/>
                        <div className="flex justify-between">
                            <div>
                                <label htmlFor="file-input" className="hover:cursor-pointer text-[#646464] font-Roboto"><FontAwesomeIcon icon={faImage} size="2x" /></label>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
                <DialogContent className='top-[35%] rounded-3xl h-fit flex flex-col px-2 lg:px-4 text-black overflow-y-auto overflow-x-hidden bg-[#222222] max-w-[90%] lg:max-w-[45%] lg:min-w-fit border-transparent [&>button]:text-white'>
                    <DialogHeader>
                    <DialogTitle className='text-[#EFEFEF] font-Roboto text-left px-1 font-normal'>Post something</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 items-center flex-col max-w-full rounded-3xl shadow-[1px_1px_2px_0px_rgba(0,_0,_0,_0.3)] bg-[#363636]">
                        <div className="flex flex-col justify-between relative w-full min-h-fit items-center gap-4 pt-4 px-4">
                            <div className='w-full h-full flex gap-4 pb-2'>
                                <Avatar className='w-[45px] h-[45px] lg:w-[60px] lg:h-[60px] rounded-full'>
                                    <AvatarImage src={`${user?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}}/>
                                </Avatar>
                                <div className='flex flex-col flex-grow gap-4'>  
                                    <ResizableTextarea onChange={(e) => setContent(e.target.value)} value={content} placeholder={`What's on your mind, ${user?.firstName}`} className="font-Roboto font-normal leading-5 scrollbar-none w-full max-h-[100px] lg:max-h-[150px] text-sm lg:text-lg text-[#EFEFEF] outline-none rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
                                    <div className='flex justify-end gap-4 items-center'>
                                        <div className='flex h-full justify-center items-center'>
                                        <input type="file" id="file-input" accept="image/*, video/*, .webp"  disabled className="hidden" onChange={handlePostFile} multiple/>
                                        <div className='flex w-full h-full items-center'>
                                            <label htmlFor="file-input" className="hover:cursor-pointer text-[#646464] font-Roboto"><FontAwesomeIcon icon={faImage} size="2x" className='pt-[3px]'/></label>
                                        </div>
                                        </div>
                                        <HeroUiBtn onPress={() => sendPost()} className="relative flex h-[40px] w-28 items-center justify-center overflow-hidden bg-[#5D5E5D] rounded-full font-Roboto text-[#EFEFEF] shadow-[0px_3px_3px_0px_rgba(0,0,0,0.2)] transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-gray-800 before:duration-500 before:ease-out hover:shadow-none hover:before:h-56 hover:before:w-56">
                                            <span className="relative z-10 text-base cursor-pointer">Post it</span>
                                        </HeroUiBtn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full h-full justify-center">
                        <div className={`grid gap-2 ${postFile.length <= 2 ? "grid-cols-3" : ""} ${postFile.length >= 3 ? "grid-rows-2 grid-cols-3" : "grid-rows-1"}`}> {postFile && postFile.map((file, index) => {
                                const fileUrl = URL.createObjectURL(file);
                                const isVideo = file.type.startsWith("video");
                                return (
                                <div key={index} className="w-full relative flex justify-center sm:px-2" >
                                    {isVideo ? ( 
                                        <video key={index} src={fileUrl} width={100} height={100} className="py-2 opacity-80 rounded-xl h-[150px] w-[150px] object-cover" controls />
                                    ) : (
                                        <Image key={index} src={fileUrl} width={100} height={100} alt="a" className="py-2 opacity-80 rounded-xl h-[150px] w-[150px] object-cover"/>
                                    )}
                                    <button className="absolute text-white top-2 right-4 cursor-pointer" onClick={() => setPostFile(postFile.filter((_, postIndex) => postIndex !== index))}>X</button>
                                </div>
                                );
                            })}
                            <div className="w-full flex justify-center items-center">
                            {postFile.length === 0 ? null : (
                                <label htmlFor="file-input" className="hover:cursor-pointer text-[#646464] font-Roboto">
                                    <CircleFadingPlus className="text-[#646464] size-14" />
                                </label>
                            )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
        <div className="md:flex hidden gap-2 items-center flex-col w-fit">
            <div className="flex gap-2 items-center flex-col max-w-full rounded-3xl bg-[#363636] shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.3)]">
              <div className="flex flex-col justify-between relative w-full min-h-fit items-center gap-4 pt-4 px-4">
                  <div className='w-full h-full flex gap-4 pb-2 '>
                      <Avatar className='w-[45px] h-[45px] lg:w-[60px] lg:h-[60px] rounded-full'>
                          <AvatarImage src={`${user?.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}}/>
                      </Avatar>
                      <div className='flex flex-col flex-grow gap-4'>  
                        <ResizableTextarea onChange={(e) => setContent(e.target.value)} value={content} placeholder={`What's on your mind, ${user?.firstName}`} className="font-Roboto font-normal leading-5 scrollbar-none w-[500px] max-h-[100px] lg:max-h-[150px] text-sm md:text-lg text-[#EFEFEF] outline-none rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
                        <div className='flex justify-end gap-4 items-center'>
                            <div className='flex h-full justify-center items-center'>
                              <input type="file" id="file-input-pc" accept="image/*, video/*, .webp" className="hidden" onChange={handlePostFile} multiple/>
                              <div className='flex w-full h-full items-center'>
                                <label htmlFor="file-input-pc" className="hover:cursor-pointer text-[#646464] font-Roboto"><FontAwesomeIcon icon={faImage} size="2x" className='pt-[3px]'/></label>
                              </div>
                            </div>
                            <HeroUiBtn onPress={() => sendPost()} className="cursor-pointer relative flex h-[40px] w-28 items-center justify-center overflow-hidden bg-[#5D5E5D] rounded-full font-Roboto text-[#EFEFEF] shadow-[0px_3px_3px_0px_rgba(0,0,0,0.2)] transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-gray-800 before:duration-500 before:ease-out hover:shadow-none hover:before:h-56 hover:before:w-56">
                              <span className="relative z-10 text-base">Post it</span>
                            </HeroUiBtn>
                        </div>
                      </div>
                  </div>
              </div>
            </div>
            <div className="flex w-full h-full justify-center">
                <div className={`grid gap-2 ${postFile.length <= 2 ? "grid-cols-3" : ""} ${postFile.length >= 3 ? "grid-rows-2 grid-cols-3" : "grid-rows-1"}`}> {postFile && postFile.map((file, index) => {
                        const fileUrl = URL.createObjectURL(file);
                        const isVideo = file.type.startsWith("video");
                        return (
                        <div key={index} className="w-full relative flex justify-center sm:px-2" >
                            {isVideo ? ( 
                                <video key={index} src={fileUrl} width={100} height={100} className="py-2 opacity-80 rounded-xl h-[150px] w-[150px] object-cover" controls />
                            ) : (
                                <Image key={index} src={fileUrl} width={100} height={100} alt="a" className="py-2 opacity-80 rounded-xl h-[150px] w-[150px] object-cover"/>
                            )}
                            <button className="absolute text-white top-2 right-4 cursor-pointer" onClick={() => setPostFile(postFile.filter((_, postIndex) => postIndex !== index))}>X</button>
                        </div>
                        );
                    })}
                    <div className="w-full flex justify-center items-center">
                    {postFile.length === 0 ? null : (
                        <label htmlFor="file-input-pc" className="hover:cursor-pointer text-[#646464] font-Roboto">
                            <CircleFadingPlus className="text-[#646464] size-14" />
                        </label>
                    )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NewPost