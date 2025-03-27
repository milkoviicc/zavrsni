'use client';
/* eslint-disable react/no-unescaped-entities */
import { Camera, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { profileApi } from '@/src/lib/utils';
import { User } from '@/src/types/types';
import { useAuth } from '@/src/context/AuthProvider';

const AddPicture = ({user, handleSkip}: {user: User, handleSkip: () => void}) => {
    const [changeImgDialogOpen, setChangeImgDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [shortUsername, setShortUsername] = useState('');
    const {setIgnoreDefaultPic} = useAuth();


    useEffect(() => {
        if(user?.firstName && user?.lastName) {
          const firstNameLetter = user?.firstName?.slice(0,1);
          const lastNameLetter = user?.lastName?.slice(0,1);
          setShortUsername(firstNameLetter+lastNameLetter);
        }
    }, [user]);

    useEffect(() => {
        if(changeImgDialogOpen === false) {
          setSelectedImage(null);
        }
    }, [changeImgDialogOpen]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if(files && files.length > 0) {
          setSelectedImage(files[0]);
        }
    }
    
    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const changeImage = async (image: File) => {
        const res = await profileApi.updateProfilePicture(image);

        if(res.status === 200) {
            document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
            document.cookie = `user=${res.data}; path=/;`;
        }
    }

    const skipImage = async() => {
        setIgnoreDefaultPic(true);
        handleSkip();
    }

  return (
    <div className="flex flex-grow justify-center items-center h-full bg-[#222222] px-2 sm:px-0">
        <div className='bg-[#363636] border-none rounded-xl px-4 py-4 shadow-[0px_2px_1px_3px_rgba(15,_15,_15,_0.2)]'>
            <h1 className="font-roboto text-[#DFDEDE] text-center py-4">Change your profile picture</h1>
            <label htmlFor="picture" onDrop={handleDrop} onDragOver={handleDragOver}>
            <div className='border-dotted border-whit[#DFDEDE] border-[2px] rounded-lg flex flex-col items-center justify-center px-8 py-8 cursor-pointer gap-2'>
                <Upload size={32} className='text-[#DFDEDE]' />
                <p className='font-Roboto text-[#DFDEDE] text-xs sm:text-sm text-center'>Drag 'n' drop image here, or click to select an image</p>
                <p className='font-Roboto text-[#888888] text-xs text-center'>You can upload only '.jpg', '.png' and '.webp' image formats.</p>
            </div>
            </label>
            <Input id="picture" type="file" className='hidden' onChange={handleImageChange}/>
            {selectedImage ? (<h1 className='font-Roboto text-[#DFDEDE] text-center'>Preview image:</h1>) : null}
            {selectedImage ? (
            <div className='flex gap-4 items-center justify-center py-4'>
                <Avatar className='relative w-[45px] h-[45px] 2xl:w-[65px] 2xl:h-[65px] 2k:w-[100px] 2k:h-[100px] rounded-full shadow-[0px_5px_5px_0px_rgba(0,_0,_0_,_0.25)]' onClick={() =>  setChangeImgDialogOpen(true)}>
                    <span><Camera size={32} className='group-hover:block hidden absolute top-[25%] left-[25%] rounded-full text-white'/></span>
                    <AvatarImage src={URL.createObjectURL(selectedImage)} className="w-fit h-fit aspect-square rounded-full object-cover" /><AvatarFallback>{shortUsername}</AvatarFallback>
                </Avatar>
                <Button className='w-fit font-Roboto bg-[#1565CE] shadow-[1px_1px_3px_0px_rgba(12,75,156,1)] hover:shadow-[1px_1px_5px_3px_rgba(12,75,156,0.7)] transition-all' onClick={() => {changeImage(selectedImage); setChangeImgDialogOpen(false)}}>Submit image</Button>
            </div>
            ) : null}
            <div className="flex justify-center py-4">
                <button className="text-[#F0F0F0] text-lg font-Roboto px-8 py-1 rounded-md bg-[#515151] shadow-[1px_1px_3px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_5px_3px_rgba(0,0,0,0.4)] transition-all cursor-pointer" onClick={() => skipImage()}>Skip</button>
            </div>
        </div>
    </div>
  )
}

export default AddPicture