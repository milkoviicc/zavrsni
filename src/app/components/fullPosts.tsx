'use client';
import React, {useState, useEffect} from 'react'
import ResizableTextarea from './ResizableTextarea'
import { Avatar, Flex } from '@radix-ui/themes'
import { Post, User } from '../types/types'
import Image from 'next/image'
import EachPost from './eachPost'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';

const FullPosts = ({user}: {user: User}) => {

      // stateovi

  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [reactionTrigger, setReactionTrigger] = useState(false);
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [postFile, setPostFile] = useState<File[]>([]);
  const [postsState, setPostsState] = useState<'Popular' | 'Your Feed'>('Popular');
  const [hasMore, setHasMore] = useState(true);
    
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handlePostFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      
      // Use the spread operator to append new files without removing previous ones.
      setPostFile((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  
  // async funkcija koja se poziva kada se klikne na gumb 'Send'
  const sendPost = async () => {
    try {
      const formData = new FormData();
      formData.append('Content', content);

      // If there are files, append them to FormData
      postFile.forEach((file) => {
        formData.append(`Files`, file);
      })  

      // šalje se axios post request na API i prenosi se vrijednost content statea, tj. uneseni tekst posta
      const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/add-post`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      // ukoliko je res.status jednak 200 novi post je dodan i vrijednost content statea se ponovno stavlja na empty string tj. ''
      if(res.status === 200) {
        setContent('');
        setPostFile([]);
        setReactionTrigger((prev) => !prev);
      }
    } catch(err) {
        // ukoliko je došlo do greške, ispisuje se u konzoli
        console.error('Could not add post', err);
    }
  }



  const getPosts = async (page: number) => {
      try {
          // šaljem get request i spremam response u varijablu res
          const res = await axios.get<Post[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts?page=${page}`);

          if (res.status === 200) {
            if (page === 0) {
                // If it's the first page, set the posts to the fetched data
                setPosts(res.data);
            } else {
                // If it's not the first page, append the new posts to the existing ones
                setPosts((prevPosts) => [...prevPosts, ...res.data]);
            }
            if (res.data.length === 0) {
            setHasMore(false); // No more posts to load
            }
            return true;
          }
          return false;
      } catch(err) {
          // ukoliko dođe do greške u konzoli će se ispisati ova poruka sa greškom.
          console.error('Could not fetch posts', err);
          return false;
      }
  }

  const getYourFeed = async (page: number) => {
      try {
          const res = await axios.get<Post[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/your-feed?page=${page}`);
          if (res.status === 200) {
            if (page === 0) {
                // If it's the first page, set the posts to the fetched data
                setPosts(res.data);
            } else {
                // If it's not the first page, append the new posts to the existing ones
                setPosts((prevPosts) => [...prevPosts, ...res.data]);
            }
            if (res.data.length === 0) {
            setHasMore(false); // No more posts to load
            }
            return true;
          }
          return false;
      } catch(err) {
          console.error(err);
          return false;
      }
  }

  
  const fetchMoreData = () => {
    if (postsState === 'Popular') {
      getPosts(currentPage + 1);
    } else if (postsState === 'Your Feed') {
      getYourFeed(currentPage + 1);
    }
    setCurrentPage((prevPage) => prevPage + 1);  // Increment page
  };

  
  // async funckija koja se poziva klikom na gumb 'delete'
  const deletePost = async (postId: string) => {
    try {
        // šaljem axios delete request na API sa id-em posta i spremam response u varijablu 'res'
        const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/delete-post/${postId}`);
        
        // ako je res.status jednak 200 znači da je post obrisan i onda mjenjam reactionTrigger state kako bi se postovi re-renderali na stranici.
        if(res.status === 200) {
            setReactionTrigger((prev) => !prev);
        }
    } catch(err) {
        // ukoliko dođe do greške ispisat će se u konzoli
        console.error('Could not delete post: ', err);
    }
}

  useEffect(() => {
      if (posts.length === 0 && currentPage >= 1) {
          setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
  }, [posts, currentPage]);

  // re-rendera se na svakoj promjeni reactionTrigger statea i na svakom pozivu setGetPostsRef
  useEffect(() => {  
      if (postsState === 'Popular') {
          getPosts(currentPage);
      } else if (postsState === 'Your Feed') {
          getYourFeed(currentPage);
      }
  }, [postsState, currentPage, reactionTrigger]);

  useEffect(() => {
      setCurrentPage(0);
  }, [postsState]);

  const handleNextPage = async () => {
      const nextPage = currentPage + 1;
      let hasPosts = false;
  
      if (postsState === 'Popular') {
        hasPosts = await getPosts(nextPage);
      } else if (postsState === 'Your Feed') {
        hasPosts = await getYourFeed(nextPage);
      }
  
      if (hasPosts) {
        setCurrentPage(nextPage);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
      } else {
        alert('There are no more posts on the next page');
      }
    };
  
    const handlePrevPage = () => {
      if (currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
      }
    };


  // async funckija koja se poziva klikom na gumb 'Like' i prima postId
  const handleLike = async (postId: string) => {
      try {

          // pokušavam pronaći post koji je likean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u
          const post = posts.find((post) => post.user.userId === postId);

          // ukoliko se ne uspije pronaći post vraća se tj izlazi iz funkcije.
          if(!post) return;

          // ukoliko je trenutan post likean (1) briše se like axios delete requestom na API
          if(post.userReacted === 1) {
              await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/delete/${postId}`);
          }

          // ukoliko je trenutan post dislikean (-1) mjenja se iz dislike u like axios put requestom na API
          if(post.userReacted === -1) {
              await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/update/${postId}`);
          }

          // ukoliko trenutan post nije ni likean ni dislikean, šalje se axios post request na API sa query vrijednošću 1 kako bi se post likeao
          if (post.userReacted === 0) {
              await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/add/${postId}?reaction=1`);   
          }

          // kada se izvrši jedan od requestova, mjenja se state kako bi se pozvala funkcija getPosts i svi postovi na stranici bi se refreshali
          setReactionTrigger((prev) => !prev);
          
      } catch(err) {
          // ukoliko dođe do greške ispisat će se u konzoli
          console.error(err);
      }
  }

  // async funckija koja se poziva klikom na gumb 'Dislike'
  const handleDislike = async (postId: string) => {
      try {

          // pokušavam pronaći post koji je dislikean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u
          const post = posts.find((post) => post.user.userId === postId);

          // ukoliko se ne uspije pronaći post vraća se tj izlazi iz funkcije.
          if(!post) return;

          // ukoliko je trenutan post likean (1) mjenja se iz likean u dislikean axios put requestom na API
          if(post.userReacted === 1) {
              await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/update/${postId}`);
          }

          // ukoliko je trenutan post dislikean (-1) briše se dislike axios delete requestom na API
          if(post.userReacted === -1) {
              await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/delete/${postId}`);
          }

           // ukoliko trenutan post nije ni likean ni dislikean, šalje se axios post request na API sa query vrijednošću -1 kako bi se post dislikeao
          if (post.userReacted === 0) {
              await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/add/${postId}?reaction=-1`);   
          }

          // kada se izvrši jedan od requestova, mjenja se state kako bi se pozvala funkcija getPosts i svi postovi na stranici bi se refreshali
          setReactionTrigger((prev) => !prev);
      } catch(err) {
          // ukoliko dođe do greške ispisat će se u konzoli
          console.error(err);
      }
  }

  const updatePost = async (postId: string) => {
      return;
  }

  return (
    <div className="border-1 border-gray-900 py-16 h-full flex flex-col items-center gap-12">
        <div className="flex gap-2 items-center flex-col w-fit bg- rounded-full shadow-[1px_1px_2px_0px_rgba(0,_0,_0,_0.3)] bg-[#ededed]">
            <div className="flex flex-row w-fit justify-center items-center gap-4 py-4 px-4">
                <Flex gap="2" className='cursor-pointer'>
                    <Avatar src={`${user.pictureUrl}`} style={{ width: '60px', height: '60px', borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
                </Flex>
                <div className="flex flex-col">
                    <ResizableTextarea placeholder={`What's on your mind, ${user.firstName}`} onChange={(e) =>  setContent(e.target.value)} value={content}   className="font-Roboto font-normal leading-5 scrollbar-none w-[500px] max-h-[150px] text-lg text-[#363636] outline-none py-3 rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-gray-900 bg-transparent transition-all"/>
                    <input type="file" id="file-input" placeholder="a" className="hidden" onChange={handlePostFile} multiple/>
                    <div className="flex flex-col">
                    <label htmlFor="file-input" className="hover:cursor-pointer w-fit text-[#3D3D3D] font-Roboto">Add file <FontAwesomeIcon icon={faPaperclip} className="text-sm"/></label>
                    <span className="block bg-[#424242] w-[75px] h-[1px] -ml-[3px]"></span>
                    </div>
                    <div className="flex items-start">
                        {postFile ? postFile.map((file, index) => (<Image key={index} src={URL.createObjectURL(file)} width={100} height={64} alt="aaaaaaa" className="py-2"/>)) : null}
                        {postFile.length > 0 ? <button className="w-fit px-2" onClick={() => setPostFile([])}>X</button> : null}
                    </div>
                </div>
                <button onClick={() => sendPost()} className="rounded-full w-[100px] bg-[#5D5E5D] text-white mr-4 py-[0.30rem]">Post it</button>
            </div>
        </div>
        <div className="h-full w-full flex flex-col items-center ">
            <hr className="w-full border-[#828282]" />
            <div className="flex gap-4 py-6 items-center">
            <div>
                <button className={`text-2xl text-gray-900 ${postsState === "Popular" ? 'font-medium' : null}`} onClick={() => setPostsState('Popular')}>Popular</button>
                <span className={`${postsState === 'Popular' ? 'block' : 'hidden'} bg-[#424242] w-full h-[2px]`}></span>
            </div>
            <span className="h-10 block border-black bg-black w-[1px]"></span>
            <div>
                <button className={`text-2xl text-gray-900 ${postsState === "Your Feed" ? 'font-medium' : null}`} onClick={() => setPostsState('Your Feed')}>Your Feed</button>
                <span className={`${postsState === 'Your Feed' ? 'block' : 'hidden'} bg-[#424242] w-full h-[1px]`}></span>
            </div>
            
            </div>
            <div className='w-[80%]'>
                {posts.length === 0 ? <h1>There are no posts yet!</h1> : (
                    <InfiniteScroll className='w-full flex flex-col gap-4 bg-transparent px-1' dataLength={posts.length} next={fetchMoreData} hasMore={hasMore} loader={<h1>Loading...</h1>} endMessage={<h1>No more posts!</h1>} scrollThreshold={0.95}>
                        { posts.map((post, index) => (<EachPost key={index} post={post} handleLike={handleLike} handleDislike={handleDislike} deletePost={deletePost} updatePost={updatePost} refreshPosts={() => getPosts(currentPage)}/> ))}
                    </InfiniteScroll>
                )}
            </div>
        </div>
    </div>
  )
}

export default FullPosts;