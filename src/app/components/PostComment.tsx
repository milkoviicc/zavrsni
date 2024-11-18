import React, {useState} from 'react'

import {Flex, Avatar} from '@radix-ui/themes'
import { Button } from '@/src/components/ui/button';
import ResizableTextarea from './ResizableTextarea';
import axios from 'axios';
import { Post, User } from '../types/types';

const PostComment = ({postId, refreshPosts, refreshComments}: {postId: string, refreshPosts: () => void, refreshComments: () => void}) => {

  const [content, setContent] = useState('');
  const [commentTrigger, setCommentTrigger] = useState(false);

  const user: User = JSON.parse(localStorage.getItem('user') || '{}');

  if(!user) {
    return false;
  }

  const PostComment = async () => {
    try {
      const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/comments/add/${postId}`, {content});

      if(res.status === 200) {
        setContent('');
        refreshPosts();
        refreshComments();
      }
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div className='relative w-full h-full'>
      <div className="flex gap-2 items-center flex-col w-full ">
          <div className="flex flex-row w-full justify-center items-center gap-4">
            <Flex gap="2">
              <Avatar src={`${user.profile.pictureUrl}`} style={{ width: '40px', height: '40px', borderRadius: '25px'}} fallback="A" />
            </Flex>
            <ResizableTextarea placeholder="Tell us what you think." value={content} onChange={(e) => setContent(e.target.value)} className="text-gray-400 w-[500px] max-h-[150px] outline-none border-b-2 px-2 py-1 rounded resize-none overflow-hidden border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-gray-400 bg-transparent transition-all"/>
          </div>
          <div className="w-full flex justify-end">
            <Button variant="shine" className='bg-gray-500' onClick={() => PostComment()}>Post</Button>
          </div>
        </div>
    </div>
  )
}

export default PostComment;