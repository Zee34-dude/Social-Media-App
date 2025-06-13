import { useContext,  useState } from "react";
import { UserContext } from "../App";
import { HomeContext } from "../pages/Home";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/Firebase";

interface MenubarProps {
  id: string
  userId: string
  followed: boolean
  setFollowed: Function
}
export const Popup = ({ userId, followed, setFollowed }: MenubarProps) => {
  const { userPost, menuRef, popUpId, user } = useContext(UserContext)
  const { deletePost } = useContext(HomeContext)
  const [loader, setLoader] = useState<boolean>(false)
  const followRef = collection(db, 'follow');
  const followDoc = query(followRef, where('userId', '==', userId))

  const addFollow = async () => {
    setLoader(true)
    try {
      await addDoc(followRef,
        { userId: userId, followerId: user?.uid })
    }
    catch {

    }
    finally {
      setFollowed(true)
      setLoader(false)
    }

  }
  const removeFollow = async () => {
    setLoader(true)
    const followerData = await getDocs(followDoc)
    const deleteId = doc(db, 'follow', followerData.docs[0].id)
    await deleteDoc(deleteId)
    setFollowed(false)
    setLoader(false)
  }



  return (
    <div ref={menuRef} className={` animate-slide-up center-div fixed ${userPost ? 'top-[20%]' : 'top-[30%]'} z-12 `}>
      <div className="create-post w-[300px]  rounded-[5px] flex flex-col items-center  ">
        {userPost ? <div onClick={() => deletePost(popUpId)} className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem] text-red-500 ">{`Delete `}
        </div> : <div className="w-full text-center py-4 border-b border-[#d4d4d4c9] text-[0.85rem] text-red-500 ">{`Report `}
        </div>}

        {userPost &&
          <>
            <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem]">Edit</div>
            <div className="w-full text-center py-4 border-b border-[#d4d4d4c9] text-[0.85rem]">Hide like Count to others  </div>
            <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem]">Turn off Commenting </div>
          </>

        }
        {!userPost && (followed ? <div onClick={loader?undefined:removeFollow}
          className="w-full text-center py-4 border-b border-[#d4d4d4c9] relative 
          flex items-center justify-center  text-[0.85rem] text-red-500">{loader ? <div className='spinner border-2  border-[#5b5b5c] border-b-transparent  w-5 h-5'></div>
            : 'Unfollow'}</div>
          :
          <div onClick={loader?undefined:addFollow}
            className="w-full text-center relative py-4 border-b border-[#d4d4d4c9] flex 
            items-center justify-center  text-[0.85rem] text-red-500">{loader ? <div className='spinner border-2 border-[#5b5b5c]  border-b-transparent w-5 h-5'></div>
              : 'Follow'}</div>)}
        <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem]  ">Go to post </div>
        <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem] ">Copy link</div>
        <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem] ">About this account</div>
        <div className="w-full text-center py-4  text-[0.85rem] ">cancel</div>
      </div>
    </div>
  )
}