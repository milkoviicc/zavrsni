import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Flex } from '@radix-ui/themes'
import React, {useEffect, useState} from 'react'
import { Post, Comment, User } from '../types/types'
import { faPen, faThumbsDown, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons'

const EachComment = ({post, comment, handleLike, handleDislike, deleteComment, updateComment}: {post: Post, comment: Comment, handleLike: (postId: string) => void, handleDislike: (postId: string) => void, deleteComment: (postId: string) => void, updateComment: (postId: string) => void})=> {

    const commentDate = comment.createdOn;

    const commentFullDate = new Date(comment.createdOn);
    const justCommentDate = commentFullDate.toLocaleString('en-us', {year: 'numeric', month: 'short', day:'numeric'});
    
    // pretvaram datum u Date objekt
    const pastCommentDate = new Date(commentDate);

    const currentDate = new Date();

    // računam razliku između trenutnog i prenesenog vremena u ms
    const commentDifferenceMs = currentDate.getTime() - pastCommentDate.getTime();

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
        if(comment.userProfile.id === userData.id) {
          setShowDelete(true);
          setShowUpdate(true);
        } else {
          setShowDelete(false);
          setShowUpdate(false);
        }
      }
  
    }, [user, comment.userProfile.id]);

  return (
    <div className="flex gap-2 flex-1">
      <div>
        <Flex gap="2">
          <Avatar src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" style={{ width: '40px', height: '40px', borderRadius: '25px'}} fallback="A" />
        </Flex>
      </div>
      <div className="w-full flex flex-1 flex-col justify-between">
        <div className="flex gap-2 items-center">
          <h1 className="text-base uppercase font-Kaisei">{comment.userProfile.username}</h1>
          <p className="text-sm text-gray-500">
            {commentDays >= 1 ? justCommentDate : commentDays <= 0 && commentHours > 0 && commentMinutes <= 60 ? `${commentHours}h ago` : commentDays < 1 && commentHours <= 24 && commentMinutes <= 60 && commentMinutes >= 1 ? `${commentMinutes}m ago` : "Just now"}
          </p>
        </div>
        <p className="py-2 max-w-full break-words">{comment.content}</p>
        <div className="flex gap-4 py-4 items-center justify-between">
          <div className="flex gap-3">
            <FontAwesomeIcon
              icon={faThumbsUp}
              className={`text-2xl hover:cursor-pointer hover:text-blue-600 transition-all ${comment.userReacted === 1 ? "text-blue-600" : ""}`}
              onClick={() => handleLike(comment.id)}
            />
            <p>{comment.likes}</p>
            <FontAwesomeIcon
              icon={faThumbsDown}
              className={`text-2xl hover:cursor-pointer hover:text-blue-600 transition-all ${comment.userReacted === -1 ? "text-blue-600" : ""}`}
              onClick={() => handleDislike(comment.id)}
            />
            <p>{comment.dislikes}</p>
          </div>
          <div className="flex gap-4 pr-4">
            {showUpdate && (
              <button className="text-sm" onClick={() => updateComment(comment.id)}>
                <FontAwesomeIcon icon={faPen} className="text-xl" />
              </button>
            )}
            {showDelete && (
              <button className="text-sm" onClick={() => deleteComment(comment.id)}>
                <FontAwesomeIcon icon={faTrash} className="text-xl" />
              </button>
            )}
          </div>
      </div>
    </div>
  </div>
  )
}

export default EachComment;