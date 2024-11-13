import React, {useState} from 'react'

import {Flex, Avatar} from '@radix-ui/themes'
import { Button } from '@/src/components/ui/button';
import ResizableTextarea from './ResizableTextarea';
import axios from 'axios';
import { Post } from '../types/types';

const PostComment = ({postId, refreshPosts}: {postId: string, refreshPosts: () => void}) => {

  const [content, setContent] = useState('');
  const [commentTrigger, setCommentTrigger] = useState(false);

  const PostComment = async () => {
    try {
      const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/comments/add/${postId}`, {content});

      if(res.status === 200) {
        setContent('');
        refreshPosts();
      }
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div>
      <hr className='w-full mt-4 mx-auto'/>
      <h1 className='text-center py-4'>Comments</h1>
      <div className="flex gap-2 items-center flex-col w-full">
          <div className="flex flex-row w-full justify-center items-center gap-4">
            <Flex gap="2">
              <Avatar src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" style={{ width: '40px', height: '40px', borderRadius: '25px'}} fallback="A" />
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