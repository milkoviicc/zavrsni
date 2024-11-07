import React, {useState, useEffect} from 'react'
import {Flex, Avatar} from '@radix-ui/themes'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Post, User } from '../types/types';

const EachPost = ({post, username, content, date, likes, dislikes, userReacted, handleLike, handleDislike, deletePost, updatePost}: {post: Post, username: string, content: string, date:string, likes: number, dislikes: number, userReacted: number,  handleLike: (postId: string) => void, handleDislike: (postId: string) => void, deletePost: (postId: string) => void, updatePost: (postId: string) => void})=> {
  
  // Your timestamp as a string
  const timestamp = date;

  // Convert to Date object
  const pastDate = new Date(timestamp);

  // Get the current date and time
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceMs = currentDate.getTime() - pastDate.getTime();

  // Convert milliseconds to total seconds
  const totalSeconds = Math.floor(differenceMs / 1000);

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(totalSeconds / 86400); // 86400 seconds in a day
  const hours = Math.floor((totalSeconds % 86400) / 3600); // Remaining seconds converted to hours
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining seconds converted to minutes
  const seconds = totalSeconds % 60; // Remaining seconds after full minutes  

  const user = localStorage.getItem('user');

  const [showDelete, setShowDelete] = useState(false);
  
  useEffect(() => {
    if(user) {
      const userData: User = JSON.parse(user);
  
      if(post.userProfile.id === userData.id) {
        setShowDelete(true);
      } else {
        setShowDelete(false);
      }
    }
  });

  
  
  
  return (
    <div className='my-2 w-fit h-fit flex justify-center gap-2 bg-gray-900 text-white px-1 py-2 rounded-md'>
      <div>
        <Flex gap="2">
          <Avatar src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" fallback="A" />
        </Flex>
      </div>
      <div className='flex flex-col justify-between'>
        <div className='flex gap-2 items-center'>
          <h1 className='text-sm'>{username}</h1>
          <p className='text-sm'>
            {
              days > 1 ? (days + 'd ago')
              : days <= 0 && hours > 0 && minutes <= 60 && seconds <= 60 ? (hours + 'h ago')
              : days <= 0 && hours <= 24 && minutes <= 60 && minutes >= 1 ? (minutes + 'm ago')
              : minutes === 0 && seconds < 60 ? (seconds + 's ago')
              : seconds < 0 ? 'Just now'
              : null
            }
          </p>
        </div>
        <p className='py-2'>{content}</p>
        <div className='flex gap-4 py-4 items-center'>
          <FontAwesomeIcon icon={faThumbsUp} className={`text-2xl hover:cursor-pointer hover:text-blue-600 transition-all ${userReacted === 1 ? 'text-blue-600' : ''}`} onClick={() => handleLike(post.id)}/>
          <p>{likes}</p>
          <FontAwesomeIcon icon={faThumbsDown} className={`text-2xl hover:cursor-pointer hover:text-blue-600 transition-all ${userReacted === -1 ? 'text-blue-600' : ''}`} onClick={() => handleDislike(post.id)}/>
          <p>{dislikes}</p>
        </div>
        <div className='w-full flex justify-between'>
          <button className='text-sm px-2'>Comment</button>
          <div className='flex gap-2'>
            <button className='text-sm' onClick={() => updatePost(post.id)}>update</button>
            {showDelete ?  (<button className='text-sm' onClick={() => deletePost(post.id)}>delete</button>) : null}
          </div>
        </div>
      </div>
     
    </div>
  )
}

export default EachPost