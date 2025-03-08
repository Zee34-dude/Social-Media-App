import { SlLike } from "react-icons/sl";
import { CiShare1 } from "react-icons/ci";
import { BookMark } from '../SvgComponents/BookMark';
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import { Popup } from "./MenuPopup";
import { db } from "../config/Firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import Skeleton from "react-loading-skeleton";
import { FadeLoader, ScaleLoader } from "react-spinners";

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
interface Comments {
  comment: string,
  postId: string,
  userId: string
  id: string,
  username: string
}

export const Post = ({ username, img, text, profilePic, id, isUserPost }: Props) => {
  const [likesCount, setLikesCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [comment, setComment] = useState<string | null>(null)
  const [commentList, setCommentList] = useState<Comments[]>([])
  const [enterPressed, setEnterPressed] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)
  const { popUp, user } = useContext(UserContext);
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const likesRef = collection(db, 'likes');
  const commentsRef = collection(db, 'comments')
  const commentsDoc = query(commentsRef, where('postId', '==', id))
  const likesDoc = query(likesRef, where('postId', '==', id));
  const newLikedState = !liked;
  const newList = commentList?.map((doc, index) =>
    <div key={index} className="flex gap-2 items-center">
      <p className="text-[0.75rem] text-white">{doc.username}</p>
      <p className="text-[0.75rem] text-gray-400" >{doc.comment}</p>
    </div>)
  const getComments = async () => {
    const commentData = await getDocs(commentsDoc)
    setCommentList(
      commentData.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Comments[]
    )
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

  useEffect(() => {
    const fetchLikes = async () => {
      const likesData = await getDocs(likesDoc);
      const userLike = likesData.docs.find(doc => doc.data().userId === user?.uid);
      setLikesCount(likesData.docs.length);
      setLiked(!!userLike);

    };
    getComments()
    fetchLikes();
  }, [id, user?.uid]);
  console.log(commentList, newList)
  function handleComment(e: any) {
    setComment(e.currentTarget.value)

  }

  async function addComment() {
    setCommentLoading(true)
    try {
      setCommentLoading(true)
      if (comment !== null) {
        await addDoc(commentsRef, {
          postId: id,
          userId: user?.uid,
          comment: comment,
          username: user?.displayName
        })
      }
    
    }
    catch (err) {

    }
    finally {
      setCommentLoading(false)
    }

  }


  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      setEnterPressed(!enterPressed)
      if(inputRef.current)inputRef.current.value='';
      
    }
  })
  useEffect(() => {
    if (enterPressed){ 
      if(comment){
        setCommentList((prev) => [...prev, { comment: comment, username: user?.displayName }] as Comments[])
        addComment()
      }
    }

  }, [enterPressed])

  return (
    <div className="flex mb-4 max-md:justify-center relative">
      {popUp && <Popup id={id} />}
      <div className="flex flex-col border-b border-b-[#b9b5b58c] w-[500px]">
        <div className="flex max-[600px]:px-2">
          <span className='flex gap-2'>
            <span className="w-[2rem] h-[2rem]">
              <img className="w-full h-full rounded-[50%] object-cover" src={profilePic} alt="" />
            </span>
            <span className="text-[14px]">{username}</span>
          </span>
          <span onClick={() => isUserPost(id)} className="ml-auto relative">
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
              <div>
                <svg aria-hidden="true" className="icon-comment" fill="currentColor" height="16" icon-name="comment-outline" viewBox="0 0 20 20" width="16">
                  <path d="M10 19H1.871a.886.886 0 0 1-.798-.52.886.886 0 0 1 .158-.941L3.1 15.771A9 9 0 1 1 10 19Zm-6.549-1.5H10a7.5 7.5 0 1 0-5.323-2.219l.54.545L3.451 17.5Z"></path>
                </svg>
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
          </div>
          <div className="comments ">
            {newList}
          </div>
          <div className="w-full mt-4 relative">
            <textarea onChange={handleComment} ref={inputRef} placeholder="Add comment..." className="w-full text-xs resize-none outline-0"></textarea>
            {commentLoading && <div className="absolute left-[5%] top-0"><ScaleLoader height={20} color="gray" /></div>}
          </div>
        </div>
      </div>
    </div>
  );
};
