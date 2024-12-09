import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Flex } from '@radix-ui/themes'
import React, {useEffect, useState} from 'react'
import { Post, Comment, User } from '../types/types'
import { faDownLong, faPen, faThumbsDown, faThumbsUp, faTrash, faUpLong } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const EachComment = ({post, comment, refreshComments}: {post: Post, comment: Comment, refreshComments: () => void })=> {

    const commentDate = comment.createdOn;

    // pretvaram datum u Date objekt
    const commentFullDate = new Date(commentDate);
    commentFullDate.setUTCHours(commentFullDate.getUTCHours()+1);
    const justCommentDate = commentFullDate.toLocaleString('en-us', {year: 'numeric', month: 'short', day:'numeric'});

    const currentDate = new Date();

    // računam razliku između trenutnog i prenesenog vremena u ms
    const commentDifferenceMs = currentDate.getTime() - commentFullDate.getTime();

    // pretvaram milisekunde u sekunde
    const totalCommentSeconds = Math.floor(commentDifferenceMs / 1000);

    // računam dane, sate, minute i sekunde
    const commentDays = Math.floor(totalCommentSeconds / 86400); // 86400 seconds in a day
    const commentHours = Math.floor((totalCommentSeconds % 86400) / 3600); // Remaining seconds converted to hours
    const commentMinutes = Math.floor((totalCommentSeconds % 3600) / 60); // Remaining seconds converted to minutes
    const commentSeconds = totalCommentSeconds % 60; // Remaining seconds after full minutes  

    const user = localStorage.getItem('user');

    const [showDelete, setShowDelete] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    useEffect(() => {

      // svaki put kad se korisnik dobije iz localstoragea i post.userProfile.id promjeni, re-rendera se sve.
  
      // ako korisnik postoji ulazi u {}, ako ne ništa se ne dešava
      if(user) {
  
        // spremam podatke korisnika iz localstoragea u varijablu userData za daljnje provjere. 
        const userData: User = JSON.parse(user);
    
        // ako je id korisnika koji je objavio post jednak trenutnom korisniku state se stavlja na true kako bi se gumb 'Delete' prikazao, inače na false kako se ne bi prikazao
        if(comment.user.userId === userData.userId) {
          setShowDelete(true);
          setShowUpdate(true);
        } else {
          setShowDelete(false);
          setShowUpdate(false);
        }
      }

     
    }, [user, comment.user.userId]);

    const handleCommentLike = async (commentId: string) => {
      try {
  
          // pokušavam pronaći post koji je likean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u

          console.log(comment.content);
  
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
  
          refreshComments();
          
      } catch(err) {
          // ukoliko dođe do greške ispisat će se u konzoli
          console.error(err);
      }
    }
    // async funckija koja se poziva klikom na gumb 'Dislike'
    const handleCommentDislike = async (commentId: string) => {
      try {
  
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
  
          refreshComments();
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
            refreshComments();
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
    <div className='py-2 flex-col'>
      <div className='flex flex-row'>
        <Flex gap="2" className='items-center w-fit'>
          <Avatar src={`${comment.user.pictureUrl}?${new Date().getTime()}`} style={{ width: '40px', height: '40px', borderRadius: '25px'}} fallback="A" />
        </Flex>
        <div className="flex flex-col px-4 w-full">
          <div className='flex justify-between'>
            <div className='flex gap-2 items-center'>
              <h1 className="text-base font-Roboto">{comment.user.firstName} {comment.user.lastName}</h1>
              <p className="text-sm text-gray-500">
                {commentDays >= 1 ? justCommentDate : commentDays <= 0 && commentHours > 0 && commentMinutes <= 60 ? `${commentHours}h ago` : commentDays < 1 && commentHours <= 24 && commentMinutes <= 60 && commentMinutes >= 1 ? `${commentMinutes}m ago` : "Just now"}
              </p>
            </div>
            <div>
              {showUpdate && (
                <button className="text-sm">
                  <FontAwesomeIcon icon={faPen} className="text-xl" />
                </button>
              )}
              {showDelete && (
                <button className="text-sm px-2">
                  <FontAwesomeIcon icon={faTrash} className="text-xl" onClick={(() => deleteComment(comment.commentId))}/>
                </button>
              )}
            </div>
          </div>
          <p className='text-sm font-Roboto text-[#656565]'>@{comment.user.username}</p>
        </div>
       </div>
      <p className='py-4 max-w-full break-all pr-4'>{comment.content}</p>
      <div className='flex gap-2'>
        <button onClick={() => handleCommentLike(comment.commentId)}><svg width="20" height="20" viewBox="0 0 7 7" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_57_98)"><path d="M0.0175432 3.20833L2.87879 0.259583C3.04796 0.0904165 3.26963 -1.62297e-07 3.50296 -1.52097e-07C3.73629 -1.41898e-07 3.95796 0.0904165 4.12129 0.256667L6.98254 3.20833L4.96129 3.20833L4.96129 7L2.04463 7L2.04463 3.20833L0.0175432 3.20833Z" fill={`${comment.userReacted === 1  ? '#319357' : '#585858'}`}/></g><defs><clipPath id="clip0_57_98"><rect width="7" height="7" fill="white" transform="translate(7) rotate(90)"/></clipPath></defs></svg></button>
        <p className={`${post.userReacted === 1  ? 'text-[#319357]' : 'text-[#585858]'}`}>{comment.likes}</p>
        <button onClick={() => handleCommentDislike(comment.commentId)}><svg width="20" height="20" viewBox="0 0 7 7" xmlns="http://www.w3.org/2000/svg"><g id="Layer_1" clipPath="url(#clip0_57_85)"><path id="Vector" d="M6.98246 3.79167L4.12121 6.74042C3.95204 6.90958 3.73037 7 3.49704 7C3.26371 7 3.04204 6.90958 2.87871 6.74333L0.0174562 3.79167L2.03871 3.79167L2.03871 -3.88486e-07L4.95537 -2.60994e-07L4.95537 3.79167L6.98246 3.79167Z" fill={`${comment.userReacted === -1  ? '#D25551' : '#585858'}`}/></g><defs><clipPath id="clip0_57_85"><rect width="7" height="7" fill="white" transform="translate(0 7) rotate(-90)"/></clipPath></defs></svg></button>
        <p className={`${post.userReacted === -1  ? 'text-[#D25551]' : 'text-[#585858]'}`}>{comment.dislikes}</p>
      </div>
    </div>
  )
}

export default EachComment;