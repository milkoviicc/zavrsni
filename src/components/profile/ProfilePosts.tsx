/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Post, User } from '@/src/types/types'
import React, { useEffect, useState } from 'react'
import { followsApi, postsApi, profileApi, reactionsApi } from '@/src/lib/utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import Suggestions from '../other/Suggestions';
import {toast} from 'sonner';
import NewPost from '../posts/NewPost';
import EachPost from '../posts/EachPost';

const ProfilePosts = ({user, posts, refreshPosts, myPosts}: {user: User, posts: Post[], refreshPosts: () => void, myPosts: string}) => {

    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [randomNmbs, setRandomNmbs] = useState<number[]>();
    const [loading, setLoading] = useState(false);
    const [fullPosts, setPosts] = useState(posts);

    const addNewPost = (newPost: Post) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }

    const deletePost = async (postId: string) => {
      const res = await postsApi.deletePost(postId);
      if (res.status === 200) {
        // Izbacujem obrisani post
        setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
        toast("Your post has been deleted.", {duration: 1500, style:{backgroundColor: "#1565CE", border: "none", color: "#fff"}})
      }
    }

    const handleLike = async (postId: string) => {
      try {

          // pokušavam pronaći post koji je likean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u
          const post = posts.find((post) => post.postId === postId);

          // ukoliko se ne uspije pronaći post vraća se tj izlazi iz funkcije.
          if(!post) return;

          // ukoliko je trenutan post likean (1) briše se like axios delete requestom na API
          if(post.userReacted === 1) {
              post.userReacted = 0;
              await reactionsApi.deletePostReaction(post.postId);
              return;
          }

          // ukoliko je trenutan post dislikean (-1) mjenja se iz dislike u like axios put requestom na API
          if(post.userReacted === -1) {
              post.userReacted = 1;
              await reactionsApi.updatePostReaction(post.postId);
              return;
          }

          // ukoliko trenutan post nije ni likean ni dislikean, šalje se axios post request na API sa query vrijednošću 1 kako bi se post likeao
          if (post.userReacted === 0) {
              post.userReacted = 1;
              await reactionsApi.addPostReaction(post.postId, 1);
              return;
          }
          
      } catch(err) {
          // ukoliko dođe do greške ispisat će se u konzoli
          console.error(err);
      }
    } 

    // async funckija koja se poziva klikom na gumb 'Dislike'
    const handleDislike = async (postId: string) => {
      try {

          // pokušavam pronaći post koji je dislikean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u
          const post = posts.find((post) => post.postId === postId);

          // ukoliko se ne uspije pronaći post vraća se tj izlazi iz funkcije.
          if(!post) return;

          // ukoliko je trenutan post likean (1) mjenja se iz likean u dislikean axios put requestom na API
          if(post.userReacted === 1) {
              post.userReacted = -1;
              await reactionsApi.updatePostReaction(post.postId);
              return;
          }

          // ukoliko je trenutan post dislikean (-1) briše se dislike axios delete requestom na API
          if(post.userReacted === -1) {
              post.userReacted = 0;
              await reactionsApi.deletePostReaction(post.postId);
              return;
          }

           // ukoliko trenutan post nije ni likean ni dislikean, šalje se axios post request na API sa query vrijednošću -1 kako bi se post dislikeao
          if (post.userReacted === 0) {
              post.userReacted = -1;
              await reactionsApi.addPostReaction(post.postId, -1);
              return;
          }

      } catch(err) {
          // ukoliko dođe do greške ispisat će se u konzoli
          console.error(err);
      }
    }

    const getPosts = async (page: number) => {
      if(page === 0) {
        setPosts([]);
      }

      try {
        const res = await postsApi.getUserPosts(user.userId, page);
        const postsRes: Post[] = res.data;
        if(res.status === 200) {
          if(page === 0) {
            setPosts(res.data);
            return res.data;
          } else {
            setPosts((prevPosts) => {
              const newPosts = postsRes.filter((newPost) => !prevPosts.some((existingPost) => existingPost.postId === newPost.postId));
              return [...prevPosts, ...newPosts];
            });
          }
          if(res.data.length === 0) {
            setHasMore(false);
            return [];
          }
          setLoading(false);
        }
        setLoading(false);
      } catch(err) {
        console.error('Could not fetch posts: ', err);
      }
    }

    const fetchMoreData = async() => {
      getPosts(currentPage + 1);
      setCurrentPage((prevPage) => prevPage + 1);  // Increment page
    };

  return (
    <div className='w-full'>
      <div className='md:block hidden'>
        {myPosts === 'true' ? <NewPost addNewPost={addNewPost}/> : null}
      </div>
      <h1 className='text-[#DFDEDE] text-3xl text-center py-8'>{myPosts === 'true' ? 'Your posts' : `${user.firstName?.slice(0,1).toUpperCase()}${user.firstName?.slice(1)}'s posts`}</h1>
      <InfiniteScroll className='w-full flex flex-col items-center bg-transparent px-8 sm:px-4 2k:min-w-[832px]' dataLength={posts.length} next={fetchMoreData} hasMore={hasMore} loader={<h1>Loading...</h1>} endMessage={<h1 className='text-center text-white'>No more posts!</h1>}>
        {fullPosts.map((post, index) => (
          <div key={index} className='max-w-[832px] w-full'>
            <EachPost key={post.postId} post={post} refreshPosts={refreshPosts} handleLike={handleLike} handleDislike={handleDislike} deletePost={deletePost}/>
          </div>
          )
        )}
      </InfiniteScroll>
    </div>
  )
}

export default ProfilePosts;