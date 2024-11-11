import React, {useState, useEffect} from 'react'
import {Flex, Avatar} from '@radix-ui/themes'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Post, User } from '../types/types';
import PostComment from './PostComment';
import EachComment from './eachComment';

const EachPost = ({post, handleLike, handleDislike, deletePost, updatePost, refreshPosts}: {post: Post, handleLike: (postId: string) => void, handleDislike: (postId: string) => void, deletePost: (postId: string) => void, updatePost: (postId: string) => void, refreshPosts: () => void})=> {
  
  // DATUM POSTA

  // spremam preneseni datum u varijable
  const timestamp = post.createdOn;
  const fullDate = new Date(post.createdOn);
  const justDate = fullDate.toLocaleString('en-us', {year: 'numeric', month: 'short', day:'numeric'});
  
  // pretvaram datum u Date objekt
  const pastDate = new Date(timestamp);

  // dobivam trenutan datum i vrijeme
  const currentDate = new Date();

  // računam razliku između trenutnog i prenesenog vremena u ms
  const differenceMs = currentDate.getTime() - pastDate.getTime();

  // pretvaram milisekunde u sekunde
  const totalSeconds = Math.floor(differenceMs / 1000);

  // računam dane, sate, minute i sekunde
  const days = Math.floor(totalSeconds / 86400); // 86400 seconds in a day
  const hours = Math.floor((totalSeconds % 86400) / 3600); // Remaining seconds converted to hours
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining seconds converted to minutes
  const seconds = totalSeconds % 60; // Remaining seconds after full minutes  

  // dobivam usera iz localStorage-a
  const user = localStorage.getItem('user');

  // state za prikazivanje Delete i Update gumbova
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  
  useEffect(() => {

    // svaki put kad se korisnik dobije iz localstoragea i post.userProfile.id promjeni, re-rendera se sve.

    // ako korisnik postoji ulazi u {}, ako ne ništa se ne dešava
    if(user) {

      // spremam podatke korisnika iz localstoragea u varijablu userData za daljnje provjere. 
      const userData: User = JSON.parse(user);
  
      // ako je id korisnika koji je objavio post jednak trenutnom korisniku state se stavlja na true kako bi se gumb 'Delete' prikazao, inače na false kako se ne bi prikazao
      if(post.userProfile.id === userData.id) {
        setShowDelete(true);
        setShowUpdate(true);
      } else {
        setShowDelete(false);
        setShowUpdate(false);
      }
    }

  }, [user, post.userProfile.id]);  

  const handleCommentLike = async (commentId: string) => {
    try {

        // pokušavam pronaći post koji je likean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u
        const comment = post.comments.find((comment) => comment.id === commentId);

        // ukoliko se ne uspije pronaći post vraća se tj izlazi iz funkcije.
        if(!comment) return;

        // ukoliko je trenutan post likean (1) briše se like axios delete requestom na API
        if(comment.userReacted === 1) {
            await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/comments/delete/${commentId}`);
        }

        // ukoliko je trenutan post dislikean (-1) mjenja se iz dislike u like axios put requestom na API
        if(comment.userReacted === -1) {
            await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/comments/update/${commentId}`);
        }

        // ukoliko trenutan post nije ni likean ni dislikean, šalje se axios post request na API sa query vrijednošću 1 kako bi se post likeao
        if (comment.userReacted === 0) {
            await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/comments/add/${commentId}?reaction=1`);   
        }

        refreshPosts();
        
    } catch(err) {
        // ukoliko dođe do greške ispisat će se u konzoli
        console.error(err);
    }
  }
  // async funckija koja se poziva klikom na gumb 'Dislike'
  const handleCommentDislike = async (commentId: string) => {
    try {

        // pokušavam pronaći post koji je dislikean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u
        const comment = post.comments.find((comment) => comment.id === commentId);

        // ukoliko se ne uspije pronaći post vraća se tj izlazi iz funkcije.
        if(!comment) return;

        // ukoliko je trenutan post likean (1) mjenja se iz likean u dislikean axios put requestom na API
        if(comment.userReacted === 1) {
            await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/comments/update/${commentId}`);
        }

        // ukoliko je trenutan post dislikean (-1) briše se dislike axios delete requestom na API
        if(comment.userReacted === -1) {
            await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/comments/delete/${commentId}`);
        }

         // ukoliko trenutan post nije ni likean ni dislikean, šalje se axios post request na API sa query vrijednošću -1 kako bi se post dislikeao
        if (comment.userReacted === 0) {
            await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/comments/add/${commentId}?reaction=-1`);   
        }

        refreshPosts();
    } catch(err) {
        // ukoliko dođe do greške ispisat će se u konzoli
        console.error(err);
    }
  }

  // async funckija koja se poziva klikom na gumb 'delete'
  const deleteComment = async (commentId: string) => {
    try {
        // šaljem axios delete request na API sa id-em posta i spremam response u varijablu 'res'
        const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/comments/delete/${commentId}`);
        
        // ako je res.status jednak 200 znači da je post obrisan i onda mjenjam reactionTrigger state kako bi se postovi re-renderali na stranici.
        if(res.status === 200) {
            refreshPosts();
        }
    } catch(err) {
        // ukoliko dođe do greške ispisat će se u konzoli
        console.error('Could not delete post: ', err);
    }
  } 

  const updateComment = async (commentId: string) => {
      return;
  }


  return (
    <div className="my-2 w-[30%] max-w-xl h-fit flex flex-col gap-2 bg-gray-900 text-white px-1 py-2 rounded-md overflow-hidden">
      <div className="flex gap-2 flex-1">
        <div>
          <Flex gap="2">
            <Avatar src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" fallback="A" />
          </Flex>
        </div>
        <div className="w-full flex flex-1 flex-col justify-between">
          <div className="flex gap-2 items-center">
            <h1 className="text-base uppercase font-Kaisei">{post.userProfile.username}</h1>
            <p className="text-sm text-gray-500">
              {days >= 1 ? justDate : days <= 0 && hours > 0 && minutes <= 60 ? `${hours}h ago` : days < 1 && hours <= 24 && minutes <= 60 && minutes >= 1 ? `${minutes}m ago` : "Just now"}
            </p>
          </div>
          <p className="py-2 max-w-full break-words">{post.content}</p>
          <div className="flex gap-4 py-4 items-center justify-between">
            <div className="flex gap-3">
              <FontAwesomeIcon
                icon={faThumbsUp}
                className={`text-2xl hover:cursor-pointer hover:text-blue-600 transition-all ${post.userReacted === 1 ? "text-blue-600" : ""}`}
                onClick={() => handleLike(post.id)}
              />
              <p>{post.likes}</p>
              <FontAwesomeIcon
                icon={faThumbsDown}
                className={`text-2xl hover:cursor-pointer hover:text-blue-600 transition-all ${post.userReacted === -1 ? "text-blue-600" : ""}`}
                onClick={() => handleDislike(post.id)}
              />
              <p>{post.dislikes}</p>
            </div>
            <div className="flex gap-4 pr-4">
              {showUpdate && (
                <button className="text-sm" onClick={() => updatePost(post.id)}>
                  <FontAwesomeIcon icon={faPen} className="text-xl" />
                </button>
              )}
              {showDelete && (
                <button className="text-sm" onClick={() => deletePost(post.id)}>
                  <FontAwesomeIcon icon={faTrash} className="text-xl" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <PostComment postId={post.id} refreshPosts={refreshPosts}/>
      <div>
        {post.comments.length > 0 ? post.comments.map((comment, index) => (
          <EachComment key={index} post={post} comment={comment} handleLike={handleCommentLike} handleDislike={handleCommentDislike} deleteComment={deleteComment} updateComment={updateComment}/>
        )) : null}
      </div>
    </div>
  )
}

export default EachPost