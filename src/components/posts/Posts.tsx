/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Post, User } from '@/src/types/types'
import React, { useEffect, useState } from 'react'
import NewPost from './NewPost';
import EachPost from './EachPost';
import { followsApi, postsApi, profileApi, reactionsApi } from '@/src/lib/utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import Suggestions from '../other/Suggestions';
import {toast} from 'sonner';
import Cookies from 'js-cookie';

const Posts = ({popularFeed, yourFeed, suggestions, refreshPosts}: {popularFeed: Post[], yourFeed: Post[], suggestions: User[], refreshPosts: () => void}) => {

    const feed = Cookies.get('feed');
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [postsState, setPostsState] = useState(feed);
    const [randomNmbs, setRandomNmbs] = useState<number[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if(feed === 'Popular') {
        setPosts(popularFeed);
      } else {
        setPosts(yourFeed);
      }
    }, [feed, popularFeed, yourFeed]);

    useEffect(() => {
      const newRandomNmbs: number[] = [];
      for(let i = 10; i<= 100; i+=10) {
        const max: number = i;
        const min: number = i-9;
        let nmb = Math.floor(Math.random() * (max-min+1) + min);
        while(nmb === 0 || newRandomNmbs.includes(nmb)) {
          nmb = Math.floor(Math.random() * max);
        }
  
       newRandomNmbs.push(nmb);
      }
      
      setRandomNmbs(newRandomNmbs);
    }, []);


    const addNewPost = (newPost: Post) => {
      if(feed === 'Popular') {
        setPosts((prevPosts) => [...prevPosts, newPost]);
        refreshPosts();
      } else {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        refreshPosts();
      }
    }

    const deletePost = async (postId: string) => {
      const res = await postsApi.deletePost(postId);
      refreshPosts();
      if (res.status === 200) {
        // Izbacujem obrisani post
        setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
        toast("Your post has been deleted.", {duration: 1500, style:{backgroundColor: "#1565CE", border: "none", color: "#fff"}})
      }
    }

    const handleFeedState = (feedState: string) => {
        const currentFeed = Cookies.get('feed');
        if(currentFeed === 'Popular' && feedState === 'Popular') {
          return;
        } else if (currentFeed === 'Popular' && feedState === 'Your Feed') {
          Cookies.set('feed', `${feedState}`);
          setPostsState('Your Feed');
          setCurrentPage(0);
          setPosts([]);
          setHasMore(true);
    
        } else if (currentFeed === 'Your Feed' && feedState === 'Popular') {
          Cookies.set('feed', `${feedState}`);
          setPostsState('Popular');
          setCurrentPage(0);
          setPosts([]);
          setHasMore(true);
    
        } else if (currentFeed === 'Your Feed' && feedState === 'Your Feed') {
          return;
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

    const getPosts = async (postsState: string, page: number) => {
      if(page === 0) {
        setPosts([]);
      }

      if(postsState === 'Popular') {
        try {
          const res = await postsApi.getPopularFeed(page);
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
      } else if (postsState === 'Your Feed') {
        try {
          const res = await postsApi.getYourFeed(page);
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
    }

    const fetchMoreData = async() => {
      if(postsState)  {
        getPosts(postsState, currentPage + 1);
      }
      setCurrentPage((prevPage) => prevPage + 1);  // Increment page
    };

  return (
    <div className='w-full h-full'>
        <NewPost addNewPost={addNewPost}/>
        <div className="flex gap-4 py-6 justify-center items-center">
            <div>
                <button className={`text-2xl text-[#8A8A8A] cursor-pointer ${postsState === "Popular" ? ' text-[#EFEFEF]' : null}`} onClick={() => handleFeedState('Popular')}>Popular</button>
                <span className={`${postsState === 'Popular' ? 'block bg-[#EFEFEF]' : 'hidden'} w-full h-[2px]`}></span>
            </div>
            <span className="h-10 block border-black bg-[#8A8A8A] w-[1px]"></span>
            <div>
                <button className={`text-2xl text-[#8A8A8A] cursor-pointer ${postsState === "Your Feed" ? 'text-[#EFEFEF]' : null}`} onClick={() => handleFeedState('Your Feed')}>Your Feed</button>
                <span className={`${postsState === 'Your Feed' ? 'block bg-[#EFEFEF]' : 'hidden'} w-full h-[1px]`}></span>
            </div>
        </div>
          <InfiniteScroll className='w-full flex flex-col items-center bg-transparent px-0 md:px-8 sm:px-4 2k:min-w-[832px]' dataLength={posts.length} next={fetchMoreData} hasMore={hasMore} loader={<h1>Loading...</h1>} endMessage={<h1 className='text-center text-white'>No more posts!</h1>}>
            {posts.map((post, index) => (
              <div key={index} className='max-w-[832px] w-full'>
                {randomNmbs?.includes(index) ? (
                  <div className='flex flex-col items-center my-4 py-2 border-t-[1px] border-[#515151] w-full'>
                    <p className='text-[#8A8A8A]'>You might like these</p>
                    <Suggestions profileSuggestion={suggestions}/>
                  </div>
                ): null}
                <EachPost key={post.postId} post={post} refreshPosts={refreshPosts} handleLike={handleLike} handleDislike={handleDislike} deletePost={deletePost}/>
              </div>
              )
            )}
          </InfiniteScroll>
    </div>
  )
}

export default Posts