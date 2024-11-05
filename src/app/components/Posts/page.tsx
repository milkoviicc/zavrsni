'use client';

import React, { useEffect, useState } from 'react'

import axios from 'axios';
import { Post } from '@/app/types/types';

const Posts = () => {

    const [post, setPost] = useState<Post | null>(null);


    const getPosts = async () => {
        try {
            const res = await axios.get<Post>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts');

            const post: Post = res.data;
            setPost(post);
    
            if(res.status === 200) {
                console.log('Fetched all posts');
            }
        } catch(err) {
            console.error('Could not fetch posts', err);
        }
    }
 


  return (
    <div>
        {post ? (<h1>{post.userProfile.firstName} je napisao {post.content}</h1>): <p>Loading...</p>}
    </div>
  )
}

export default Posts