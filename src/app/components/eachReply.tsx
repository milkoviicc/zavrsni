'use client';
import React, { useEffect, useState } from 'react'
import { Reply, User } from '../types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/src/components/ui/dialog';
import ResizableTextarea from './ResizableTextarea';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';

const EachReply = ({reply, like, dislike, deleteReply, updateReply}: {reply: Reply, like: (commentReplyId: string) => void, dislike: (commentReplyId: string) => void, deleteReply: (commentReplyId: string) => void, updateReply: (commentReplyId: string, updatedContent: string) => void}) => {

    const replyDate = reply.createdOn;

    // pretvaram datum u Date objekt
    const replyFullDate = new Date(replyDate);
    replyFullDate.setUTCHours(replyFullDate.getUTCHours()+1);
    const justReplyDate = replyFullDate.toLocaleString('en-us', {year: 'numeric', month: 'short', day:'numeric'});

    const currentDate = new Date();

    // računam razliku između trenutnog i prenesenog vremena u ms
    const replyDifferenceMs = currentDate.getTime() - replyFullDate.getTime();

    // pretvaram milisekunde u sekunde
    const totalReplySeconds = Math.floor(replyDifferenceMs / 1000);

    // računam dane, sate, minute i sekunde
    const replyDays = Math.floor(totalReplySeconds / 86400); // 86400 seconds in a day
    const replyHours = Math.floor((totalReplySeconds % 86400) / 3600); // Remaining seconds converted to hours
    const replyMinutes = Math.floor((totalReplySeconds % 3600) / 60); // Remaining seconds converted to minutes
    const replySeconds = totalReplySeconds % 60; // Remaining seconds after full minutes  

    const [showDelete, setShowDelete] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [updatedContent, setUpdatedContent] = useState('');
    const [finishedUpdating, setFinishedUpdating] = useState(false);

    const router = useRouter();

    const user = localStorage.getItem('user');

    useEffect(() => {

        // ako korisnik postoji ulazi u {}, ako ne ništa se ne dešava
        if(user) {

            const userData: User = JSON.parse(user);
            // ako je id korisnika koji je objavio post jednak trenutnom korisniku state se stavlja na true kako bi se gumb 'Delete' prikazao, inače na false kako se ne bi prikazao
            if(reply.userProfile.userId === userData.userId) {
                setShowDelete(true);
                setShowUpdate(true);
            } else {
                setShowDelete(false);
                setShowUpdate(false);
            }
        }
    }, [reply.userProfile.userId]);


    const handleUpdate = () => {
        setUpdatedContent(reply.content);
    }

    const update = async () => {
        updateReply(reply.commentReplyId, updatedContent);
        reply.content = updatedContent;
        setFinishedUpdating(true);
        setTimeout(() => {
            setFinishedUpdating(false);
            setIsDialogOpen(false);
        }, 1000);
    }

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    if(!user) {
        return null;
    }

    const userData: User = JSON.parse(user);

  return (
    <div className='flex py-4'>
        <div className='flex items-center w-full'>
            <Avatar className='w-[40px] h-[40px] rounded-full'>
                <AvatarImage src={`${reply.userProfile.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.3758866786956787px 3.3758866786956787px 0px rgba(0,0,0,0.25)'}}/>
            </Avatar>
            <div className='flex flex-col w-full ml-2 sm:ml-4'>
                <div className='flex justify-between mr-2'>
                    <div className='flex gap-2 items-center'>
                        <h1 className="text-sm lg:text-base font-Roboto text-[#EFEFEF]">{reply.userProfile.firstName} {reply.userProfile.lastName}</h1>
                        <p className="text-xs lg:text-sm text-[#888888]">
                            {replyDays >= 1 ? justReplyDate : replyDays <= 0 && replyHours > 0 && replyMinutes <= 60 ? `${replyHours}h ago` : replyDays < 1 && replyHours <= 24 && replyMinutes <= 60 && replyMinutes >= 1 ? `${replyMinutes}m ago` : "Just now"}
                        </p>
                    </div>
                    <div>
                    {showUpdate && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger onClick={() => handleUpdate()}><FontAwesomeIcon icon={faPen} className='text-[#C7C7C7]' /></DialogTrigger>
                            <DialogContent className='h-fit flex flex-col px-2 lg:px-4 text-black overflow-y-auto overflow-x-hidden bg-[#222222] max-w-[90%] lg:max-w-[45%] lg:min-w-fit border-transparent'>
                                <DialogHeader className='flex flex-row gap-2'>
                                    <button onClick={() => router.push(`/users/${reply.userProfile.username}`)}>
                                        <Avatar className='lg:w-[40px] lg:h-[40px] rounded-full'>
                                        <AvatarImage src={`${reply.userProfile.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" />
                                        </Avatar>
                                    </button>
                                    <div className='flex justify-between w-full pr-8 !mt-0 '>
                                        <div className='flex flex-col'>
                                        <DialogDescription className='text-base text-[#EFEFEF]'><button onClick={() => router.push(`/users/${reply.userProfile.username}`)}>{reply.userProfile.firstName} {reply.userProfile.lastName}</button></DialogDescription>
                                        <DialogTitle className='text-sm font-[500] text-[#888888] text-left'><button onClick={() => router.push(`/users/${reply.userProfile.username}`)}>@ {reply.userProfile.username}</button></DialogTitle>
                                        </div>
                                        <div>
                                        <p className='text-[#888888] text-opacity-60'>{replyDays >= 1 ? justReplyDate : replyDays <= 0 && replyHours > 0 && replyMinutes <= 60 ? `${replyHours}h ago` : replyDays < 1 && replyHours <= 24 && replyMinutes <= 60 && replyMinutes >= 1 ? `${replyMinutes}m ago` : "Just now"}</p>
                                        </div>
                                    </div>
                                </DialogHeader>
                                <div className="flex gap-2 items-center flex-col max-w-full bg- rounded-md shadow-[1px_1px_2px_0px_rgba(0,_0,_0,_0.3)] bg-[#363636]">
                                    <div className="flex flex-row justify-between relative w-full min-h-full items-center gap-4 py-4 px-4">
                                        <div className='w-full h-full flex gap-4'>
                                            <Avatar className='w-[35px] h-[35px] lg:w-[60px] lg:h-[60px] rounded-full'>
                                                <AvatarImage src={`${userData.pictureUrl}`} className="w-fit h-fit aspect-square rounded-full object-cover" style={{boxShadow: '0px 3.08px 3.08px 0px #00000040'}}/>
                                            </Avatar>
                                            <div className='flex flex-col flex-grow gap-4 pr-4'>  
                                            <ResizableTextarea onChange={(e) =>  setUpdatedContent(e.target.value)} value={updatedContent} className="font-Roboto font-normal leading-5 scrollbar-none w-full max-h-[100px] lg:max-h-[150px] text-sm lg:text-lg text-[#EFEFEF] outline-none rounded border-gray-800 hover:border-gray-600 focus:border-gray-600 placeholder-[#BBBBBB] bg-transparent transition-all"/>
                                            <div className='flex justify-end'>
                                                <button onClick={() => update()} className="rounded-full w-[150px] bg-[#5D5E5D] text-[#EFEFEF] py-[0.30rem] text-base">Update reply</button>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    {finishedUpdating ? <h1 className='font-Roboto text-[#EFEFEF] pb-4'>Reply successfully updated!</h1> : null}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                        {showDelete && (
                            <button className="text-sm px-2">
                            <FontAwesomeIcon icon={faTrash} className='text-[#C7C7C7] text-xl' onClick={(() => deleteReply(reply.commentReplyId))}/>
                            </button>
                        )}
                    </div>
                </div>
                
                <div>
                    <p className='max-w-full break-all pr-4 ml-4 list-item font-Roboto text-[#EFEFEF] text-sm lg:text-base'>{reply.content}</p>
                </div>
                <div className='flex gap-1 items-center'>
                    <button onClick={() => like(reply.commentReplyId)}><svg width="25" height="25" viewBox="0 0 5 5" fill={`${reply.userReacted === 1  ? '#319357' : '#C7C7C7'}`} xmlns="http://www.w3.org/2000/svg"><path d="M0.876018 3.89022C0.876018 3.84194 0.859084 3.80016 0.825216 3.76488C0.791348 3.7296 0.751242 3.71197 0.704896 3.71197C0.656768 3.71197 0.616215 3.7296 0.583238 3.76488C0.550262 3.80016 0.533773 3.84194 0.533773 3.89022C0.533773 3.94035 0.550262 3.98259 0.583238 4.01694C0.616215 4.0513 0.656768 4.06847 0.704896 4.06847C0.751242 4.06847 0.791348 4.0513 0.825216 4.01694C0.859084 3.98259 0.876018 3.94035 0.876018 3.89022ZM1.30382 2.4642V4.24672C1.30382 4.295 1.28689 4.33678 1.25302 4.37206C1.21915 4.40734 1.17905 4.42498 1.1327 4.42498H0.362651C0.316305 4.42498 0.276198 4.40734 0.24233 4.37206C0.208462 4.33678 0.191528 4.295 0.191528 4.24672V2.4642C0.191528 2.41592 0.208462 2.37414 0.24233 2.33886C0.276198 2.30358 0.316305 2.28594 0.362651 2.28594H1.1327C1.17905 2.28594 1.21915 2.30358 1.25302 2.33886C1.28689 2.37414 1.30382 2.41592 1.30382 2.4642ZM4.46959 2.4642C4.46959 2.62388 4.42057 2.76221 4.32253 2.87919C4.34927 2.96089 4.36264 3.03145 4.36264 3.09087C4.36799 3.23198 4.32966 3.35917 4.24767 3.47244C4.27797 3.57642 4.27797 3.68504 4.24767 3.79831C4.22093 3.90414 4.1728 3.99141 4.10328 4.06011C4.11932 4.26808 4.07565 4.43612 3.97227 4.56424C3.85818 4.70535 3.68261 4.77777 3.44553 4.78148H3.10061C2.98296 4.78148 2.85462 4.76709 2.71559 4.73831C2.57655 4.70953 2.46826 4.68261 2.39072 4.65754C2.31318 4.63247 2.20578 4.5958 2.06853 4.54752C1.84928 4.46768 1.70846 4.42683 1.64607 4.42498C1.59972 4.42312 1.55962 4.40501 1.52575 4.37066C1.49188 4.33631 1.47495 4.295 1.47495 4.24672V2.46141C1.47495 2.41499 1.49099 2.37461 1.52308 2.34026C1.55516 2.3059 1.59349 2.28687 1.63805 2.28316C1.68083 2.27945 1.74856 2.22467 1.84126 2.11883C1.93395 2.01299 2.02397 1.90066 2.11131 1.78182C2.23252 1.62028 2.32254 1.50887 2.38136 1.4476C2.41345 1.41418 2.44108 1.36961 2.46425 1.31391C2.48742 1.25821 2.50302 1.21318 2.51104 1.17883C2.51906 1.14448 2.53109 1.08831 2.54714 1.01032C2.55961 0.937909 2.57076 0.881276 2.58056 0.840427C2.59036 0.799577 2.60774 0.751301 2.6327 0.695597C2.65765 0.639893 2.68796 0.593473 2.72361 0.556337C2.75747 0.521058 2.79758 0.503418 2.84393 0.503418C2.92592 0.503418 2.99945 0.513166 3.06451 0.532663C3.12958 0.552159 3.18305 0.576297 3.22494 0.605078C3.26683 0.633858 3.30248 0.671458 3.33189 0.717878C3.36131 0.764298 3.3827 0.806076 3.39606 0.843212C3.40943 0.880348 3.42013 0.926768 3.42815 0.982472C3.43617 1.03818 3.44063 1.07995 3.44152 1.10781C3.44241 1.13566 3.44286 1.17187 3.44286 1.21643C3.44286 1.28699 3.43439 1.35755 3.41745 1.4281C3.40052 1.49866 3.38359 1.55437 3.36665 1.59522C3.34972 1.63606 3.32521 1.68806 3.29312 1.75119C3.28778 1.76233 3.27886 1.77904 3.26639 1.80132C3.25391 1.8236 3.2441 1.84403 3.23697 1.86259C3.22984 1.88116 3.22271 1.90344 3.21558 1.92944H3.95622C4.09526 1.92944 4.21558 1.98236 4.31718 2.0882C4.41879 2.19403 4.46959 2.31937 4.46959 2.4642Z"/></svg></button>
                    <p className={`${reply.userReacted === 1  ? 'text-[#319357]' : 'text-[#C7C7C7]'}`}>{reply.likes}</p>
                    <button onClick={() => dislike(reply.commentReplyId)}><svg width="27" height="27" viewBox="0 0 6 5" fill={`${reply.userReacted === -1  ? '#D25551' : '#C7C7C7'}`} xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_54_1050)"><path d="M1.8447 1.57156C1.8447 1.61885 1.82742 1.65978 1.79286 1.69434C1.7583 1.7289 1.71738 1.74618 1.67008 1.74618C1.62097 1.74618 1.57959 1.7289 1.54594 1.69434C1.51229 1.65978 1.49547 1.61885 1.49547 1.57156C1.49547 1.52245 1.51229 1.48107 1.54594 1.44742C1.57959 1.41377 1.62097 1.39695 1.67008 1.39695C1.71738 1.39695 1.7583 1.41377 1.79286 1.44742C1.82742 1.48107 1.8447 1.52245 1.8447 1.57156ZM2.28124 2.96848V1.22233C2.28124 1.17504 2.26396 1.13411 2.2294 1.09955C2.19484 1.065 2.15391 1.04772 2.10662 1.04772H1.32086C1.27356 1.04772 1.23264 1.065 1.19808 1.09955C1.16352 1.13411 1.14624 1.17504 1.14624 1.22233V2.96848C1.14624 3.01577 1.16352 3.0567 1.19808 3.09126C1.23264 3.12581 1.27356 3.14309 1.32086 3.14309H2.10662C2.15391 3.14309 2.19484 3.12581 2.2294 3.09126C2.26396 3.0567 2.28124 3.01577 2.28124 2.96848ZM5.36155 2.56195C5.46159 2.67291 5.51161 2.80842 5.51161 2.96848C5.50979 3.11035 5.4575 3.23313 5.35473 3.33681C5.25196 3.44048 5.12964 3.49232 4.98777 3.49232H4.23201C4.23929 3.51779 4.24656 3.53962 4.25384 3.5578C4.26111 3.57599 4.27112 3.596 4.28385 3.61783C4.29658 3.63965 4.30568 3.65602 4.31113 3.66694C4.34387 3.73424 4.36843 3.78608 4.3848 3.82245C4.40117 3.85883 4.41845 3.91204 4.43664 3.98206C4.45483 4.05209 4.46392 4.12166 4.46392 4.19078C4.46392 4.23444 4.46347 4.26991 4.46256 4.29719C4.46165 4.32447 4.4571 4.3654 4.44892 4.41997C4.44073 4.47453 4.42982 4.52 4.41618 4.55638C4.40253 4.59276 4.38071 4.63369 4.3507 4.67916C4.32068 4.72463 4.28431 4.76146 4.24156 4.78966C4.19882 4.81785 4.14425 4.8415 4.07786 4.86059C4.01147 4.87969 3.93644 4.88924 3.85277 4.88924C3.80548 4.88924 3.76455 4.87196 3.72999 4.8374C3.69362 4.80103 3.66269 4.75555 3.63723 4.70099C3.61177 4.64642 3.59403 4.59913 3.58403 4.55911C3.57402 4.5191 3.56265 4.46362 3.54992 4.39268C3.53355 4.31629 3.52127 4.26127 3.51309 4.22762C3.5049 4.19397 3.48899 4.14986 3.46534 4.09529C3.4417 4.04072 3.4135 3.99707 3.38076 3.96433C3.32074 3.90431 3.22889 3.79517 3.1052 3.63693C3.01607 3.52052 2.92422 3.41047 2.82964 3.3068C2.73505 3.20312 2.66593 3.14946 2.62228 3.14582C2.57681 3.14218 2.5377 3.12354 2.50496 3.08989C2.47222 3.05624 2.45585 3.01668 2.45585 2.97121V1.22233C2.45585 1.17504 2.47313 1.13457 2.50769 1.10092C2.54225 1.06727 2.58317 1.04953 2.63047 1.04772C2.69413 1.0459 2.83782 1.00588 3.06155 0.927668C3.2016 0.880377 3.31119 0.844453 3.39031 0.819898C3.46944 0.795343 3.57993 0.768969 3.72181 0.740776C3.86368 0.712583 3.99464 0.698486 4.11469 0.698486H4.46665C4.70856 0.702124 4.88773 0.773061 5.00414 0.911298C5.10963 1.0368 5.1542 1.20141 5.13783 1.40513C5.20876 1.47243 5.25787 1.55792 5.28516 1.6616C5.31608 1.77255 5.31608 1.87896 5.28516 1.98081C5.36883 2.09177 5.40793 2.21636 5.40248 2.3546C5.40248 2.4128 5.38883 2.48192 5.36155 2.56195Z"/></g><defs><clipPath id="clip0_54_1050"><rect width="4.88921" height="4.88921" transform="translate(0.971436)"/></clipPath></defs></svg></button>
                    <p className={`${reply.userReacted === -1  ? 'text-[#D25551]' : 'text-[#C7C7C7]'}`}>{reply.dislikes}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EachReply;