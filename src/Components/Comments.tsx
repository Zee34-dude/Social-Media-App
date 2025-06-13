import { MutableRefObject, useContext, useEffect, useRef, useState } from "react"
import { HomeContext } from "../pages/Home"
interface Prop {
    username: string
    commentId: string
    comment: string
    img: string
    commentSectionRef: MutableRefObject<{ [key: string]: HTMLDivElement | null }>
    deleteComment: Function,
    id: string,
    userId: string,
    isUserComment: Function
}

export const Comments = ({ username, commentId, comment, img, commentSectionRef, deleteComment, isUserComment }: Prop) => {

    const [showOptions, setShowOptions] = useState(false);
    const { setCommentPop, commentPop, userComment } = useContext(HomeContext)
    const cancelRef = useRef<HTMLDivElement | null>(null)
    //Remove the comment section, if click Event occurs outside the comment section 
    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (commentSectionRef.current['first'] && commentSectionRef.current['second']
                && !commentSectionRef.current['first']?.contains(event.target as Node) &&
                !commentSectionRef.current['second']?.contains(event.target as Node) && !cancelRef.current?.contains(event.target as Node)) {
                setCommentPop(null)

            }
        };

        document.addEventListener('click', handleClick);

        //Remove the Event Listener if no click
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [commentPop, showOptions]);



    return (
        // div displaying the name, image and comment of the users that commented 
        <div>
            <div className="flex gap-2 items-center mb-2 justify-between content">
                <span className="flex gap-2">
                    <p className="w-5 h-5">
                        <img className="w-full h-full rounded-[50%]" src={img} alt="" />
                    </p>
                    <p className="text-[0.75rem]">{username}</p>
                    <p className="text-[0.75rem] text-gray-400" >{comment}</p>
                </span>


                <div>
                    <svg onClick={() => { setShowOptions(true), isUserComment(commentId) }} aria-label="More options" className=" min-[768px]:opacity-0 content-more " fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <title>More options</title>
                        <circle cx="12" cy="12" r="1.5"></circle>
                        <circle cx="6" cy="12" r="1.5"></circle>
                        <circle cx="18" cy="12" r="1.5"></circle>
                    </svg>
                </div>
            </div>
            {showOptions &&
                <div ref={cancelRef} className=" fixed left-[44%] top-[40%] z-15" >
                    <div className="flex flex-col create-post rounded-[5px]">
                        {userComment ?
                            <div onClick={() =>

                                setTimeout(() => {
                                    deleteComment(commentId);
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


        </div>
    )
}