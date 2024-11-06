import React from 'react'
import {Flex, Avatar} from '@radix-ui/themes'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const EachPost = ({username, content, date}: {username: string, content: string, date:string}) => {
  
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

  console.log(`${days} + ${hours} + ${minutes} + ${seconds}`);
  
  return (
    <div className='my-2 w-fit h-fit flex justify-center gap-2 bg-gray-900 text-white px-1 py-2 rounded-md'>
      <div>
        <Flex gap="2">
          <Avatar src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" fallback="A" />
        </Flex>
      </div>
      <div className='flex flex-col justify-between'>
        <div className='flex gap-2 items-center'>
          <h1>{username}</h1>
          <p>
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
        <p>{content}</p>
        <div className='flex gap-4 py-4 items-center'>
          <FontAwesomeIcon icon={faThumbsUp} className='text-2xl hover:cursor-pointer hover:text-blue-600 transition-all'/>
          <FontAwesomeIcon icon={faThumbsDown} className='text-2xl hover:cursor-pointer hover:text-blue-600 transition-all'/>
        </div>
      </div>
     
    </div>
  )
}

export default EachPost