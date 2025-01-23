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
  const [postsState, setPostsState] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
    
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
      });

      // šalje se axios post request na API i prenosi se vrijednost content statea, tj. uneseni tekst posta
      const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/add-post`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      // ukoliko je res.status jednak 200 novi post je dodan i vrijednost content statea se ponovno stavlja na empty string tj. ''
      if(res.status === 200) {
        setContent('');
        setPostFile([]);
        const newPost: Post = res.data;
        setPosts((prev) => [...prev, newPost]);
      }
    } catch(err) {
        // ukoliko je došlo do greške, ispisuje se u konzoli
        console.error('Could not add post', err);
    }
  }



  const getPosts = async (page: number) => {
    try {
      setLoading(true);
      const res = await axios.get<Post[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/popular-feed?page=${page}`);

      if (res.status === 200) {
        if (page === 0) {
          setPosts(res.data);
        } else {
          // Dodajem nove postove trenutnima i pazim da se ne bi postovi ponavljali
          setPosts((prevPosts) => {
            const newPosts = res.data.filter((newPost) => !prevPosts.some((existingPost) => existingPost.postId === newPost.postId));
            return [...prevPosts, ...newPosts];
          });
        }

        if (res.data.length === 0) {
          setHasMore(false);
        }
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err) {
      console.error('Could not fetch posts', err);
      return false;
    }
  };
  
  const getYourFeed = async (page: number) => {
    try {
      setLoading(true);
      const res = await axios.get<Post[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/your-feed?page=${page}`);

      if (res.status === 200) {
        if (page === 0) {
          setPosts(res.data);
        } else {
          setPosts((prevPosts) => {
            const newPosts = res.data.filter((newPost) => !prevPosts.some((existingPost) => existingPost.postId === newPost.postId));
            return [...prevPosts, ...newPosts];
          });
        }

        if (res.data.length === 0) {
          setHasMore(false);
        }
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };


  
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
          if (res.status === 200) {
              // Izbacujem obrisani post
              setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
          }
      } catch(err) {
          // ukoliko dođe do greške ispisat će se u konzoli
          console.error('Could not delete post: ', err);
      }
  }
  

  useEffect(() => {
    const feedState = localStorage.getItem('feed');
    if(feedState) {
      setPostsState(feedState); 
    }
  }, [])

  useEffect(() => {
    handleFeedState(postsState);
  }, [postsState])

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

  // async funckija koja se poziva klikom na gumb 'Like' i prima postId
  const handleLike = async (postId: string) => {
      try {

          // pokušavam pronaći post koji je likean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u
          const post = posts.find((post) => post.postId === postId);

          // ukoliko se ne uspije pronaći post vraća se tj izlazi iz funkcije.
          if(!post) return;

          // ukoliko je trenutan post likean (1) briše se like axios delete requestom na API
          if(post.userReacted === 1) {
              post.userReacted = 0;
              await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/delete/${postId}`);
              return;
          }

          // ukoliko je trenutan post dislikean (-1) mjenja se iz dislike u like axios put requestom na API
          if(post.userReacted === -1) {
              post.userReacted = 1;
              await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/update/${postId}`);
              return;
          }

          // ukoliko trenutan post nije ni likean ni dislikean, šalje se axios post request na API sa query vrijednošću 1 kako bi se post likeao
          if (post.userReacted === 0) {
              post.userReacted = 1;
              await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/add/${postId}?reaction=1`);   
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
              await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/update/${postId}`);
              return;
          }

          // ukoliko je trenutan post dislikean (-1) briše se dislike axios delete requestom na API
          if(post.userReacted === -1) {
              post.userReacted = 0;
              await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/delete/${postId}`);
              return;
          }

           // ukoliko trenutan post nije ni likean ni dislikean, šalje se axios post request na API sa query vrijednošću -1 kako bi se post dislikeao
          if (post.userReacted === 0) {
              post.userReacted = -1;
              await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/posts/add/${postId}?reaction=-1`);
              return;
          }

      } catch(err) {
          // ukoliko dođe do greške ispisat će se u konzoli
          console.error(err);
      }
  }

  const convertUrlsToFiles = async (urls: string[]): Promise<File[]> => {
    const filePromises = urls.map(async (url) => {
      // Fetch the file from the URL (which is a Blob URL)
      const response = await fetch(url);
      const blob = await response.blob();
  
      // Optionally, you can define a name or use the original file name if available
      const fileName = "file" + Math.random();  // Replace with actual file name if you have it
  
      // Create a File object from the Blob
      const file = new File([blob], fileName, { type: blob.type });
      return file;
    });
  
    // Wait for all promises to resolve and return the array of File objects
    return await Promise.all(filePromises);
  };



  const updatePost = async (postId: string, updatedContent: string, updatedFiles: string[]) => {
      try {

          const formData = new FormData();
          formData.append('Content', updatedContent);

          const files = await convertUrlsToFiles(updatedFiles);

          // If there are files, append them to FormData
          files.forEach((file) => {
            formData.append(`Files`, file);
          });

          const res = await axios.put<Post>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/update-post/${postId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

          const updatedPost = posts.find((post) => post.postId === postId);

          if(!updatedPost) return null;

          updatedPost.content = res.data.content;
          updatedPost.fileUrls= res.data.fileUrls;

          setReactionTrigger((prev) => !prev);
          
          window.location.reload();
          
      } catch(err) {
        console.error(err);
      }
  }
  
  const [randomNmbs, setRandomNmbs] = useState<number[]>();
  
  useEffect(() => {
    const max: number = 10;
    const newRandomNms: number[] = [];
    for(let i = 1; i <= 5; i++) {
      let nmb = Math.floor(Math.random() * max);
      while(nmb === 0 || newRandomNms.includes(nmb)) {
        nmb = Math.floor(Math.random() * max);
      }

      newRandomNms.push(nmb);    
    }
    newRandomNms.sort((a, b) => a - b);
    setRandomNmbs(newRandomNms);
  }, []);


  const handleFeedState = (feedState: string) => {
    const currentFeed = localStorage.getItem('feed');
    if(currentFeed === 'Popular' && feedState === 'Popular') {
      return;
    } else if (currentFeed === 'Popular' && feedState === 'Your Feed') {
      localStorage.setItem('feed', 'Your Feed');
      setReactionTrigger((prev) => !prev);
    } else if (currentFeed === 'Your Feed' && feedState === 'Popular') {
      localStorage.setItem('feed', 'Popular');
      setReactionTrigger((prev) => !prev);
    } else if (currentFeed === 'Your Feed' && feedState === 'Your Feed') {
      return;
    }
  }

  return (
    <div className="border-1 border-gray-900 py-16 h-full flex flex-col items-center gap-12">
        <div className="flex gap-2 items-center flex-col w-fit bg- rounded-full shadow-[1px_1px_2px_0px_rgba(0,_0,_0,_0.3)] bg-[#363636]">
            <div className="flex flex-row w-fit justify-center items-center gap-4 py-4 px-4">
                <Flex gap="2" className='cursor-pointer'>
                    <Avatar src={`${user.pictureUrl}`} style={{ width: '60px', height: '60px', borderRadius: '50%', boxShadow: '0px 3.08px 3.08px 0px #00000040'}} fallback="A" />
                </Flex>
                <div className="flex flex-col">
                    <ResizableTextarea placeholder={`What's on your mind, ${user.firstName}`} onChange={(e) =>  setContent(e.target.value)} value={content}   className="font-Roboto font-normal leading-5 scrollbar-none w-[500px] max-h-[150px] text-lg text-[#fff] outline-none py-3 rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
                    <input type="file" id="file-input" placeholder="a" className="hidden" onChange={handlePostFile} multiple/>
                    <div className="flex flex-col">
                    <label htmlFor="file-input" className="hover:cursor-pointer w-fit text-[#CCCCCC] font-Roboto">Add file <FontAwesomeIcon icon={faPaperclip} className="text-sm"/></label>
                    <span className="block bg-[#CCCCCC] w-[75px] h-[1px] -ml-[3px]"></span>
                    </div>
                    <div className="flex items-start">
                        {postFile ? postFile.map((file, index) => (
                          <div key={index} className='w-fit relative'>
                            <Image key={index} src={URL.createObjectURL(file)} width={100} height={64} alt="aaaaaaa" className="py-2 opacity-80"/>
                            <button className="absolute text-white top-2 right-2" onClick={() => setPostFile(postFile.filter((_, postIndex) => postIndex != index))}>X</button>
                          </div>
                          )) : null}
                    </div>
                </div>
                <button onClick={() => sendPost()} className="rounded-full w-[100px] bg-[#5D5E5D] text-white mr-4 py-[0.30rem]">Post it</button>
            </div>
        </div>
        <div className="h-full w-full flex flex-col items-center">
            <div className="flex gap-4 py-6 items-center">
            <div>
                <button className={`text-2xl text-[#8A8A8A] ${postsState === "Popular" ? 'font-medium text-[#EFEFEF]' : null}`} onClick={() => setPostsState('Popular')}>Popular</button>
                <span className={`${postsState === 'Popular' ? 'block bg-[#EFEFEF]' : 'hidden'} w-full h-[2px]`}></span>
            </div>
            <span className="h-10 block border-black bg-[#8A8A8A] w-[1px]"></span>
            <div>
                <button className={`text-2xl text-[#8A8A8A] ${postsState === "Your Feed" ? 'font-medium text-[#EFEFEF]' : null}`} onClick={() => setPostsState('Your Feed')}>Your Feed</button>
                <span className={`${postsState === 'Your Feed' ? 'block bg-[#EFEFEF]' : 'hidden'} w-full h-[1px]`}></span>
            </div>
            
            </div>
            <div className='w-full flex justify-center'>
                {posts.length === 0 && loading === false ? <h1>There are no posts yet!</h1> : posts.length === 0 && loading ? <h1>Loading posts...</h1> : (
                    <InfiniteScroll className='w-full flex flex-col bg-transparent px-1' dataLength={posts.length} next={fetchMoreData} hasMore={hasMore} loader={<h1>Loading...</h1>} endMessage={<h1>No more posts!</h1>} scrollThreshold={1}>
                        { posts.map((post, index) => (
                          <div key={index}>
                            {randomNmbs?.includes(index) ? <h1>bok</h1> : null}
                            <EachPost key={index} post={post} handleLike={handleLike} handleDislike={handleDislike} deletePost={deletePost} updatePost={updatePost} refreshPosts={() => handleFeedState}/>
                          </div>
                          
                          )
                        )}
                    </InfiniteScroll>
                )}
            </div>
        </div>
    </div>
  )
}

export default FullPosts;