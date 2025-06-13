import { Link, Outlet } from "react-router-dom"
import { Prop } from "./Interactions"
import { BsPostcardHeart } from "react-icons/bs"
export const PhotoVideos = ({ activeTab, handleActiveTab }: Prop) => {
    return (
        <div className="flex-1 flex flex-col h-[100vh]">
            {/* Tabs */}
            <div className="border-b border-gray-800 pt-2">
                <div className="flex justify-center">
                    <Link to='/activity/Photovideos/UserPost'>
                        <button onClick={() => handleActiveTab('post')} className={`px-6 py-4 flex gap-2 items-center text-sm font-medium 
             ${activeTab == 'post' && `border-white border-b-2`} `}>
                          <BsPostcardHeart className='w-[1.2rem] h-[1.2rem]' />
                            POST
                        </button>
                    </Link>

          

                    <button className="px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-gray-300">
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                        </svg>
                        REVIEWS
                    </button>
                </div>
            </div>

            {/* Content Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <span className="text-white">Newest to oldest</span>
                    <button className="px-3 py-1 text-sm bg-transparent border border-gray-600 text-white hover:bg-gray-800 rounded">
                        Sort & filter
                    </button>
                </div>
                <button className="text-blue-400 hover:text-blue-300">Select</button>
            </div>

            {/* Photo Grid */}

            <Outlet />

        </div>
    )
}