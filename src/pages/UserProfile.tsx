import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { themeContext } from "../Context/ThemeContext"
import { UserPosts } from "../Components/User'sPosts"
import { BsPostcardHeart } from "react-icons/bs";
import { CiShare1 } from "react-icons/ci"
import { Link, useParams } from "react-router-dom"
import { Avatar } from "../Components/RandomAvatar"
import { ImageContext } from "../Context/ImageContext"
import { followCollection, userCollection } from "../config/Firebase";
import { getDocs, query, where } from "firebase/firestore";
import { User } from "../Components/RandomAvatar";
import { FirebaseContext } from "../Context/FirebaseContext";


export const UserProfile = () => {
  const [userInfo, setUserInfo] = useState<User[] | null>(null)
  const [currentTab, setCurrentTab] = useState('posts')
  const [usersFollows, setUsersFollows] = useState<any>()
  const [usersFollowing, setUsersFollowing] = useState<any>()
  const { user } = useContext(UserContext)
  const { theme } = useContext(themeContext)
  const { preview } = useContext(ImageContext)
  const { followingCount, followsCount } = useContext(FirebaseContext)
  const { userId } = useParams()



  const queryData = query(userCollection, where('userId', '==', userId || user?.uid))
  const getUserBio = async () => {
    const data = await getDocs(queryData)
    setUserInfo(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as User[]
    )

  }


  useEffect(() => {
    getUserBio()
  }, [userId])

  useEffect(() => {
    const fetchFollowers = async () => {
      const followDoc = query(followCollection, where('userId', '==', userId))
      const followingDoc = query(followCollection, where('followerId', '==', userId))
      const followsData = await getDocs(followDoc)
      const followingData = await getDocs(followingDoc)
      setUsersFollows(followsData.docs.map((doc) => ({ ...doc.data() })))
      setUsersFollowing(followingData.docs.map((doc) => ({ ...doc.data() })))

    }
    fetchFollowers()
  }, [userId])
  return (
    <div className="w-full pb-38">
      <div className=" md:ml-[25vw] pt-20">
        <div className=" flex flex-col justify-center max-[768px]:px-[20px]">
          <div className="flex  max-[420px]:flex-col items-start gap-6  ">
            <div className="flex items-center gap-4">
              {/**profile div */}
              <span className="h-25 w-25 max-[340px]:h-18 max-[340px]:w-18">
                {/**profile image */}
                <Avatar preview={userInfo && userInfo[0].RandomId || preview} />
              </span>
              <span className=" flex flex-col relative ">
                <p className="text-2xl font-bold"> {userInfo && userInfo[0].userName || user?.displayName}</p>
                <p className="text-gray-400 text-[0.875rem]">{(userId == user?.uid) && user?.email}</p>
                <p className=" text-[0.875rem] w-50 ">
                  {userInfo ? userInfo[0].Bio : ''}
                </p>
              </span>
            </div>
            {(userId == user?.uid) && <div className={`min-[420px]:absolute right-4 text-[0.875rem]
         ${theme === 'dark' ? `bg-[#363636]` : `bg-[#EFEFEF]`} rounded-4xl p-2`}>
              <Link to='/edit-profile'> Edit Profile</Link>
            </div>}
          </div>

          <div className=" md:w-[88%] w-[100%] flex justify-center gap-6 pt-20 text-xl ">
            {/* <span>{postsList?.length}posts</span> */}
            <span>{usersFollowing?.length || followsCount.length} followers</span>
            <span>{usersFollows?.length || followingCount.length} following</span>
          </div>
          <div className=" w-[100%] border-gray-400 mt-30">
            <div className=" border-t h-full  md:w-[88%]  flex  justify-center gap-10 text-[0.875rem] pt-2">
              <span onClick={() => setCurrentTab('posts')} className={`flex items-center gap-2 ${currentTab === 'posts' && 'border-b-2'} `}>
                <BsPostcardHeart className='w-[1.2rem] h-[1.2rem]' />
                POSTS
              </span>
              { user?.uid==userId && <span className=' flex justify-center gap-10'>

                <span onClick={() => setCurrentTab('comments')} className={`flex items-center gap-2 ${currentTab === 'comments' && 'border-b-2'} `}>
                  <svg aria-hidden="true" className="icon-comment" fill="currentColor" height="16" icon-name="comment-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M10 19H1.871a.886.886 0 0 1-.798-.52.886.886 0 0 1 .158-.941L3.1 15.771A9 9 0 1 1 10 19Zm-6.549-1.5H10a7.5 7.5 0 1 0-5.323-2.219l.54.545L3.451 17.5Z"></path> </svg>
                  COMMENTS
                </span>
                <span onClick={() => setCurrentTab('saved')} className="flex items-center gap-2">
                  <CiShare1 className='w-[1.2rem] h-[1.2rem]' />
                  SAVED
                </span>
              </span>

              }
            </div>
          </div>
          <div>
            <UserPosts
              currentTab={currentTab}
              userId={userId || ''}
            />
          </div>
        </div>
      </div>
    </div>


  )

}