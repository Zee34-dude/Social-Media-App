import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { themeContext } from "../Components/ThemeContext"
import { UserPosts } from "../Components/User'sPosts"
import { BsPostcardHeart } from "react-icons/bs";
import { CiShare1 } from "react-icons/ci"
import { Link } from "react-router-dom"
import { Avatar } from "../Components/RandomAvatar"
import { ImageContext } from "../Components/ImageProvider"
import { db } from "../config/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { User } from "../Components/RandomAvatar";


export const UserProfile = () => {
  const [userInfo, setUserInfo] = useState<User[] | null>(null)
  const { user } = useContext(UserContext)
  const { theme } = useContext(themeContext)
  const { preview } = useContext(ImageContext)
  const userRef = collection(db, 'user')
  const queryData = query(userRef, where('userId', '==', user?.uid))
  const getUserBio = async () => {
    const data = await getDocs(queryData)
    setUserInfo(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as User[]
    )

  }
  useEffect(() => {
    getUserBio()
  }, [])
  console.log()
  return (
    <div className="w-full pb-38">
      <div className=" md:ml-[25vw] pt-20">
        <div className=" flex flex-col justify-center">
          <div className="flex items-center ">
            <div className="flex items-center gap-4">
              {/**profile div */}
              <span className="h-30 w-30">
                {/**profile image */}
                <Avatar preview={preview} />
              </span>
              <span className=" flex flex-col relative ">
                <p className="text-3xl font-bold"> {user?.displayName}</p>
                <p className="text-gray-400 text-[0.875rem]">{user?.email}</p>
                <p className=" text-[0.875rem] w-50 absolute bottom-[-50px]">
                  {userInfo ? userInfo[0].Bio : ''}
                </p>
              </span>
            </div>
            <div className={`absolute right-4 text-[0.875rem]
         ${theme === 'dark' ? `bg-[#363636]` : `bg-[#EFEFEF]`} rounded-4xl p-2`}>
              <Link to='/edit-profile'> Edit Profile</Link>
            </div>
          </div>

          <div className="w-[88%] flex justify-center gap-6 pt-20 text-xl ">
            <span>0 posts</span>
            <span>0 followers</span>
            <span>0 following</span>
          </div>
          <div className="border-t w-[88%] border-gray-400 mt-30">
            <div className="h-full  w-full flex  justify-center gap-10 text-[0.875rem] pt-2">
              <span className="flex items-center gap-2 ">
                <BsPostcardHeart className='w-[1.2rem] h-[1.2rem]' />
                POSTS
              </span>
              <span className="flex items-center gap-2">
                <svg aria-hidden="true" className="icon-comment" fill="currentColor" height="16" icon-name="comment-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M10 19H1.871a.886.886 0 0 1-.798-.52.886.886 0 0 1 .158-.941L3.1 15.771A9 9 0 1 1 10 19Zm-6.549-1.5H10a7.5 7.5 0 1 0-5.323-2.219l.54.545L3.451 17.5Z"></path> </svg>
                COMMENTS
              </span>
              <span className="flex items-center gap-2">
                <CiShare1 className='w-[1.2rem] h-[1.2rem]' />
                SAVED
              </span>
            </div>
          </div>
          <div>
            <UserPosts />
          </div>
        </div>
      </div>
    </div>


  )

}