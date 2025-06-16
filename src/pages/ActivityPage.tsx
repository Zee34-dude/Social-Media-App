"use client"

import { useContext, useState } from "react"
import { Link, Outlet } from "react-router-dom"
import { themeContext } from "../Components/ThemeContext"


export const Activity = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const {theme}=useContext(themeContext)

  return (
    <div className="flex flex-col lg:flex-row  min-h-screen md:ml-[10%] lg:ml-[22%]">
      {/* Mobile Header */}
      <div className="lg:hidden absolute top-15 right-3 z-50 ">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

      </div>

      {/* Activity Menu */}
      <div
        className={`
        ${isMobileMenuOpen ? "block" : "hidden"} 
        lg:block 
        w-full lg:w-60 xl:w-60 
        border-r ${theme==='dark'?'border-gray-800':'border-gray-300'} 
        p-4 lg:p-6 
         lg:bg-transparent
       relative
        top-14 
        left-0 
        right-0 
        bottom-0 
        lg:bottom-auto
        max-lg:z-40 
        overflow-y-auto
        lg:ml-0 lg:pl-0
        pt-4 lg:pt-16
      `}
      >
        <h2 className="text-xl font-semibold mb-6 hidden lg:block">Your activity</h2>

        <div className="space-y-2 lg:space-y-4">
          <div className="flex items-start gap-3 lg:gap-4 p-3 rounded-lg hover:bg-gray-900 cursor-pointer transition-colors">
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6 mt-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>

            <div className="flex-1">
              <Link to="interactions/LikedPost" onClick={() => setIsMobileMenuOpen(false)} className="block">
                <h3 className="font-medium  text-sm lg:text-base">Interactions</h3>
                <p className="text-xs lg:text-sm  mt-1">
                  Review and delete likes, comments, and your other interactions.
                </p>
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3 lg:gap-4 p-3 rounded-lg hover:bg-gray-900 cursor-pointer transition-colors">
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6 mt-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21,15 16,10 5,21"></polyline>
            </svg>
            <div className="flex-1">
              <Link to="photovideos/UserPost" onClick={() => setIsMobileMenuOpen(false)} className="block">
                <h3 className="font-medium  text-sm lg:text-base">Photos and videos</h3>
                <p className="text-xs lg:text-sm mt-1">
                  View, archive or delete photos and videos you've shared.
                </p>
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3 lg:gap-4 p-3 rounded-lg hover:bg-gray-900 cursor-pointer transition-colors">
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6 mt-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <div className="flex-1">
              <h3 className="font-medium  text-sm lg:text-base">Account history</h3>
              <p className="text-xs lg:text-sm  mt-1">
                Review changes you've made to your account since you created it.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 lg:gap-4 p-3 rounded-lg hover:bg-gray-900 cursor-pointer transition-colors">
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6 mt-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <div className="flex-1">
              <h3 className="font-medium text-sm lg:text-base">Download your information</h3>
              <p className="text-xs lg:text-sm  mt-1">
                Download a copy of the information you've shared with Instagram.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 pt-16 lg:pt-16 px-4 lg:px-6 xl:px-8">
        <Outlet />
      </div>
    </div>
  )
}
