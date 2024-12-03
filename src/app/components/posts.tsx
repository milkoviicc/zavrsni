'use client';

import React, { useEffect, useState } from 'react'

import axios from 'axios';
import { Post, User } from '@/src/app/types/types';

import EachPost from './eachPost';

const Posts = ({setGetPostsRef, postsState}: {setGetPostsRef: (fn: () => void) => void, postsState: string}) => {

    // stateovi

    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [reactionTrigger, setReactionTrigger] = useState(false);

    const getPosts = async (page: number) => {
        try {
            // šaljem get request i spremam response u varijablu res
            const res = await axios.get<Post[]>(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts?page=${page}`);

            // ako je res.status jednak 200 znači kako sam uspio dobiti sve postove
            if(res.status === 200 && res.data.length > 0) {
                // spremam res.data u posts state tipa Post[], a pošto je res.data array objekata, spremam sve postove (objekte) u array 'posts'
                setPosts(res.data);
                console.log('Fetched posts:', res.data); // Log the fetched posts
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
            if(res.status === 200 && res.data.length > 0) {
                setPosts(res.data);
                console.log('Fetched posts:', res.data); // Log the fetched posts
                return true;
            }
            return false;
        } catch(err) {
            console.error(err);
            return false;
        }
    }

    useEffect(() => {
        if (posts.length === 0 && currentPage >= 1) {
            setCurrentPage((prev) => Math.max(prev - 1, 0));
            alert('There are no more posts');
        }
    }, [posts, currentPage]);

    // re-rendera se na svakoj promjeni reactionTrigger statea i na svakom pozivu setGetPostsRef
    useEffect(() => {
        setGetPostsRef(() => {
            return postsState === 'Popular' ? () => getPosts(currentPage) : () => getYourFeed(currentPage);
        });
    
        if (postsState === 'Popular') {
            getPosts(currentPage);
        } else if (postsState === 'Your Feed') {
            getYourFeed(currentPage);
        }
    }, [reactionTrigger, setGetPostsRef, postsState, currentPage]);

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
            const post = posts.find((post) => post.id === postId);

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
            const post = posts.find((post) => post.id === postId);

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


    // async funckija koja se poziva klikom na gumb 'delete'
    const deletePost = async (postId: string) => {
        try {
            // šaljem axios delete request na API sa id-em posta i spremam response u varijablu 'res'
            const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/delete-post/${postId}`);
            
            // ako je res.status jednak 200 znači da je post obrisan i onda mjenjam reactionTrigger state kako bi se postovi re-renderali na stranici.
            if(res.status === 200) {
                setReactionTrigger((prev) => !prev);
                await getPosts(currentPage);
            }
        } catch(err) {
            // ukoliko dođe do greške ispisat će se u konzoli
            console.error('Could not delete post: ', err);
        }
    }

    const updatePost = async (postId: string) => {
        return;
    }
    

  return (
    <div className='w-full flex flex-col items-center gap-4 bg-transparent'>
        {posts.length > 0 ? posts?.map((post, index) => (<EachPost key={index} post={post} handleLike={handleLike} handleDislike={handleDislike} deletePost={deletePost} updatePost={updatePost} refreshPosts={() => getPosts(currentPage)}/>)) : posts.length === 0 ? <h1>There are no posts yet!</h1> : <h1>Loading...</h1>}
        {posts.length != 0 ? (
            <div>
                <button className="w-fit px-10" onClick={handlePrevPage} disabled={currentPage === 0}>Previous</button>
                <button className="w-fit px-10" onClick={handleNextPage}>Next</button>
            </div>
        ) : null }
    </div>
  )
}

export default Posts