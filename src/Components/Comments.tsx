import { MutableRefObject, useRef, useState } from "react"

import { commentUtils } from "../utils/commentUtils"
import { MdClose } from "react-icons/md"
interface Prop {
    username: string
    commentId: string
    comment: string
    img: string
    commentsRef: MutableRefObject<{ [key: string]: HTMLDivElement | null }>
    id: string,
    userId: string,
    userComment: boolean,
    cb: Function
}

export const Comments = ({ username, commentId, comment, img, userComment, cb }: Prop) => {

    const [showOptions, setShowOptions] = useState(false);
    const { deleteComment } = commentUtils()

    const cancelRef = useRef<HTMLDivElement | null>(null)



    return (
        // div displaying the name, image and comment of the users that commented 
        <div>
            <div className="flex gap-2 items-center mb-2 justify-between content">
                <span className="flex gap-2">
                    <p className="w-5 h-5">
                        <img className="w-full h-full rounded-[50%]" src={img} alt="" />
                    </p>
                    <p className="text-[0.75rem] font-bold">{username}</p>
                    <p className="text-[0.75rem] " >{comment}</p>
                </span>


                <div>
                    <svg onClick={() => { setShowOptions(true) }} aria-label="More options" className=" min-[768px]:opacity-0 content-more " fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <title>More options</title>
                        <circle cx="12" cy="12" r="1.5"></circle>
                        <circle cx="6" cy="12" r="1.5"></circle>
                        <circle cx="18" cy="12" r="1.5"></circle>
                    </svg>
                </div>
            </div>
            {showOptions &&
                <div ref={cancelRef} className=" fixed center-div top-[40%] z-15 animate-pop" >
                    <div className="flex flex-col create-post rounded-[5px]">
                        {userComment ?
                            <div onClick={() =>

                                setTimeout(() => {
                                    deleteComment(commentId, cb);
                                }, 0)
                            } className=" w-full  px-15 py-2 text-red-500 font-bold">Delete</div> :
                            <div className=" w-full  px-15 py-2 text-red-500 font-bold">Report</div>

                        }
                        <div onClick={() => {
                            // Delay hiding the delete popup so  that cancelRef check works
                            setTimeout(() => {
                                setShowOptions(false);
                            }, 0);
                        }} className="border-t px-15 py-2 font-bold">Cancel</div>
                    </div>

                </div>
            }

            {(showOptions) &&
                (<div className={`bg-[#00000094] fixed left-0 top-0 w-full h-full z-3`}>
                    <div onClick={() => { setShowOptions(false) }} className='fixed right-10 top-14'>
                        <MdClose fill='white' className='si' size={30} />
                    </div>
                </div>)
            }

        </div>
    )
}