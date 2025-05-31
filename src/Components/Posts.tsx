import { SlLike } from "react-icons/sl";
import { CiShare1 } from "react-icons/ci";
import { BookMark } from '../SvgComponents/BookMark';
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import { Popup } from "./MenuPopup";
import { db } from "../config/Firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { HomeContext } from "../pages/Home";
import { themeContext } from "./ThemeContext";
import { Comments } from "./Comments.tsx";


interface Props {
  username: string,
  img: string,
  text: string,
  profilePic: string,
  loading: boolean,
  id: string,
  userId: string,
  isUserPost: Function
}
export interface Comments {
  comment: string,
  postId: string,
  userId: string
  id: string,
  username: string,
  img: string,
  commentId: string
}

export const Post = ({ username, img, text, profilePic, id, isUserPost, userId }: Props) => {
  const [likesCount, setLikesCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [comment, setComment] = useState<string | null>(null)
  const [commentList, setCommentList] = useState<Comments[]>([])
  const [volatileList, setVolatileList] = useState<Comments[]>([])
  const [commentLoading, setCommentLoading] = useState(false)
  const { popUp, user } = useContext(UserContext);
  const { commentPop, setCommentPop, setUserComment } = useContext(HomeContext)
  const { theme } = useContext(themeContext)
  const postRef = useRef<HTMLSpanElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const commentSectionRef = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const likesRef = collection(db, 'likes');
  const commentsRef = collection(db, 'comments')
  const commentsDoc = query(commentsRef, where('postId', '==', id))
  const likesDoc = query(likesRef, where('postId', '==', id));
  const newLikedState = !liked;
  const UserRef = collection(db, 'user')
  const userDoc = query(UserRef, where('userId', '==', user?.uid));

  const getComments = async () => {
    const commentData = await getDocs(commentsDoc)

    setCommentList(
      commentData.docs.map((doc) => ({ ...doc.data(), commentId: doc.id })) as Comments[]
    );

  }
  const debounce = (cb: Function, delay = 3000) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => cb(...args), delay);
    };
  };

  // Debounced functions
  const updateLike = debounce(async () => {
    try {
      if (newLikedState) {
        await addDoc(likesRef, { userId: user?.uid, postId: id });
        console.log('Like added');
      } else {
        const deleteQuery = query(likesRef, where('postId', '==', id), where('userId', '==', user?.uid));
        const deleteData = await getDocs(deleteQuery);
        if (!deleteData.empty) {
          const deleteId = doc(db, 'likes', deleteData.docs[0].id);
          await deleteDoc(deleteId);
          console.log('Like removed');
        }
      }
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
  }, 1000); // Shorter debounce for faster UI response

  // Like handler
  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(likesCount + (newLikedState ? 1 : -1));
    updateLike(newLikedState); // Pass the state to debounced function
  };

  //gets all the necessary from firebase
  useEffect(() => {
    const fetchLikes = async () => {
      const likesData = await getDocs(likesDoc);
      const userLike = likesData.docs.find(doc => doc.data().userId === user?.uid);
      setLikesCount(likesData.docs.length);
      setLiked(!!userLike);

    };
    getComments()
    fetchLikes();

  }, [id, user?.uid, commentList.length]);
  // state that holds comment temporary
  function handleComment(e: any) {
    setComment(e.currentTarget.value)
    console.log(e.currentTarget.value)

  }
  //function that allows user to comment
  async function addComment() {
    if (inputRef.current) inputRef.current.value = '';
    setCommentLoading(true)
    const imageData = await getDocs(userDoc)
    const img = imageData.docs[0].data().RandomId
    try {

      setCommentLoading(true)
      if (comment !== null) {
        await addDoc(commentsRef, {
          postId: id,
          userId: user?.uid,
          comment: comment,
          username: user?.displayName,
          img: img
        })
      }

    }
    catch (err) {

    }
    finally {
      setVolatileList((prev) => [...prev, { comment: comment, username: user?.displayName, img: img, }] as Comments[])
      setCommentList((prev) => [...prev, { comment: comment, username: user?.displayName, img: img, }] as Comments[])

      setCommentLoading(false)
      setComment(null)
    }
  }
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
      if (commentSectionRef.current['first'] && commentSectionRef.current['second'] && !commentSectionRef.current['first']?.contains(event.target as Node) && !commentSectionRef.current['second']?.contains(event.target as Node)) {
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


  const deleteComment = async (commentId: string) => {
    setCommentList((comments) => comments ? comments.filter(cment => cment.commentId !== commentId) : [])
    setVolatileList((comments) => comments ? comments.filter(cment => cment.commentId !== commentId) : [])
    const cmentToDeleteData = doc(db, 'comments', commentId)
    try {
      await deleteDoc(cmentToDeleteData)

    }
    catch (err) {

    }
    finally {

    }
    console.log('money')
  }



  function isUserComment( commentId: string) {

    commentList.map((comment)=>{
      if(commentId==comment.commentId){
        comment.username===user?.displayName?setUserComment(true):setUserComment(false)
      }
    })

  }
  const newList: any = commentList.length > 0 ? commentList.map((doc, index) =>
    //display if any comments 
    <Comments
      username={doc.username}
      commentId={doc.commentId}
      comment={doc.comment}
      img={doc.img}
      key={index}
      commentSectionRef={commentSectionRef}
      deleteComment={deleteComment}

      id={id}
      userId={userId}
      isUserComment={isUserComment}



    />


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
      {popUp && <Popup id={id} />}

      {commentPop?.id === id && commentPop?.userId === userId &&
        <div className="fixed z-12 top-[20%] left-[25%] w-full ">
          {/* comment section */}
          <div ref={el => (commentSectionRef.current['first'] = el)} className={`${theme == 'dark' ? `bg-[#1b1c1d]` : 'bg-[#ffffff]'} w-[50%] h-[400px] min-w-[300px] rounded-[5px] shadow-[0px_5px_10px_rgba(0,0,0,0.1)]`}>
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
            <span className="text-[14px]">{username}</span>
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
          <img className='h-full w-full object-cover scale-100 rounded-[3px] border-1 border-[#b9b5b58c]' src={img} alt="" />
        </div>
        <div className='content flex flex-col max-[600px]:px-4'>
          <div className='flex mt-4'>
            <span className='flex items-center gap-5 pl-2'>
              <div className="flex items-center gap-1" >
                <SlLike onClick={handleLike} className={`w-[1rem] h-[1rem] ${liked ? 'text-red-500' : 'text-gray-500'}`} />
                <p>{likesCount}</p>
              </div>
              <div className="flex items-center gap-1">
                <svg aria-hidden="true" className="icon-comment" fill="currentColor" height="16" icon-name="comment-outline" viewBox="0 0 20 20" width="16">
                  <path d="M10 19H1.871a.886.886 0 0 1-.798-.52.886.886 0 0 1 .158-.941L3.1 15.771A9 9 0 1 1 10 19Zm-6.549-1.5H10a7.5 7.5 0 1 0-5.323-2.219l.54.545L3.451 17.5Z"></path>
                </svg>
                <p>{commentList.length}</p>
              </div>
              <div>
                <CiShare1 className='w-[1.2rem] h-[1.2rem]' />
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
            <p ref={el => (commentSectionRef.current.second = el)} onClick={() => isUserPost(id, userId)} className="text-[12px] w-30 text-[#7c7a7a] mt-2">View all Comments...</p>
          </div>
          <div className="w-full mt-4 relative">
            <textarea onChange={handleComment} ref={inputRef} placeholder="Add comment..." className="w-full text-xs resize-none outline-0">

            </textarea>
            {commentLoading&& <div style={{
              borderColor:'#5b5b5c',
              borderBottomColor:'transparent'
            }} className='spinner absolute right-[50%] top-2 w-5 h-5'> </div>}
            {comment && <span onClick={addComment} ref={postRef} className="absolute text-sm top-0 text-blue-500 right-4">Post</span>
            }   </div>
        </div>
      </div>
    </div>
  );
};
