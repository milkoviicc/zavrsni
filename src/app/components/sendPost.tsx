import { Avatar, Flex } from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import { User } from '../types/types';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ResizableTextarea from './ResizableTextarea';

const SendPost = ({user, setGetPostsRef}: {user: User, setGetPostsRef: (fn: () => void) => void}) => {

  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [postFile, setPostFile] = useState<File[]>([]);
  const [postsState, setPostsState] = useState<'Popular' | 'Your Friends'>('Popular');



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
      const formData = new FormData();
      formData.append('Content', content);

      // If there are files, append them to FormData
      postFile.forEach((file) => {
        formData.append(`Files`, file);
      })  

      // šalje se axios post request na API i prenosi se vrijednost content statea, tj. uneseni tekst posta
      const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/add-post`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      // ukoliko je res.status jednak 200 novi post je dodan i vrijednost content statea se ponovno stavlja na empty string tj. ''
      if(res.status === 200) {
        setContent('');
        setPostFile([]);
      }
    } catch(err) {
        // ukoliko je došlo do greške, ispisuje se u konzoli
        console.error('Could not add post', err);
    }
  }

  useEffect(() => {
    setGetPostsRef(() => {
      return postsState === 'Popular' ? () => getPosts(currentPage) : () => getYourFeed(currentPage);
  });
  })


  return (
    <div className="flex flex-row w-fit justify-center items-center gap-4 py-4 px-4">
        <Flex gap="2" className='cursor-pointer'>
            <Avatar src={`${user.profile.pictureUrl}`} style={{ width: '60px', height: '60px', borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
        </Flex>
        <div className="flex flex-col">
            <ResizableTextarea placeholder={`What's on your mind, Eminem`} onChange={(e) =>  setContent(e.target.value)} value={content}   className="font-Roboto font-normal leading-5 scrollbar-none w-[500px] max-h-[150px] text-lg text-[#363636] outline-none py-3 rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-gray-900 bg-transparent transition-all"/>
            <input type="file" id="file-input" placeholder="a" className="hidden" onChange={handlePostFile} multiple/>
            <div className="flex flex-col">
            <label htmlFor="file-input" className="hover:cursor-pointer w-fit text-[#3D3D3D] font-Roboto">Add file <FontAwesomeIcon icon={faPaperclip} className="text-sm"/></label>
            <span className="block bg-[#424242] w-[75px] h-[1px] -ml-[3px]"></span>
            </div>
            <div className="flex items-start">
                {postFile ? postFile.map((file, index) => (<Image key={index} src={URL.createObjectURL(file)} width={100} height={64} alt="aaaaaaa" className="py-2"/>)) : null}
                {postFile.length > 0 ? <button className="w-fit px-2" onClick={() => setPostFile([])}>X</button> : null}
            </div>
        </div>
        <button onClick={() => sendPost()} className="rounded-full w-[100px] bg-[#5D5E5D] text-white mr-4 py-[0.30rem]">Post it</button>
    </div>
  )
}

export default SendPost;