/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, {useState} from 'react'
import axios from 'axios';
import { Post, User } from '../../types/types';
import { Comment } from '../../types/types';
import {Button as HeroUiBtn} from "@heroui/button";
import ResizableTextarea from '../other/ResizableTextarea';
import {toast} from 'sonner';
import { commentsApi } from '@/src/lib/utils';
import { useAuth } from '@/src/context/AuthProvider';

const PostComment = ({post, refreshPosts, refreshComments, setComments, callComments}: {post: Post, refreshPosts: () => void, refreshComments: () => void, setComments: React.Dispatch<React.SetStateAction<Comment[]>>, callComments: React.Dispatch<React.SetStateAction<boolean>>}) => {

  const [content, setContent] = useState('');
  const [commentTrigger, setCommentTrigger] = useState(false);

  const {user} = useAuth();

  // funkcija za dodavanje komentara
  const PostComment = async () => {
    try {

      if(content === '') {
        toast("You can't post an empty comment.", {duration: 1500, style:{backgroundColor: "#CA3C3C", border: "none", color: "#fff"}});
        return;
      }

      const res = await commentsApi.addComment(post.postId, content);

      if(res.status === 200) {
        setContent('');
        callComments(true);
        post.commentCount++;
        toast("Comment successfully posted.", {duration: 1500, style: {backgroundColor: "#1565CE", border: "none", color: "#fff"}});
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
            <HeroUiBtn onPress={() => PostComment()} className="cursor-pointer relative flex h-[40px] w-32 items-center justify-center overflow-hidden bg-[#5D5E5D] rounded-full font-Roboto text-[#EFEFEF] shadow-[0px_3px_3px_0px_rgba(0,0,0,0.2)] transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-gray-800 before:duration-500 before:ease-out hover:shadow-none hover:before:h-56 hover:before:w-56">
              <span className="relative z-10 text-base">Submit</span>
            </HeroUiBtn>
          </div>
        </div>
    </div>
  )
}

export default PostComment;