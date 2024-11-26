import React, {useState, useEffect, useRef} from 'react'
import {Flex, Avatar} from '@radix-ui/themes'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpLong, faDownLong, faPen, faTrash, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Comment, Post, User } from '../types/types';
import PostComment from './PostComment';
import EachComment from './eachComment';

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/src/components/ui/dialog';
import { ScrollArea } from "@/src/components/ui/scroll-area"
import Image from 'next/image';

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

  // state za prikazivanje Delete i Update gumbova
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const [showMore, setShowMore] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const [isPortrait, setIsPortrait] = useState(false);

      // dobivam usera iz localStorage-a
  const user = localStorage.getItem('user');
    

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setIsPortrait(naturalHeight > naturalWidth);
  };


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

  }, [user, post.userProfile.id, post.fileUrls]);  

  

  const handleComments = async () => {
    try {
      // Fetch the post data from the API
      const res = await axios.get(`https://snetapi-evgqgtdcc0b6a2e9.germanywestcentral-01.azurewebsites.net/api/posts/${post.id}`);
  
      // Assuming the response is already in JSON format
      const currentPost: Post = res.data;

      setComments(currentPost.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  return (
    <div className="my-2 w-full max-w-xl h-fit flex flex-col gap-2 bg-[#eeeded] text-black px-1 py-2 rounded-3xl overflow-hidden shadow-[0px_0px_5px_1px_rgba(0,_0,_0,_0.2)]">
      <div className="flex gap-2 flex-1">
        <div className='flex flex-col w-full'>
          <div className='py-2 px-4 flex'>
            <Flex gap="2" className='items-center'>
              <Avatar src={`${post.userProfile.pictureUrl}`} style={{ width: '40px', height: '40px', borderRadius: '25px'}} fallback="A" />
            </Flex>
            <div className="flex flex-col w-full px-4">
              <div className='flex justify-between'>
                <div className='flex gap-2 items-center'>
                  <h1 className="text-base font-Roboto">{post.userProfile.firstName} {post.userProfile.lastName}</h1>
                  <p className="text-sm text-gray-500">
                    {days >= 1 ? justDate : days <= 0 && hours > 0 && minutes <= 60 ? `${hours}h ago` : days < 1 && hours <= 24 && minutes <= 60 && minutes >= 1 ? `${minutes}m ago` : "Just now"}
                  </p>
                </div>
                <div>
                  {showUpdate && (
                    <button className="text-sm" onClick={() => updatePost(post.id)}>
                      <FontAwesomeIcon icon={faPen} className="text-xl" />
                    </button>
                  )}
                  {showDelete && (
                    <button className="text-sm px-2" onClick={() => deletePost(post.id)}>
                      <FontAwesomeIcon icon={faTrash} className="text-xl" />
                    </button>
                  )}
                </div>
              </div>
              <p className='text-sm font-Roboto text-[#656565]'>@{post.userProfile.username}</p>
            </div>
          </div>
          <div className={`flex px-4 ${post.fileUrls.length === 1 && isPortrait ? 'flex-row' : 'flex-col'}`}>
            {/* Image content for single portrait */}
            {post.fileUrls.length === 1 && isPortrait && (
                <Image
                  src={post.fileUrls[0]}
                  alt="a"
                  sizes="100vw"
                  width={0}
                  height={0}
                  className="w-[30%] h-auto py-6 mr-4"
                  onLoad={handleImageLoad}
                />
            )}

            {/* Paragraph content */}
            <p className={`${post.fileUrls.length > 2 || (post.fileUrls.length === 1 && isPortrait) ? 'pr-8' : 'pr-8'} max-w-full break-all pt-4 text-justify`}>
              {post.content}
            </p>

            {/* Image content for multiple images or non-portrait cases */}
            {post.fileUrls.length !== 0 &&
              (post.fileUrls.length > 1 || !isPortrait) &&
              post.fileUrls.map((file, index) => (
                  <Image
                  key={index}
                  src={file}
                  alt="a"
                  sizes="100vw"
                  width={0}
                  height={0}
                  className="w-[70%] h-auto py-6"
                  onLoad={handleImageLoad}
                />
              ))}
          </div>
          <div className="flex gap-4 py-4 items-center justify-between">
            <div className="flex justify-between w-full">
              <div className='flex gap-2 px-4'>
                <FontAwesomeIcon
                  icon={faUpLong}
                  className={`text-2xl hover:cursor-pointer hover:text-green-600 transition-all ${post.userReacted === 1 ? "text-green-600" : "text-gray-500"}`}
                  onClick={() => handleLike(post.id)}
                />
                <p>{post.likes}</p>
                <FontAwesomeIcon
                  icon={faDownLong}
                  className={`text-2xl hover:cursor-pointer hover:text-red-600 transition-all ${post.userReacted === -1 ? "text-red-600" : "text-gray-500"}`}
                  onClick={() => handleDislike(post.id)}
                />
                <p>{post.dislikes}</p>
              </div>
              <Dialog>
                <DialogTrigger className='flex px-8 py-2 rounded-md w-fit' onClick={() => handleComments()}><svg className='mr-2' width="24" height="24" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_54_1461)"> <path d="M7.34927 2.1044C7.12027 1.42273 6.57694 0.879395 5.89561 0.650729C4.63761 0.228729 3.36194 0.228729 2.10427 0.650729C1.42261 0.879395 0.879273 1.42273 0.650606 2.10406C0.228606 3.36206 0.228606 4.6374 0.650606 5.8954C0.879273 6.57673 1.42261 7.1204 2.10427 7.34906C2.73227 7.55973 3.36994 7.6664 3.99994 7.6664C5.00727 7.6664 6.02794 7.53373 7.03361 7.27206C7.15061 7.24173 7.24194 7.1504 7.27227 7.0334C7.53394 6.02773 7.66661 5.00706 7.66661 3.99973C7.66661 3.37006 7.55994 2.7324 7.34927 2.10406V2.1044ZM6.67527 6.67506C5.78627 6.89073 4.88727 7.00006 4.00027 7.00006C3.44294 7.00006 2.87627 6.90473 2.31694 6.71706C1.83227 6.55439 1.44594 6.16806 1.28327 5.68339C0.908273 4.56639 0.908273 3.4334 1.28327 2.3164C1.44561 1.83173 1.83194 1.4454 2.31694 1.28306C2.87527 1.09573 3.43794 1.00173 4.00027 1.00173C4.56261 1.00173 5.12527 1.0954 5.68394 1.28306C6.16861 1.4454 6.55494 1.83173 6.71761 2.31673C6.90527 2.8764 7.00061 3.44273 7.00061 4.00006C7.00061 4.8874 6.89127 5.78606 6.67561 6.67506H6.67527Z" fill="#545454"/> <path d="M5.68797 3.66675H2.31197C2.12797 3.66675 1.97864 3.81608 1.97864 4.00008C1.97864 4.18408 2.12797 4.33341 2.31197 4.33341H5.68797C5.87197 4.33341 6.0213 4.18408 6.0213 4.00008C6.0213 3.81608 5.87197 3.66675 5.68797 3.66675Z" fill="#545454"/> <path d="M5.35468 5.00708H2.64535C2.46135 5.00708 2.31201 5.15641 2.31201 5.34041C2.31201 5.52441 2.46135 5.67375 2.64535 5.67375H5.35468C5.53868 5.67375 5.68801 5.52441 5.68801 5.34041C5.68801 5.15641 5.53868 5.00708 5.35468 5.00708Z" fill="#545454"/> <path d="M2.64535 2.99308H3.61335C3.79735 2.99308 3.94668 2.84375 3.94668 2.65975C3.94668 2.47575 3.79735 2.32642 3.61335 2.32642H2.64535C2.46135 2.32642 2.31201 2.47575 2.31201 2.65975C2.31201 2.84375 2.46135 2.99308 2.64535 2.99308Z" fill="#545454"/> </g> <defs> <clipPath id="clip0_54_1461"> <rect width="8" height="8" fill="white"/></clipPath></defs></svg>{post.commentCount}</DialogTrigger>
                <DialogContent className='w-full h-[85vh] flex flex-col bg-[#eeeded] text-black overflow-y-auto max-w-[35%]'>
                  <DialogHeader className='flex flex-row gap-2'>
                    <Flex gap="2" className='items-center'>
                      <Avatar src={`${post.userProfile.pictureUrl}`} style={{ width: '40px', height: '40px', borderRadius: '25px'}} fallback="A" />
                    </Flex>
                    <div className='flex justify-between w-full pr-8 !mt-0 '>
                      <div className='flex flex-col'>
                        <DialogDescription className='text-base text-black'>{post.userProfile.firstName} {post.userProfile.lastName}</DialogDescription>
                        <DialogTitle className='text-sm font-[500] text-[#656565]'>@ {post.userProfile.username}</DialogTitle>
                      </div>
                      <div>
                        <p className='text-black text-opacity-60'>{days >= 1 ? justDate : days <= 0 && hours > 0 && minutes <= 60 ? `${hours}h ago` : days < 1 && hours <= 24 && minutes <= 60 && minutes >= 1 ? `${minutes}m ago` : "Just now"}</p>
                      </div>
                    </div>
                  </DialogHeader>
                  <ScrollArea className="rounded-md py-2 w-[100%]">
                    <div className={`flex w-[95%] ${post.fileUrls.length === 1 && isPortrait ? 'flex-row' : 'flex-col'}`}>
                      {/* Image content for single portrait */}
                      {post.fileUrls.length === 1 && isPortrait && (
                          <Image
                            src={post.fileUrls[0]}
                            alt="a"
                            sizes="100vw"
                            width={0}
                            height={0}
                            className="w-[30%] h-auto py-6 mr-4"
                            onLoad={handleImageLoad}
                          />)}

                      {/* Paragraph content */}
                      <p className={`${post.fileUrls.length > 2 || (post.fileUrls.length === 1 && isPortrait) ? 'pr-8' : 'pr-8'} max-w-full break-all text-justify`}>
                        {post.content}
                      </p>

                      {/* Image content for multiple images or non-portrait cases */}
                      {post.fileUrls.length !== 0 &&
                        (post.fileUrls.length > 1 || !isPortrait) &&
                        post.fileUrls.map((file, index) => (
                            <Image
                            key={index}
                            src={file}
                            alt="a"
                            sizes="100vw"
                            width={0}
                            height={0}
                            className="w-[70%] h-auto py-6"
                            onLoad={handleImageLoad}
                          />))}
                    </div>
                    <div className='flex gap-2 w-[95%] py-4'>
                          <FontAwesomeIcon
                            icon={faUpLong}
                            className={`text-2xl hover:cursor-pointer hover:text-green-600 transition-all ${post.userReacted === 1 ? "text-green-600" : "text-gray-500"}`}
                            onClick={() => handleLike(post.id)}
                          />
                          <p>{post.likes}</p>
                          <FontAwesomeIcon
                            icon={faDownLong}
                            className={`text-2xl hover:cursor-pointer hover:text-red-600 transition-all ${post.userReacted === -1 ? "text-red-600" : "text-gray-500"}`}
                            onClick={() => handleDislike(post.id)}
                          />
                          <p>{post.dislikes}</p>
                    </div>
                    <hr className='my-4 w-[95%] h-[1px] bg-black'/>
                    <PostComment postId={post.id} refreshPosts={refreshPosts} refreshComments={handleComments}/>
                    <h1 className='text-2xl'>Comments</h1>
                    {comments.map((comment, index) => (
                      <div key={index} className='py-2'>
                        <EachComment post={post} comment={comment} refreshComments={handleComments} />
                      </div>
                    ))}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EachPost