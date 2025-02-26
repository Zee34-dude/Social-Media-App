import {useContext} from "react";
import {UserContext} from "../App";
import {HomeContext} from "../pages/Home";


interface MenubarProps {

  id: string
}
export const Popup: React.FC<MenubarProps> = () => {
  const { userPost, menuRef, popUp ,popUpId} = useContext(UserContext)
  const { deletePost } = useContext(HomeContext)


  return (
    <div ref={menuRef} className={` fixed left-[38%] ${userPost ? 'top-[20%]' : 'top-[30%]'} z-12 `}>
      <div className="create-post w-[300px]  rounded-[5px] flex flex-col items-center  ">
        {userPost?<div  onClick={() => deletePost(popUpId) } className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem] text-red-500 ">{ `Delete ` }
        </div>:<div className="w-full text-center py-4 border-b border-[#d4d4d4c9] text-[0.85rem] text-red-500 ">{`Report `}
        </div>}

        {userPost &&
          <>
            <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem]">Edit</div>
            <div className="w-full text-center py-4 border-b border-[#d4d4d4c9] text-[0.85rem]">Hide like Count to others  </div>
            <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem]">Turn off Commenting </div>
          </>

        }
        <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem]  ">Go to post </div>
        <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem] ">Copy link</div>
        <div className="w-full text-center py-4 border-b border-[#d4d4d4c9]  text-[0.85rem] ">About this account</div>
        <div className="w-full text-center py-4  text-[0.85rem] ">cancel</div>
      </div>
    </div>
  )
}