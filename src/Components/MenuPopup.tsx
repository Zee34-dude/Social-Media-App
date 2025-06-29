import { useContext } from "react";
import { UserContext } from "../App";
import { HomeContext } from "../pages/Home";
import { stateContext } from "../Context/StateContext";
import { followUtils } from '../utils/followUtils'

interface MenubarProps {
  id: string
  userId: string

}
export const Popup = ({ userId }: MenubarProps) => {
  const { userPost, menuRef, popUpId } = useContext(stateContext)
  const { user } = useContext(UserContext)
  const { deletePost } = useContext(HomeContext)
  const { addFollow, removeFollow, loader, followed } = followUtils()



  return (
    <div ref={menuRef} className={` animate-slide-up center-div fixed ${userPost ? 'top-[20%]' : 'top-[30%]'} z-12 `}>
      <div className="create-post w-[300px]  rounded-[5px] flex flex-col items-center  ">
        {userId === user?.uid ? <div onClick={() => deletePost(popUpId)} className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem] text-red-500 ">{`Delete `}
        </div> : <div className="w-full text-center py-4 border-b border-[#d4d4d4c9] text-[0.85rem] text-red-500 ">{`Report `}
        </div>}

        {userPost &&
          <>
            <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem]">Edit</div>
            <div className="w-full text-center py-4 border-b border-[#d4d4d4c9] text-[0.85rem]">Hide like Count to others  </div>
            <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem]">Turn off Commenting </div>
          </>

        }
        {!(userId === user?.uid) &&
          (followed ? <div onClick={loader ? undefined : () => removeFollow(userId)}
            className="w-full text-center py-4 border-b border-[#d4d4d4c9] relative 
          flex items-center justify-center  text-[0.85rem] text-red-500">{loader ? <div className='spinner border-2  border-[#5b5b5c] border-b-transparent  w-5 h-5'></div>
              : 'Unfollow'}</div>
            :
            <div onClick={loader ? undefined : () => addFollow(userId)}
              className="w-full text-center relative py-4 border-b border-[#d4d4d4c9] flex 
            items-center justify-center  text-[0.85rem] text-red-500">{loader ? <div className='spinner border-2 border-[#5b5b5c]  border-b-transparent w-5 h-5'></div>
                : 'Follow'}</div>)
        }
        <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem]  ">Go to post </div>
        <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem] ">Copy link</div>
        <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem] ">About this account</div>
        <div className="w-full text-center py-4  text-[0.85rem] ">cancel</div>
      </div>
    </div>
  )
}