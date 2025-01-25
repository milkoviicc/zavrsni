import React, {useState} from 'react'

import {Flex, Avatar} from '@radix-ui/themes'
import ResizableTextarea from './ResizableTextarea';
import axios from 'axios';
import { Post, User } from '../types/types';
import { EnhancedButton } from '@/src/components/ui/enhancedButton';
import { Comment } from '../types/types';

const PostComment = ({post, refreshPosts, refreshComments, setComments}: {post: Post, refreshPosts: () => void, refreshComments: () => void, setComments: React.Dispatch<React.SetStateAction<Comment[]>>}) => {

  const [content, setContent] = useState('');
  const [commentTrigger, setCommentTrigger] = useState(false);

  const user: User = JSON.parse(localStorage.getItem('user') || '{}');

  if(!user) {
    return false;
  }

  const PostComment = async () => {
    try {
      const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/comments/add/${post.postId}`, {content});

      if(res.status === 200) {
        setContent('');
        const newComment: Comment = res.data;
        setComments((prev) => [...prev, newComment]);
        post.commentCount++;
      }
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div className='relative w-full h-full flex justify-center'>
      <div className="flex items-start flex-col w-[95%] bg-[#363636] rounded-2xl">
          <div className="flex flex-row gap-4 w-full">
            <ResizableTextarea placeholder="Add comment..." value={content} onChange={(e) => setContent(e.target.value)} className="scrollbar-none text-white w-full max-h-[100px] font-Roboto outline-none px-4 py-1 my-4 rounded resize-none border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
          </div>
          <div className="w-full flex justify-end pr-2 py-2">
          <button onClick={() => PostComment()} className="rounded-full w-[100px] bg-[#5D5E5D] text-white mr-4 py-[0.30rem]">Submit</button>
          </div>
        </div>
    </div>
  )
}

export default PostComment;