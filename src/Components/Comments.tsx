import { MutableRefObject, useContext, useRef } from "react"
import { HomeContext } from "../pages/Home"
interface Prop {
    username: string
    , commentId: string
    , comment: string
    , img: string
    deleteCommentRef: MutableRefObject<HTMLDivElement | SVGSVGElement | null>
    deleteComment: Function,
    displayComment: Function
    id: string,
    userId: string
}

export const Comments = ({ username, commentId, comment, img, deleteComment, displayComment }: Prop) => {

    const { toDelete, displayOption} = useContext(HomeContext)
    const cancelRef=useRef<HTMLDivElement|null>(null)
    function runFunction() {
       if(cancelRef.current){
        cancelRef.current.style.display='none'  
       }
    }

    if (toDelete) console.log(toDelete)
    toDelete && deleteComment(commentId)
    return (
        <div>
            <div className="flex gap-2 items-center mb-2 justify-between content">
                <span className="flex gap-2">
                    <p className="w-5 h-5">
                        <img className="w-full h-full rounded-[50%]" src={img} alt="" />
                    </p>
                    <p className="text-[0.75rem]">{username}</p>
                    <p className="text-[0.75rem] text-gray-400" >{comment}</p>
                </span>


                <div >
                    <svg onClick={() => { displayComment(commentId) }} aria-label="More options" className=" opacity-0 content-more " fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <title>More options</title>
                        <circle cx="12" cy="12" r="1.5"></circle>
                        <circle cx="6" cy="12" r="1.5"></circle>
                        <circle cx="18" cy="12" r="1.5"></circle>
                    </svg>
                </div>
            </div>
            {displayOption &&
                <div className=" fixed left-[44%] top-[40%] z-15" >
                    <div ref={cancelRef}className="flex flex-col create-post rounded-[5px]">
                        <div className=" w-full  px-15 py-2 text-red-500 font-bold">Delete{commentId}</div>
                        <div  onClick={() => runFunction()} className="border-t px-15 py-2 font-bold">Cancel</div>
                    </div>
                </div>
            }


        </div>
    )
}