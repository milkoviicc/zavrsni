'use client';

import React, { useEffect, useState } from 'react'

import axios from 'axios';
import { Post } from '@/app/types/types';

import EachPost from '../EachPost/page';

const Posts = () => {

    const [posts, setPosts] = useState<Post[] | null>(null);



    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await axios.get<Post>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts');

                const newPost: Post[] = Array.isArray(res.data) ? res.data : [res.data];
                setPosts(newPost);
        
                if(res.status === 200) {
                    console.log('Fetched all posts');
                }
                console.log(posts);
            } catch(err) {
                console.error('Could not fetch posts', err);
            }
        }

        getPosts();
    }, [])
 


  return (
    <div className='w-[60%] grid grid-cols-4 gap-4'>
        {posts !== null ? posts?.map((post, index) => (<EachPost key={index} username={post.userProfile.username} content={post.content} date={post.createdOn} />)) : posts === null ? <h1>There are no posts to load</h1> : <h1>Loading...</h1>}
    </div>
  )
}

export default Posts