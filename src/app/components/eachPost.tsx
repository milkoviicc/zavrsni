import React, {useState, useEffect} from 'react'
import {Flex, Avatar} from '@radix-ui/themes'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const EachPost = ({postId, username, content, date, postLikes, userReacted}: {postId: string, username: string, content: string, date:string, postLikes: number, userReacted: number}) => {
  
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


  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [firstClick, setFirstClick] = useState<boolean>(false);

  const [likes, setLikes] = useState(0);

  const handleLike = async () => {
    try {

      setIsLiked((prev) => !prev);
      setFirstClick(true);

    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const addReaction = async () => {
        try {
            if (isLiked && firstClick) {
                const reaction = 1;
                console.log('Reaction:', reaction);

                const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/add/${postId}`,{ reaction });

                if (res.status === 200) {
                    setLikes((prevLikes) => prevLikes + 1);   
                }
            } else if (!isLiked && firstClick) { 
                const reaction = 0;
                const res = await axios.post(
                    `https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/add/${postId}`,
                    { reaction }
                );

                if (res.status === 200) {
                    setLikes((prevLikes) => prevLikes - 1);
                }
            }
        } catch(err) {
            console.error(err);
        }
    };

    addReaction();
}, [isLiked, firstClick, postId, postLikes]); 

  const handleDislike = () => {

  }


  
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
          <FontAwesomeIcon icon={faThumbsUp} className='text-2xl hover:cursor-pointer hover:text-blue-600 transition-all' onClick={() => handleLike()}/>
          <p>{postLikes}</p>
          <FontAwesomeIcon icon={faThumbsDown} className='text-2xl hover:cursor-pointer hover:text-blue-600 transition-all' onClick={() => handleDislike()}/>
          <p></p>
        </div>
        <div className='w-full flex justify-between'>
          <button className='text-sm px-2'>Comment</button>
          <div className='flex gap-2'>
            <button className='text-sm'>update</button>
            <button className='text-sm'>delete</button>
          </div>
        </div>
      </div>
     
    </div>
  )
}

export default EachPost