import { BsPostcardHeart } from "react-icons/bs"
import { Link, Outlet } from "react-router-dom"
export interface Prop {
    activeTab: string
    handleActiveTab: Function
}
export const Interactions = ({ activeTab, handleActiveTab }: Prop) => {
    return (
        <div className="flex-1 flex flex-col h-[100vh]">
            {/* Tabs */}
            <div className="border-b border-gray-800 pt-2">
                <div className="flex justify-center">
                    <Link to='/activity/interactions/LikedPost'>
                        <button onClick={() => handleActiveTab('likes')} className={`px-6 py-4 flex gap-2 items-center text-sm font-medium 
             ${activeTab == 'likes' && `border-white border-b-2`} `}>
                            <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            LIKES
                        </button>
                    </Link>

                    <Link to='/activity/interactions/CommentedPost'>
                        <button onClick={() => handleActiveTab('comments')} className={`px-6 py-4 flex gap-2 text-sm font-medium 
             ${activeTab == 'comments' && `border-white border-b-2`} `}>
                            <svg className="w-4 h-4 inline " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            COMMENTS
                        </button></Link>

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