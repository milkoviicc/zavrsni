'use client';

import React, { useEffect, useState } from 'react'

import axios from 'axios';
import { Post, Reaction } from '@/app/types/types';

import EachPost from './eachPost';

const Posts = () => {

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

        getPosts();
    }, [reactionTrigger]) 

    
    const handleReaction = async ({postId, reaction}: {postId: string, reaction: number}) => {
        try {
            const post = posts.find((post) => post.id === postId);
            if(!post) return;

            if(post.userReacted === 0 && reaction === 1) {
                await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/add/${postId}?reaction=1`);   
            }

            if(post.userReacted === 1 && reaction === 0) {
                await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/delete/${postId}`);
            }

            if(post.userReacted === 0 && reaction === -1) {
                await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/add/${postId}?reaction=-1`);   
            }

            if(post.userReacted === -1 && reaction === 0) {
                await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/delete/${postId}`); 
            }

            if(post.userReacted === 1 && reaction === -1) {
                await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/update/${postId}`);
            }

            if(post.userReacted === -1 && reaction === 1) {
                await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/update/${postId}`);
            }

            setReactionTrigger((prev) => !prev);
        } catch(err) {
            console.error(err);
        }
    }

    const handleLike = async (postId: string, isLiked: boolean) => {
        try {
            if(isLiked) {
                const reaction = 1;
                await handleReaction({postId, reaction});
            } else if(!isLiked) {
                const reaction = 0;
                await handleReaction({postId, reaction});
            }
            
        } catch(err) {
            console.error(err);
        }
    }

    const handleDislike = async (postId: string, isDisliked: boolean) => {
        try {
            if(isDisliked) {
                const reaction = -1;
                await handleReaction({postId, reaction});
            } else if(!isDisliked) {
                const reaction = 0;
                await handleReaction({postId, reaction});
            }
        } catch(err) {
            console.error(err);
        }
    }


    


  return (
    <div className='w-[60%] grid grid-cols-4 gap-4'>
        {posts.length > 0 ? posts?.map((post, index) => (<EachPost key={index} postId={post.id} username={post.userProfile.username} content={post.content} date={post.createdOn} likes={post.likes} dislikes={post.dislikes} userReacted={post.userReacted} handleLike={handleLike} handleDislike={handleDislike} />)) : posts.length === 0 ? <h1>There are no posts to load</h1> : <h1>Loading...</h1>}
    </div>
  )
}

export default Posts