

import { CiShare1 } from "react-icons/ci";
import { BookMark } from '../SvgComponents/BookMark';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Heart } from "lucide-react";



export const SKeletonPost = () => {
  return (
    <div className="flex mb-4 max-md:justify-center ">
      {<div className=" flex flex-col border-b border-b-[#b9b5b58c]">
        <div className="flex max-[600px]:px-2">
          <span className=' flex gap-2'>
            <span className="w-[2rem] h-[2rem]">

              <Skeleton circle width={32} height={32} />

            </span>
            <span className="text-[14px] w-[3rem] h-[1rem]">
              <Skeleton  className="w-full h-full "/>
            </span>
          </span>
          <span className="ml-auto">
            <svg aria-label="More options" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>More options</title><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
          </span>
        </div>
        <div className="  w-[500px] max-[600px]:w-auto h-[500px] mt-4 relative  ">
          {<Skeleton width='100%' height='100%' />
          }
        </div>
        {/*interaction section */}
        <div className='content flex flex-col max-[600px]:px-4 '>
          <div className='flex mt-4'>
            <span className='flex items-center gap-5 pl-2'>
              <div>
                <Heart className='w-6 h-6' />
              </div>
              <div>
                <svg aria-hidden="true" className="icon-comment" fill="currentColor" height="20" icon-name="comment-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10 19H1.871a.886.886 0 0 1-.798-.52.886.886 0 0 1 .158-.941L3.1 15.771A9 9 0 1 1 10 19Zm-6.549-1.5H10a7.5 7.5 0 1 0-5.323-2.219l.54.545L3.451 17.5Z"></path> </svg>
              </div>
              <div>
                <CiShare1 className='w-4 h-4' />
              </div>
            </span>
            <span className='ml-auto'>
              <BookMark />
            </span>
          </div>
          <div className="write-up mt-2">
            <p className='text-[14px]'></p>
          </div>
          <div className="comments">

          </div>
          <div className="w-full mt-4">
            <textarea placeholder="Add comment..." className="w-full text-xs resize-none outline-0 " name="" id=""></textarea>
          </div>
        </div>

      </div>}

    </div>
  )
}