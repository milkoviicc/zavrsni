'use client';

import React, { useEffect, useState } from 'react'

import axios from 'axios';
import { Post, User } from '@/app/types/types';

import EachPost from './eachPost';

const Posts = ({setGetPostsRef}: {setGetPostsRef: (fn: () => void) => void}) => {

    const [posts, setPosts] = useState<Post[]>([]);

    const [reactionTrigger, setReactionTrigger] = useState(false);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await axios.get<Post[]>('https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts');

                if(res.status === 200) {
                    setPosts(res.data);
                    console.log('Fetched all posts');
                }
            } catch(err) {
                console.error('Could not fetch posts', err);
            }
        }

        setGetPostsRef(getPosts);
        getPosts();
    }, [reactionTrigger, setGetPostsRef]);


    const handleLike = async (postId: string) => {
        try {
            const post = posts.find((post) => post.id === postId);

            if(!post) return;

            if(post.userReacted === 1) {
                await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/delete/${postId}`);
            }

            if(post.userReacted === -1) {
                await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/update/${postId}`);
            }

            if (post.userReacted === 0) {
                await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/add/${postId}?reaction=1`);   
            }

            setReactionTrigger((prev) => !prev);
            
        } catch(err) {
            console.error(err);
        }
    }

    const handleDislike = async (postId: string) => {
        try {
            const post = posts.find((post) => post.id === postId);

            console.log(post);

            if(!post) return;

            if(post.userReacted === 1) {
                await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/update/${postId}`);
            }

            if(post.userReacted === -1) {
                await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/delete/${postId}`);
            }

            if (post.userReacted === 0) {
                await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/add/${postId}?reaction=-1`);   
            }

            setReactionTrigger((prev) => !prev);
        } catch(err) {
            console.error(err);
        }
    }

    const deletePost = async (postId: string) => {
        try {
            const post = posts.find((post) => post.id === postId);
            if(!post) return;

            const user = localStorage.getItem('user');

            if(user) {
                const userData: User = JSON.parse(user);
                if(post.userProfile.id === userData.id) {
                    const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/delete-post/${postId}`);
                    if(res.status === 200) {
                        setReactionTrigger((prev) => !prev);
                    }
                } else {
                    console.log('You cannot delete posts that are not yours');
                }
            }
            
        } catch(err) {
            console.error('Could not delete post: ', err);
        }
    }

    const updatePost = async (postId: string) => {
        return;
    }

  return (
    <div className='w-[60%] grid grid-cols-4 gap-4'>
        {posts.length > 0 ? posts?.map((post, index) => (<EachPost key={index} post={post} username={post.userProfile.username} content={post.content} date={post.createdOn} likes={post.likes} dislikes={post.dislikes} userReacted={post.userReacted} handleLike={handleLike} handleDislike={handleDislike} deletePost={deletePost} updatePost={updatePost}/>)) : posts.length === 0 ? <h1>There are no posts to load</h1> : <h1>Loading...</h1>}
    </div>
  )
}

export default Posts