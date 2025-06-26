"use client"

import { doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from "lucide-react"
import { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { db, commentCollection, likesCollection } from "../config/Firebase"
import { Posts } from "./Home"
import { Comment } from "../Components/Posts"
import { commentUtils } from "../utils/commentUtils"
import { Comments } from "../Components/Comments"
import { UserContext } from "../App"
import AutoPlayVideo from "../Components/utilsComponents/AutoPlayVideo"
import { followUtils } from "../utils/followUtils"
import { FirebaseContext } from "../Context/FirebaseContext"
import Skeleton from "react-loading-skeleton"
import { likesUtils } from "../utils/likesUtils"

export default function ViewPostPage() {

  const [isSaved, setIsSaved] = useState(false)
  const [postData, setPostData] = useState<Posts | null>(null)
  const [commentData, setCommentData] = useState<Comment[]>([])
  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const [showComments, setShowComments] = useState(false)
  const [loadingState, setLoadingState] = useState(false)
  const { user } = useContext(UserContext)
  const { followingCount } = useContext(FirebaseContext)
  const { addFollow, removeFollow, loader } = followUtils()
  const { id } = useParams()
  const { addComment, commentLoading, handleComment, comment } = commentUtils()
  const { handleLike,setLikesCount,setLiked,likesCount,liked } = likesUtils()
  const commentsRef = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const inputRef = useRef<HTMLInputElement | null>(null)
  const likesDoc = query(likesCollection, where('postId', '==', id));


  useEffect(() => {
    const fetchPost = async () => {
      setLoadingState(true)
      if (id) {
        const postRef = doc(db, 'posts', id)
        const commentQuery = query(commentCollection, where('postId', '==', id))
        const postSnapshot = await getDoc(postRef)
        if (postSnapshot.exists()) {
          setPostData(postSnapshot.data() as Posts)
        } else {
          setPostData(null)
        }

        const qData = await getDocs(commentQuery)
        setCommentData(qData.docs.map((doc) => ({ ...doc.data(), commentId: doc.id })) as Comment[])
      }
      setLoadingState(false)
    }
    const fetchLikes = async () => {
      const likesData = await getDocs(likesDoc);
      const userLike = likesData.docs.find(doc => doc.data().userId === user?.uid);
      setLikesCount(likesData.docs.length);
      setLiked(!!userLike);

    };
    fetchPost()
    fetchLikes()
  }, [id])

  useEffect(() => {
    if (followingCount && postData && user) {
      const followingUserId = followingCount.find((post: any) => post.userId === postData?.userId)
      setIsFollowing(!!followingUserId)
    }
  }, [followingCount, postData, user])




  return (
    <div className="min-h-screen pl-0 pt-0 lg:pl-64 md:pl-15 lg:pt-14">

      <div className="max-w-6xl mx-auto px-2 lg:px-4">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Main Post Content */}
          <div className="flex-1 lg:max-w-2xl">
            <div className="rounded-none lg:rounded-lg overflow-hidden">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4 border-b border-skin mt-12 lg:mt-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#888BF4] to-[#5151C6] p-0.5">
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <img
                        src={postData?.profilePic}
                        alt="www.chess.com"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  {loadingState ? <div className="w-20 h-4"><Skeleton className='w-full h-full' /></div> : <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{postData?.username}</span>
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>

                    {postData && (isFollowing ? <div onClick={loader ? undefined : () => removeFollow(postData?.userId)}
                      className=" text-sm text-[#3c42d6]">{loader ? <div className='spinner border-2  border-[#5b5b5c] border-b-transparent  w-5 h-5'></div>
                        : 'Following'}</div>
                      :
                      <div onClick={loader ? undefined : () => addFollow(postData?.userId)}
                        className="text-sm text-[#3c42d6]">{loader ? <div className='spinner border-2 border-[#5b5b5c]  border-b-transparent w-5 h-5'></div>
                          : 'Follow'}</div>)}
                  </div>}

                </div>
                <MoreHorizontal className="w-6 h-6 cursor-pointer" />
              </div>

              {/* Post Content */}
              <div className="relative">
                <div className="p-4  text-center">
                  <div className="mt-4 lg:mt-6 ">
                    {postData?.image ? <img
                      src={postData?.image} alt="Meme reaction"
                      className="w-full max-w-sm lg:max-w-[599px] mx-auto rounded-lg aspect-[1/1]  object-cover"
                    /> : <AutoPlayVideo className=" mx-auto  w-full max-w-sm lg:max-w-[599px]  rounded-lg aspect-[1/1] object-cover" src={postData?.video} />}
                  </div>
                </div>
              </div>

              {/* Post Actions */}
              <div className="p-4">

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <button  className="hover:opacity-70 transition-opacity flex items-center gap-1">
                      {id && <Heart onClick={() => handleLike(id)} className={`w-6 h-6 ${liked ? "fill-red-500 text-red-500" : ""}`} />}
                      <span>{likesCount}</span>
                    </button>
                    <button
                      className="hover:opacity-70 transition-opacity lg:hidden"
                      onClick={() => setShowComments(!showComments)}
                    >
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="hover:opacity-70 transition-opacity hidden lg:block">
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="hover:opacity-70 transition-opacity">
                      <Send className="w-6 h-6" />
                    </button>
                  </div>
                  <button onClick={() => setIsSaved(!isSaved)} className="hover:opacity-70 transition-opacity">
                    <Bookmark className={`w-6 h-6 ${isSaved ? "fill-white" : ""}`} />
                  </button>
                </div>
                <div className="mb-4"><span>{postData?.text}</span></div>
                <div className="text-sm font-semibold mb-2"></div>
                <div className="text-xs"></div>

                {/* Add Comment */}
                <div className="flex items-center gap-3 relative pt-4 border-t border-skin">
                  <Smile className="w-6 h-6 cursor-pointer" />
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    ref={inputRef}
                    onChange={handleComment}
                    className="flex-1 bg-transparent text-sm placeholder-gray-400 outline-none"
                  />
                  {commentLoading && <div style={{
                    borderColor: '#5b5b5c',
                    borderBottomColor: 'transparent'
                  }} className="spinner border-2 absolute right-[50%] top-4 w-5 h-5"> </div>}
                  {comment && id && <button onClick={() => addComment(inputRef, id)} className="text-blue-500 text-sm font-semibold">Post</button>}
                </div>

              </div>
            </div>
          </div>

          {/* Comments Section - Desktop */}
          <div className="hidden lg:block w-80 border-l pl-6 pt-4" style={{ borderColor: "var(--border-color)" }}>
            <div className="space-y-4">
              {id && commentData?.map((doc, index) => {
                const userComment = user?.displayName == doc.username ? true : false
                return (
                  <Comments
                    username={doc.username}
                    commentId={doc.commentId}
                    comment={doc.comment}
                    img={doc.img}
                    key={index}
                    id={id}
                    userId={doc.userId}
                    userComment={userComment}
                    commentsRef={commentsRef}


                  />

                )
              })}
            </div>
          </div>
        </div>

        {/* Comments Section - Mobile */}
        {showComments && (
          <div className="lg:hidden border-t p-4" style={{ borderColor: "var(--border-color)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Comments</h3>
              <button onClick={() => setShowComments(false)} className="text-gray-400">
                ✕
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {commentData?.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img
                    src={comment.img || "/placeholder.svg"}
                    alt={comment.username}
                    className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-semibold text-sm mr-2">{comment.username}</span>
                        <span className="text-gray-300 text-sm">1w ago</span>
                      </div>
                      <Heart className="w-3 h-3 cursor-pointer hover:opacity-70" />
                    </div>
                    <p className="text-sm mt-1 text-gray-100">{comment.comment}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span> 2 likes</span>
                      <button className="hover:text-gray-300">Reply</button>
                    </div>
                    {true && (
                      <button className="text-xs text-gray-400 mt-2 hover:text-gray-300">
                        View all replies
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



// text-[#3c42d6]