'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, {useEffect, useState} from 'react'
import { Post, Comment, User, Reply } from '../types/types'
import { faDownLong, faPen, faThumbsDown, faThumbsUp, faTrash, faUpLong } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/src/components/ui/dialog';
import { useRouter } from 'next/navigation'
import ResizableTextarea from './ResizableTextarea'
import EachReply from './eachReply'
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { useAuth } from '../context/AuthProvider';
import { Popover } from "@radix-ui/react-popover"
import { Command, CommandGroup, CommandItem, CommandList } from '@/src/components/ui/command';
import { EllipsisIcon, Pencil, Trash2 } from 'lucide-react';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { useToast } from '@/hooks/use-toast';
import {Button as HeroUiBtn} from "@heroui/button";

const EachComment = ({post, comment, refreshComments, updateComment, callComments}: {post: Post, comment: Comment, refreshComments: () => void, updateComment: (commentId: string, newContent: string) => void, callComments: React.Dispatch<React.SetStateAction<boolean>>})=> {

    const commentDate = comment.createdOn;

    // pretvaram datum u Date objekt
    const commentFullDate = new Date(commentDate);
    commentFullDate.setUTCHours(commentFullDate.getUTCHours());
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

    const [showDelete, setShowDelete] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [updatedFiles, setUpdatedFiles] = useState<File[]>([]);
    const [previousFiles, setPreviousFiles] = useState<string[]>([]);
    const [updatedContent, setUpdatedContent] = useState('');
    const [finishedUpdating, setFinishedUpdating] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [commentReplies, setCommentReplies] = useState<Reply[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [commentReaction, setCommentReaction] = useState<number>(comment.userReacted);
    const [commentLikes, setCommentLikes] = useState(comment.likes);
    const [commentDislikes, setCommentDislikes] = useState(comment.dislikes);
    const [replyFinished, setReplyFinished] = useState(false);
    const [isUpdateCommentDialogOpen, setIsUpdateCommentDialogOpen] = useState(false);
    const [isCommentReplyDialogOpen, setIsCommentReplyDialogOpen] = useState(false);

    const {toast} = useToast();

    const user = localStorage.getItem('user');
    const router = useRouter();
    const role = localStorage.getItem('role');

    useEffect(() => {

      // svaki put kad se korisnik dobije iz localstoragea i post.userProfile.id promjeni, re-rendera se sve.
  
      // ako korisnik postoji ulazi u {}, ako ne ništa se ne dešava
      if(user) {
        const userData: User = JSON.parse(user);
        // ako je id korisnika koji je objavio post jednak trenutnom korisniku state se stavlja na true kako bi se gumb 'Delete' prikazao, inače na false kako se ne bi prikazao
        if(comment.user.userId === userData.userId || post.user.userId === userData.userId || role === "admin") {
          setShowDelete(true);
          setShowUpdate(true);
          setShowReply(true);
        } else {
          setShowDelete(false);
          setShowUpdate(false);
          setShowReply(false);
        }
      }
    }, [user, comment.user.userId, comment, post.user.userId]);

    useEffect(() => {
      setCommentReplies(comment.replies);
    }, [comment.replies]);

    const handleCommentLike = async (commentId: string) => {
      try {

          // pokušavam pronaći post koji je likean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u

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
            callComments(true);
            post.commentCount--;
          }
      } catch(err) {
          // ukoliko dođe do greške ispisat će se u konzoli
          console.error('Could not delete post: ', err);
      }
    } 

    const deleteReply = async (replyId: string) => {
      try {
        // šaljem axios delete request na API sa id-em posta i spremam response u varijablu 'res'
        const res = await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/comments/delete/${replyId}`);
        
        // ako je res.status jednak 200 znači da je post obrisan i onda mjenjam reactionTrigger state kako bi se postovi re-renderali na stranici.
        if(res.status === 200) {
          refreshComments();
          callComments(true);
        }
    } catch(err) {
        // ukoliko dođe do greške ispisat će se u konzoli
        console.error('Could not delete post: ', err);
    }
    }
  
    const handleUpdate = () => {
      setUpdatedContent(comment.content);
    }

    const update = async () => {
      if(comment.content === updatedContent) {
        toast({description: "You must change text to update your comment", duration: 1500, style:{backgroundColor: "#CA3C3C"}});
        return;
      }
      updateComment(comment.commentId, updatedContent);
      setIsUpdateCommentDialogOpen(false);
    }

    const handleReply = async (replyContent: string) => {
      if(replyContent === '') {
        toast({description: "Text is required!", duration: 1500, style: {backgroundColor: "#CA3C3C"}});
        return;
      }
      try {
          const res = await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/comments/add-reply/${comment.commentId}`, {content: replyContent});
          if(res.status === 200) {
            const newReply: Reply = res.data;
            setCommentReplies((prev) => [...prev, newReply]);
            toast({description: "Reply successfully posted.", duration: 1500, style: {backgroundColor: "#1565CE"}});
            callComments(true);
          }
          setReplyContent('');
          setIsCommentReplyDialogOpen(false);
          refreshComments();
      } catch(err) {
        console.error(err);
      }
    }

    const handleReplyLike = async (commentReplyId: string) => {
      try {
        // pokušavam pronaći post koji je likean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u
        const reply = comment.replies.find((reply) => reply.commentReplyId === commentReplyId);

        // ukoliko se ne uspije pronaći post vraća se tj izlazi iz funkcije.
        if(!reply) return;

        // ukoliko je trenutan post likean (1) briše se like axios delete requestom na API
        if(reply.userReacted === 1) {
            await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/comments/delete/${commentReplyId}`);
        }

        // ukoliko je trenutan post dislikean (-1) mjenja se iz dislike u like axios put requestom na API
        if(reply.userReacted === -1) {
            await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/comments/update/${commentReplyId}`);
        }

        // ukoliko trenutan post nije ni likean ni dislikean, šalje se axios post request na API sa query vrijednošću 1 kako bi se post likeao
        if (reply.userReacted === 0) {
            await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/comments/add/${commentReplyId}?reaction=1`);   
        }

        refreshComments();

      } catch(err) {
        console.error(err);
      }
    }

    const handleReplyDislike = async (commentReplyId: string) => {
      try {
        // pokušavam pronaći post koji je dislikean tako što prolazim kroz sve postove i pronalazim koji post.id je jednak primljenom postId-u
        const reply = comment.replies.find((reply) => reply.commentReplyId === commentReplyId);

        // ukoliko se ne uspije pronaći post vraća se tj izlazi iz funkcije.
        if(!reply) return;

        // ukoliko je trenutan post likean (1) mjenja se iz likean u dislikean axios put requestom na API
        if(reply.userReacted === 1) {
            await axios.put(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/comments/update/${commentReplyId}`);
        }

        // ukoliko je trenutan post dislikean (-1) briše se dislike axios delete requestom na API
        if(reply.userReacted === -1) {
            await axios.delete(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/comments/delete/${commentReplyId}`);
        }

         // ukoliko trenutan post nije ni likean ni dislikean, šalje se axios post request na API sa query vrijednošću -1 kako bi se post dislikeao
        if (reply.userReacted === 0) {
            await axios.post(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/reactions/comments/add/${commentReplyId}?reaction=-1`);   
        }

        refreshComments();
      } catch(err) {
        console.error(err);
      }
    }

    const [tajmout, setTajmout] = useState<number | NodeJS.Timeout>();
    
    const handleReaction = async (reaction: number) => {
      clearTimeout(tajmout);
      setTajmout(undefined);
      try {
        // Handle reactions based on current state
        if (commentReaction === 1 && reaction === 1) {
          // Undo a like
          setCommentReaction(0);
          setCommentLikes((prev) => prev - 1);
          setTajmout(setTimeout(async () => {
            await handleCommentLike(comment.commentId);
          }, 500));
        } else if (commentReaction === 0 && reaction === 1) {
          // Add a like
          setCommentReaction(1);
          setCommentLikes((prev) => prev + 1);
          setTajmout(setTimeout(async () => {
            await handleCommentLike(comment.commentId); // Backend call
          }, 500));
        } else if (commentReaction === 1 && reaction === -1) {
          // Switch from like to dislike
          setCommentReaction(-1)
          setCommentLikes((prev) => prev - 1);
          setCommentDislikes((prev) => prev + 1);
          setTajmout(setTimeout(async () => {
            await handleCommentDislike(comment.commentId); // Backend call
          }, 500));
        } else if (commentReaction === 0 && reaction === -1) {
          // Add a dislike
          setCommentReaction(-1);
          setCommentDislikes((prev) => prev + 1);
          setTajmout(setTimeout(async () => {
            await handleCommentDislike(comment.commentId); // Backend call
          }, 500));
        } else if (commentReaction === -1 && reaction === -1) {
          // Undo a dislike
          setCommentReaction(0);
          setCommentDislikes((prev) => prev - 1);
          setTajmout(setTimeout(async () => {
            await handleCommentDislike(comment.commentId); // Backend call
          }, 500));
        } else if (commentReaction === -1 && reaction === 1) {
          // Switch from dislike to like
          setCommentReaction(1);
          setCommentLikes((prev) => prev + 1);
          setCommentDislikes((prev) => prev - 1);
          setTajmout(setTimeout(async () => {
            await handleCommentLike(comment.commentId); // Backend call
          }, 500));
        }
      } catch (err) {
        console.error("Error handling reaction:", err);
      }
    };

    const [popoverOpen, setPopoverOpen] = useState(false);

    if(!user) return null;
    // spremam podatke korisnika iz localstoragea u varijablu userData za daljnje provjere. 
    const userData: User = JSON.parse(user);

  return (
    <div className='py-2 flex-col'>
      <div className='flex flex-col'>
        <div className='flex items-start'>
          <button className='py-2' onClick={() => router.push(`/users/${comment.user.username}`)}>
            <Avatar className='w-[40px] h-[40px] rounded-full'>
              <AvatarImage src={`${comment.user.pictureUrl} `} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.3758866786956787px 3.3758866786956787px 0px rgba(0,0,0,0.25)'}} />
            </Avatar>
          </button>
          <div className='flex-col w-full ml-2 sm:ml-4'>
            <div className='flex justify-between mr-2'>
              <div className='flex gap-2 items-center'>
                <button className="text-sm lg:text-base font-Roboto text-[#EFEFEF] text-left" onClick={() => router.push(`/users/${comment.user.username}`)}>{comment.user.firstName} {comment.user.lastName}</button>
                <p className="text-xs lg:text-sm text-[#888888]">
                  {commentDays >= 1 ? justCommentDate : commentDays <= 0 && commentHours > 0 && commentMinutes <= 60 ? `${commentHours}h ago` : commentDays < 1 && commentHours <= 24 && commentMinutes <= 60 && commentMinutes >= 1 ? `${commentMinutes}m ago` : "Just now"}
                </p>
              </div>
              <div>
                {showUpdate && (
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger><EllipsisIcon className="text-[#AFAFAF] size-7 mx-2" /></PopoverTrigger>
                      <PopoverContent className="w-fit px-1 md:px-2 py-2 z-[9999] absolute top-0 -right-4 border-white border rounded-md bg-[#222222]">
                          <Command>
                              <CommandList>
                                  <CommandGroup>
                                      <CommandItem className="text-[#AFAFAF] text-lg cursor-pointer w-fit" onSelect={(currentValue) => {
                                          setPopoverOpen(false);
                                          setIsUpdateCommentDialogOpen(true);
                                          handleUpdate();
                                      }}><Pencil className="w-6 h-6"/>Update</CommandItem>
                                      <CommandItem className="text-[#AFAFAF] text-lg cursor-pointer w-fit" onSelect={(currentValue) => {
                                          setPopoverOpen(false);
                                          deleteComment(comment.commentId);
                                          toast({description: "Your comment has been deleted.", duration: 1500, style:{backgroundColor: "#1565CE"}})
                                          }}><Trash2 className="w-6 h-6"/>Delete</CommandItem>
                                  </CommandGroup>
                              </CommandList>
                          </Command>
                      </PopoverContent>
                  </Popover>
                )}
                {showUpdate && (
                  <Dialog open={isUpdateCommentDialogOpen} onOpenChange={setIsUpdateCommentDialogOpen}>
                    <DialogContent className='h-fit flex flex-col px-2 lg:px-4 text-black overflow-y-auto overflow-x-hidden bg-[#222222] max-w-[90%] lg:max-w-[45%] lg:min-w-fit border-transparent [&>button]:text-white'>
                      <DialogHeader className='flex flex-row gap-2'>
                        <button onClick={() => router.push(`/users/${post.user.username}`)}>
                          <Avatar className='lg:w-[40px] lg:h-[40px] rounded-full'>
                            <AvatarImage src={`${post.user.pictureUrl} `} className="w-fit h-fit aspect-square rounded-full object-cover" />
                          </Avatar>
                        </button>
                        <div className='flex justify-between w-full pr-8 !mt-0 '>
                          <div className='flex flex-col'>
                            <DialogDescription className='text-base text-[#EFEFEF] text-left'><button onClick={() => router.push(`/users/${post.user.username}`)}>{post.user.firstName} {post.user.lastName}</button></DialogDescription>
                            <DialogTitle className='text-sm font-[500] text-[#888888] text-left'><button onClick={() => router.push(`/users/${post.user.username}`)}>@ {post.user.username}</button></DialogTitle>
                          </div>
                          <div>
                          <p className='text-[#888888] text-opacity-60'>{commentDays >= 1 ? justCommentDate : commentDays <= 0 && commentHours > 0 && commentMinutes <= 60 ? `${commentHours}h ago` : commentDays < 1 && commentHours <= 24 && commentMinutes <= 60 && commentMinutes >= 1 ? `${commentMinutes}m ago` : "Just now"}</p>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="flex gap-2 items-center flex-col max-w-full bg- rounded-md shadow-[1px_1px_2px_0px_rgba(0,_0,_0,_0.3)] bg-[#363636]">
                          <div className="flex flex-row justify-between relative w-full min-h-full items-center gap-4 py-4 px-4">
                            <div className='w-full h-full flex gap-4'>
                                <Avatar className='w-[35px] h-[35px] lg:w-[60px] lg:h-[60px] rounded-full'>
                                  <AvatarImage src={`${comment.user.pictureUrl} `} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}}/>
                                </Avatar>
                              <div className='flex flex-col flex-grow gap-4 pr-4'>  
                                <ResizableTextarea onChange={(e) =>  setUpdatedContent(e.target.value)} value={updatedContent} className="font-Roboto font-normal leading-5 scrollbar-none w-full max-h-[100px] lg:max-h-[150px] text-sm lg:text-lg text-[#EFEFEF] outline-none rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
                                <div className='flex justify-end'>
                                  <HeroUiBtn onPress={() => update()} className="relative flex h-[40px] w-32 items-center justify-center overflow-hidden bg-[#5D5E5D] rounded-full font-Roboto text-[#EFEFEF] shadow-[0px_3px_3px_0px_rgba(0,0,0,0.2)] transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-gray-800 before:duration-500 before:ease-out hover:shadow-none hover:before:h-56 hover:before:w-56">
                                    <span className="relative z-10 text-base">Submit</span>
                                  </HeroUiBtn>
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <p className='max-w-full break-words pr-4 ml-4 py-1 list-item font-Roboto text-[#EFEFEF] text-sm lg:text-base' dangerouslySetInnerHTML={{ __html: comment.content.replace(/\n/g, '<br />') }} />
            <div className='flex gap-1 items-center'>
              <button onClick={() => handleCommentLike(comment.commentId)}><svg width="25" height="25" viewBox="0 0 5 5" fill={`${comment.userReacted === 1  ? '#319357' : '#C7C7C7'}`} xmlns="http://www.w3.org/2000/svg"><path d="M0.876018 3.89022C0.876018 3.84194 0.859084 3.80016 0.825216 3.76488C0.791348 3.7296 0.751242 3.71197 0.704896 3.71197C0.656768 3.71197 0.616215 3.7296 0.583238 3.76488C0.550262 3.80016 0.533773 3.84194 0.533773 3.89022C0.533773 3.94035 0.550262 3.98259 0.583238 4.01694C0.616215 4.0513 0.656768 4.06847 0.704896 4.06847C0.751242 4.06847 0.791348 4.0513 0.825216 4.01694C0.859084 3.98259 0.876018 3.94035 0.876018 3.89022ZM1.30382 2.4642V4.24672C1.30382 4.295 1.28689 4.33678 1.25302 4.37206C1.21915 4.40734 1.17905 4.42498 1.1327 4.42498H0.362651C0.316305 4.42498 0.276198 4.40734 0.24233 4.37206C0.208462 4.33678 0.191528 4.295 0.191528 4.24672V2.4642C0.191528 2.41592 0.208462 2.37414 0.24233 2.33886C0.276198 2.30358 0.316305 2.28594 0.362651 2.28594H1.1327C1.17905 2.28594 1.21915 2.30358 1.25302 2.33886C1.28689 2.37414 1.30382 2.41592 1.30382 2.4642ZM4.46959 2.4642C4.46959 2.62388 4.42057 2.76221 4.32253 2.87919C4.34927 2.96089 4.36264 3.03145 4.36264 3.09087C4.36799 3.23198 4.32966 3.35917 4.24767 3.47244C4.27797 3.57642 4.27797 3.68504 4.24767 3.79831C4.22093 3.90414 4.1728 3.99141 4.10328 4.06011C4.11932 4.26808 4.07565 4.43612 3.97227 4.56424C3.85818 4.70535 3.68261 4.77777 3.44553 4.78148H3.10061C2.98296 4.78148 2.85462 4.76709 2.71559 4.73831C2.57655 4.70953 2.46826 4.68261 2.39072 4.65754C2.31318 4.63247 2.20578 4.5958 2.06853 4.54752C1.84928 4.46768 1.70846 4.42683 1.64607 4.42498C1.59972 4.42312 1.55962 4.40501 1.52575 4.37066C1.49188 4.33631 1.47495 4.295 1.47495 4.24672V2.46141C1.47495 2.41499 1.49099 2.37461 1.52308 2.34026C1.55516 2.3059 1.59349 2.28687 1.63805 2.28316C1.68083 2.27945 1.74856 2.22467 1.84126 2.11883C1.93395 2.01299 2.02397 1.90066 2.11131 1.78182C2.23252 1.62028 2.32254 1.50887 2.38136 1.4476C2.41345 1.41418 2.44108 1.36961 2.46425 1.31391C2.48742 1.25821 2.50302 1.21318 2.51104 1.17883C2.51906 1.14448 2.53109 1.08831 2.54714 1.01032C2.55961 0.937909 2.57076 0.881276 2.58056 0.840427C2.59036 0.799577 2.60774 0.751301 2.6327 0.695597C2.65765 0.639893 2.68796 0.593473 2.72361 0.556337C2.75747 0.521058 2.79758 0.503418 2.84393 0.503418C2.92592 0.503418 2.99945 0.513166 3.06451 0.532663C3.12958 0.552159 3.18305 0.576297 3.22494 0.605078C3.26683 0.633858 3.30248 0.671458 3.33189 0.717878C3.36131 0.764298 3.3827 0.806076 3.39606 0.843212C3.40943 0.880348 3.42013 0.926768 3.42815 0.982472C3.43617 1.03818 3.44063 1.07995 3.44152 1.10781C3.44241 1.13566 3.44286 1.17187 3.44286 1.21643C3.44286 1.28699 3.43439 1.35755 3.41745 1.4281C3.40052 1.49866 3.38359 1.55437 3.36665 1.59522C3.34972 1.63606 3.32521 1.68806 3.29312 1.75119C3.28778 1.76233 3.27886 1.77904 3.26639 1.80132C3.25391 1.8236 3.2441 1.84403 3.23697 1.86259C3.22984 1.88116 3.22271 1.90344 3.21558 1.92944H3.95622C4.09526 1.92944 4.21558 1.98236 4.31718 2.0882C4.41879 2.19403 4.46959 2.31937 4.46959 2.4642Z"/></svg></button>
              <p className={`${comment.userReacted === 1 ? 'text-[#319357]' : 'text-[#C7C7C7]'}`}>{comment.likes}</p>
              <button onClick={() => handleCommentDislike(comment.commentId)}><svg width="27" height="27" viewBox="0 0 6 5" fill={`${comment.userReacted === -1  ? '#D25551' : '#C7C7C7'}`} xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_54_1050)"><path d="M1.8447 1.57156C1.8447 1.61885 1.82742 1.65978 1.79286 1.69434C1.7583 1.7289 1.71738 1.74618 1.67008 1.74618C1.62097 1.74618 1.57959 1.7289 1.54594 1.69434C1.51229 1.65978 1.49547 1.61885 1.49547 1.57156C1.49547 1.52245 1.51229 1.48107 1.54594 1.44742C1.57959 1.41377 1.62097 1.39695 1.67008 1.39695C1.71738 1.39695 1.7583 1.41377 1.79286 1.44742C1.82742 1.48107 1.8447 1.52245 1.8447 1.57156ZM2.28124 2.96848V1.22233C2.28124 1.17504 2.26396 1.13411 2.2294 1.09955C2.19484 1.065 2.15391 1.04772 2.10662 1.04772H1.32086C1.27356 1.04772 1.23264 1.065 1.19808 1.09955C1.16352 1.13411 1.14624 1.17504 1.14624 1.22233V2.96848C1.14624 3.01577 1.16352 3.0567 1.19808 3.09126C1.23264 3.12581 1.27356 3.14309 1.32086 3.14309H2.10662C2.15391 3.14309 2.19484 3.12581 2.2294 3.09126C2.26396 3.0567 2.28124 3.01577 2.28124 2.96848ZM5.36155 2.56195C5.46159 2.67291 5.51161 2.80842 5.51161 2.96848C5.50979 3.11035 5.4575 3.23313 5.35473 3.33681C5.25196 3.44048 5.12964 3.49232 4.98777 3.49232H4.23201C4.23929 3.51779 4.24656 3.53962 4.25384 3.5578C4.26111 3.57599 4.27112 3.596 4.28385 3.61783C4.29658 3.63965 4.30568 3.65602 4.31113 3.66694C4.34387 3.73424 4.36843 3.78608 4.3848 3.82245C4.40117 3.85883 4.41845 3.91204 4.43664 3.98206C4.45483 4.05209 4.46392 4.12166 4.46392 4.19078C4.46392 4.23444 4.46347 4.26991 4.46256 4.29719C4.46165 4.32447 4.4571 4.3654 4.44892 4.41997C4.44073 4.47453 4.42982 4.52 4.41618 4.55638C4.40253 4.59276 4.38071 4.63369 4.3507 4.67916C4.32068 4.72463 4.28431 4.76146 4.24156 4.78966C4.19882 4.81785 4.14425 4.8415 4.07786 4.86059C4.01147 4.87969 3.93644 4.88924 3.85277 4.88924C3.80548 4.88924 3.76455 4.87196 3.72999 4.8374C3.69362 4.80103 3.66269 4.75555 3.63723 4.70099C3.61177 4.64642 3.59403 4.59913 3.58403 4.55911C3.57402 4.5191 3.56265 4.46362 3.54992 4.39268C3.53355 4.31629 3.52127 4.26127 3.51309 4.22762C3.5049 4.19397 3.48899 4.14986 3.46534 4.09529C3.4417 4.04072 3.4135 3.99707 3.38076 3.96433C3.32074 3.90431 3.22889 3.79517 3.1052 3.63693C3.01607 3.52052 2.92422 3.41047 2.82964 3.3068C2.73505 3.20312 2.66593 3.14946 2.62228 3.14582C2.57681 3.14218 2.5377 3.12354 2.50496 3.08989C2.47222 3.05624 2.45585 3.01668 2.45585 2.97121V1.22233C2.45585 1.17504 2.47313 1.13457 2.50769 1.10092C2.54225 1.06727 2.58317 1.04953 2.63047 1.04772C2.69413 1.0459 2.83782 1.00588 3.06155 0.927668C3.2016 0.880377 3.31119 0.844453 3.39031 0.819898C3.46944 0.795343 3.57993 0.768969 3.72181 0.740776C3.86368 0.712583 3.99464 0.698486 4.11469 0.698486H4.46665C4.70856 0.702124 4.88773 0.773061 5.00414 0.911298C5.10963 1.0368 5.1542 1.20141 5.13783 1.40513C5.20876 1.47243 5.25787 1.55792 5.28516 1.6616C5.31608 1.77255 5.31608 1.87896 5.28516 1.98081C5.36883 2.09177 5.40793 2.21636 5.40248 2.3546C5.40248 2.4128 5.38883 2.48192 5.36155 2.56195Z"/></g><defs><clipPath id="clip0_54_1050"><rect width="4.88921" height="4.88921" transform="translate(0.971436)"/></clipPath></defs></svg></button>
              <p className={`${comment.userReacted === -1  ? 'text-[#D25551]' : 'text-[#C7C7C7]'}`}>{comment.dislikes}</p>
              <Dialog open={isCommentReplyDialogOpen} onOpenChange={setIsCommentReplyDialogOpen}>
                <DialogTrigger  className='flex ml-4 font-Roboto text-[#C7C7C7] gap-1'><svg width="25" height="25" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.33251 0.347656H0.440609C0.37643 0.347656 0.314879 0.375241 0.269495 0.424342C0.224112 0.473443 0.198613 0.54004 0.198608 0.609482V2.67901C0.198611 2.74846 0.224108 2.81506 0.269491 2.86416C0.314875 2.91327 0.376427 2.94086 0.440609 2.94086H1.33616C1.37046 2.94086 1.40336 2.95561 1.42762 2.98185C1.45187 3.0081 1.4655 3.0437 1.4655 3.08081V3.56928C1.4655 3.59907 1.47348 3.62823 1.48846 3.65322C1.50344 3.67822 1.52479 3.69798 1.54993 3.71013C1.57507 3.72228 1.60293 3.72629 1.63013 3.72169C1.65733 3.71708 1.68272 3.70404 1.70322 3.68416L2.41402 2.99487C2.4499 2.96009 2.49637 2.94085 2.54454 2.94084H3.3325C3.39668 2.94083 3.45823 2.91325 3.50362 2.86414C3.549 2.81504 3.57449 2.74844 3.57449 2.67899V0.609482C3.57449 0.540043 3.54899 0.47345 3.50361 0.424349C3.45823 0.375248 3.39669 0.347661 3.33251 0.347656ZM1.88655 2.08077H0.935229C0.919236 2.08119 0.903327 2.07815 0.888438 2.07182C0.873549 2.06549 0.859981 2.056 0.848532 2.04391C0.837083 2.03182 0.827985 2.01737 0.821774 2.00142C0.815562 1.98547 0.812362 1.96834 0.812362 1.95103C0.812362 1.93372 0.815562 1.91658 0.821774 1.90063C0.827985 1.88468 0.837083 1.87024 0.848532 1.85815C0.859981 1.84606 0.873549 1.83657 0.888438 1.83024C0.903327 1.8239 0.919236 1.82086 0.935229 1.82128H1.88655C1.90254 1.82086 1.91845 1.8239 1.93334 1.83024C1.94823 1.83657 1.9618 1.84606 1.97324 1.85815C1.98469 1.87024 1.99379 1.88468 2 1.90063C2.00621 1.91658 2.00941 1.93372 2.00941 1.95103C2.00941 1.96834 2.00621 1.98547 2 2.00142C1.99379 2.01737 1.98469 2.03182 1.97324 2.04391C1.9618 2.056 1.94823 2.06549 1.93334 2.07182C1.91845 2.07815 1.90254 2.08119 1.88655 2.08077ZM2.83795 2.08077H2.46693C2.45094 2.08119 2.43503 2.07815 2.42014 2.07182C2.40525 2.06549 2.39169 2.056 2.38024 2.04391C2.36879 2.03182 2.35969 2.01737 2.35348 2.00142C2.34727 1.98547 2.34407 1.96834 2.34407 1.95103C2.34407 1.93372 2.34727 1.91658 2.35348 1.90063C2.35969 1.88468 2.36879 1.87024 2.38024 1.85815C2.39169 1.84606 2.40525 1.83657 2.42014 1.83024C2.43503 1.8239 2.45094 1.82086 2.46693 1.82128H2.83795C2.86925 1.82211 2.89901 1.83614 2.92088 1.86038C2.94274 1.88462 2.95498 1.91715 2.95498 1.95103C2.95498 1.9849 2.94274 2.01743 2.92088 2.04167C2.89901 2.06592 2.86925 2.07995 2.83795 2.08077ZM2.83795 1.42341H0.935229C0.919236 1.42383 0.903327 1.42078 0.888438 1.41445C0.873549 1.40812 0.859981 1.39863 0.848532 1.38654C0.837083 1.37445 0.827985 1.36001 0.821774 1.34405C0.815562 1.3281 0.812362 1.31097 0.812362 1.29366C0.812362 1.27635 0.815562 1.25922 0.821774 1.24327C0.827985 1.22731 0.837083 1.21287 0.848532 1.20078C0.859981 1.18869 0.873549 1.1792 0.888438 1.17287C0.903327 1.16654 0.919236 1.16349 0.935229 1.16392H2.83795C2.86925 1.16474 2.89901 1.17877 2.92088 1.20301C2.94274 1.22726 2.95498 1.25979 2.95498 1.29366C2.95498 1.32753 2.94274 1.36007 2.92088 1.38431C2.89901 1.40855 2.86925 1.42258 2.83795 1.42341Z" fill="#C7C7C7"/></svg> Reply</DialogTrigger>
                <DialogContent className='w-full h-[350px] flex flex-col bg-[#222222] overflow-y-auto max-w-[90%] lg:max-w-[45%] lg:min-w-fit [&>button]:text-white'>
                  <DialogHeader className='flex flex-row gap-2'>
                    <button onClick={() => router.push(`/users/${comment.user.username}`)}>
                      <Avatar className='w-[40px] h-[40px] rounded-full'>
                        <AvatarImage src={`${comment.user.pictureUrl} `} className="w-fit h-fit aspect-square rounded-full object-cover" />
                      </Avatar>
                    </button>
                    <div className='flex justify-between w-full pr-8 !mt-0 '>
                      <div className='flex flex-col'>
                        <DialogDescription className='text-base text-[#EFEFEF]'><button onClick={() => router.push(`/users/${comment.user.username}`)}>{comment.user.firstName} {comment.user.lastName}</button></DialogDescription>
                        <DialogTitle className='text-sm font-[500] text-[#888888] text-left'><button onClick={() => router.push(`/users/${comment.user.username}`)}>@ {comment.user.username}</button></DialogTitle>
                      </div>
                      <div>
                        <p className='text-[#888888] text-opacity-60'>{commentDays >= 1 ? justCommentDate : commentDays <= 0 && commentHours > 0 && commentMinutes <= 60 ? `${commentHours}h ago` : commentDays < 1 && commentHours <= 24 && commentMinutes <= 60 && commentMinutes >= 1 ? `${commentMinutes}m ago` : "Just now"}</p>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="flex gap-2 items-center flex-col max-w-full bg- rounded-md shadow-[1px_1px_2px_0px_rgba(0,_0,_0,_0.3)] bg-[#363636]">
                      <div className="flex flex-row justify-between relative w-full min-h-full items-center gap-4 py-4 px-4">
                        <div className='w-full h-full flex gap-4'>
                            <Avatar className='w-[35px] h-[35px] lg:w-[60px] lg:h-[60px] rounded-full'>
                              <AvatarImage src={`${userData.pictureUrl} `} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}}/>
                            </Avatar>
                          <div className='flex flex-col flex-grow gap-4 pr-4'>  
                            <ResizableTextarea onChange={(e) =>  setReplyContent(e.target.value)} value={replyContent} placeholder='Write a reply.' className="font-Roboto font-normal leading-5 scrollbar-none w-full max-h-[100px] lg:max-h-[150px] text-sm lg:text-lg text-[#EFEFEF] outline-none rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
                            <div className='flex justify-end'>
                              <button onClick={() => handleReply(replyContent)} className="rounded-full w-[150px] bg-[#5D5E5D] text-[#EFEFEF] py-[0.30rem] text-base">Post reply</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {replyFinished ? <h1 className='font-Roboto text-[#EFEFEF] pb-4'>Reply successfully posted!</h1> : null}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        {comment.replies.length > 0 ? (
        <div className='flex'>
          <div className='py-4 w-full flex'>
            <svg viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg" className='sm:px-2 sm:my-0 sm:w-[80px] sm:h-[55px] w-[55px] h-[25px] px-1 my-8'><path d="M11.0746 7.87313L9.84327 7.16222V8.58405L11.0746 7.87313ZM3.12687 7.99627H9.9664V7.75H3.12687V7.99627ZM0.876866 0V5.74627H1.12313V0H0.876866ZM3.12687 7.75C2.02024 7.75 1.12313 6.8529 1.12313 5.74627H0.876866C0.876866 6.98891 1.88423 7.99627 3.12687 7.99627V7.75Z" fill="#CACACA"/></svg>
              <div className='flex flex-col w-full'>
                {commentReplies.map((reply, index) => (
                    <EachReply key={index} reply={reply} like={handleReplyLike} dislike={handleReplyDislike} deleteReply={deleteReply} updateReply={updateComment} />
                ))}
              </div>
          </div>
        </div>
        ): null}
      </div>
    </div>

  )
}

export default EachComment;