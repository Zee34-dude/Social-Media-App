
import { CiShare1 } from "react-icons/ci";
import { BookMark } from '../SvgComponents/BookMark';
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import { Popup } from "./MenuPopup";
import { commentCollection, db, likesCollection } from "../config/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { HomeContext } from "../pages/Home";
import { themeContext } from "../Context/ThemeContext.tsx";
import { Comments } from "./Comments.tsx";
import { MdClose } from "react-icons/md";
import AutoPlayVideo from "./utilsComponents/AutoPlayVideo.tsx";
import { commentUtils } from "../utils/commentUtils.ts";
import { stateContext } from "../Context/StateContext.tsx";
import { Heart } from "lucide-react";
import { followUtils } from "../utils/followUtils.ts";
import { likesUtils } from "../utils/likesUtils.ts";


interface Props {
  username: string,
  img: string,
  text: string,
  profilePic: string,
  loading: boolean,
  id: string,
  userId: string,
  isUserPost: Function
  video: string
}
export interface Comment {
  comment: string,
  postId: string,
  userId: string
  id: string,
  username: string,
  img: string,
  commentId: string
}

export const Post = ({ username, img, text, profilePic, id, isUserPost, userId, video }: Props) => {
  const [commentList, setCommentList] = useState<Comment[]>([])
  const { user } = useContext(UserContext)
  const { popUpId } = useContext(stateContext)
  const { commentPop, setCommentPop } = useContext(HomeContext)
  const { theme } = useContext(themeContext)
  const { handleComment, comment, commentLoading, addComment, volatileList, deleteComment } = commentUtils()
  const { setFollowed} = followUtils()
  const { handleLike, likesCount, liked, setLikesCount, setLiked } = likesUtils()
  const commentsRef = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const commentBtnRef = useRef<HTMLDivElement | null>(null)
  const postRef = useRef<HTMLSpanElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const commentsDoc = query(commentCollection, where('postId', '==', id))
  const likesDoc = query(likesCollection, where('postId', '==', id));
  const followRef = collection(db, 'follow');
  const followDoc = query(followRef, where('userId', '==', userId))
  const fetchFollowers = async () => {
    const followerData = await getDocs(followDoc)
    const userFollowed = followerData.docs.find(doc => doc.data().followerId == user?.uid)
    setFollowed(!!userFollowed)
   
  }
  const getComments = async () => {
    const commentData = await getDocs(commentsDoc)

    setCommentList(
      commentData.docs.map((doc) => ({ ...doc.data(), commentId: doc.id })) as Comment[]
    );

  }


  //gets all the necessary from firebase
  useEffect(() => {
    const fetchLikes = async () => {
      const likesData = await getDocs(likesDoc);
      const userLike = likesData.docs.find(doc => doc.data().userId === user?.uid);
      setLikesCount(likesData.docs.length);
      setLiked(!!userLike);

    };

    fetchLikes();
    fetchFollowers()

  }, [id, user?.uid, commentList.length]);
  // state that holds comment temporary

  //function that allows user to comment

  useEffect(() => {
    const handleKeydown = (e: any) => {
      if (e.key === 'Enter') {

        postRef.current?.click()
        if (inputRef.current) {
          inputRef.current.disabled = true
        }
        if (inputRef.current) inputRef.current.disabled = false

      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (commentsRef.current['second'] && commentsRef.current['first'] &&
        commentBtnRef.current && !commentsRef.current['first']?.contains(event.target as Node) &&
        !commentsRef.current['second']?.contains(event.target as Node) &&
        !commentBtnRef.current?.contains(event.target as Node)) {
        setCommentPop(null)
  
      }
    }

    if (commentPop) {
      document.addEventListener('click', handleClick);
    }

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [commentPop]);

  useEffect(() => {
    getComments()
  }, [deleteComment])


  const newList: any = commentList.length > 0 ? commentList.map((doc, index) =>
  //display if any comments 

  {
    const userComment = user?.displayName == doc.username ? true : false
    return <Comments
      username={doc.username}
      commentId={doc.commentId}
      comment={doc.comment}
      img={doc.img}
      key={index}
      id={id}
      commentsRef={commentsRef}
      userId={userId}
      userComment={userComment}
      cb={setCommentList}




    />
  }



  ) : (
    //if no comments display this 
    <div className="flex  flex-col items-center justify-center h-full">
      <p className="text-2xl  font-bold">Sorry, no Comments</p>
      <div className="w-40 h-40 mt-20">
        <img src="src\assets\message.png" alt="" />
      </div>
    </div>
  )

  return (

    <div className=" flex mb-4 max-md:justify-center relative">

      {popUpId == id &&
        <Popup
          id={id}
          userId={userId}
          

        />}
      {/* comment section */}
      {commentPop?.id === id && commentPop?.userId === userId &&

        <div className="fixed z-12 top-[20%] min-[768px]:left-[25%] animate-pop w-full">

          <div ref={el => (commentsRef.current['first'] = el)} className={`${theme == 'dark' ? `bg-[#1b1c1d]` : 'bg-[#ffffff]'} min-[768px]:w-[50%] h-[400px] min-w-[300px] rounded-[5px] shadow-[0px_5px_10px_rgba(0,0,0,0.1)]`}>
            <div className="w-full border-b-[#adadad] border-b text-center py-2">Comments</div>
            {/* comment list */}
            <div className="p-4">{newList}</div>
          </div>
        </div>
      }

      <div className="flex flex-col border-b border-b-[#b9b5b58c] w-[500px]">
        <div className="flex max-[600px]:px-2">
          <span className='flex gap-2'>
            <span className="w-[2rem] h-[2rem]">
              <img className="w-full h-full rounded-[50%] object-cover" src={profilePic} alt="" />
            </span>
            <span className="text-[14px]">{username} </span>
          </span>
          <span onClick={() => { isUserPost(id, undefined) }} className="ml-auto relative">
            <svg aria-label="More options" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
              <title>More options</title>
              <circle cx="12" cy="12" r="1.5"></circle>
              <circle cx="6" cy="12" r="1.5"></circle>
              <circle cx="18" cy="12" r="1.5"></circle>
            </svg>
          </span>
        </div>
        <div className="mt-4 relative h-[500px] max-[600px]:h-[min(400px,100vw)]">
          {video ? <AutoPlayVideo src={video} style={
            { height: '100%' }
          } className="h-full w-full object-cover scale-100 rounded-[3px] border-1 border-[#b9b5b58c]" autoPlay={true} controls>
            Your browser does not support the video tag.
          </AutoPlayVideo> : <img className='h-full w-full object-cover scale-100 rounded-[3px] border-1 border-[#b9b5b58c]' src={img} alt="" />

          }
        </div>
        <div className='content flex flex-col max-[600px]:px-4'>
          <div className='flex mt-4'>
            <span className='flex items-center gap-5 pl-2'>
              <div className="flex items-center gap-1" >
                <Heart onClick={() => handleLike(id)} className={`w-6 h-6 ${liked ? "fill-[#450ace] text-[#450ace]" : ""}`} />
                <p>{likesCount}</p>
              </div>
              <div onClick={() => isUserPost(id, userId)} ref={commentBtnRef} className="flex items-center gap-1">
                <svg aria-hidden="true" className="icon-comment" fill="currentColor" height="20" icon-name="comment-outline" viewBox="0 0 20 20" width="20">
                  <path d="M10 19H1.871a.886.886 0 0 1-.798-.52.886.886 0 0 1 .158-.941L3.1 15.771A9 9 0 1 1 10 19Zm-6.549-1.5H10a7.5 7.5 0 1 0-5.323-2.219l.54.545L3.451 17.5Z"></path>
                </svg>
                <p>{commentList.length}</p>
              </div>
              <div>
                <CiShare1 className='w-6 h-6' />
              </div>
            </span>
            <span className='ml-auto'>
              <BookMark />
            </span>
          </div>
          <div className="write-up mt-2 mb-2">
            <p className='text-[14px]'>{text}</p>
            {/** Display the comments temporarily under the post before a refresh*/}
            <div className="mt-2">{volatileList.map((list, index) => list.username === user?.displayName ? (
              <div key={index} className="flex gap-1">
                <p className="text-[0.75rem]">{list.username}</p>
                <p className="text-[0.75rem] text-gray-400" >{list.comment}</p>
              </div>) : '')}
            </div>
          </div>
          <div className="comments ">
            <p ref={el => (commentsRef.current.second = el)} onClick={() => isUserPost(id, userId)} className="text-[12px] w-30 text-[#7c7a7a] mt-2">View all Comments...</p>
          </div>
          <div className="w-full mt-4 relative">
            <textarea name="textarea" onChange={handleComment} ref={inputRef} placeholder="Add comment..." className="w-full text-xs resize-none outline-0">

            </textarea>
            {commentLoading && <div style={{
              borderColor: '#5b5b5c',
              borderBottomColor: 'transparent'
            }} className='spinner border-2 absolute right-[50%] top-2 w-5 h-5'> </div>
            }
            {comment && <span onClick={() => addComment(inputRef, id, setCommentList)} ref={postRef} className="absolute text-sm top-0 text-blue-500 right-4">Post</span>
            }   </div>
        </div>
      </div>
      {(commentPop) &&
        (<div className={`bg-[#0a0a0a3b] fixed top-0 left-0 right-0 bottom-0 z-3`}>
          <div onClick={() => { setCommentPop(null) }} className='fixed right-10 top-14'>
            <MdClose fill='white' className='si' size={30} />
          </div>
        </div>)
      }
    </div >
  );
};
