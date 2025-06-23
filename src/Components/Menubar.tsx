
import avatar from '../assets/60111.jpg'
import { ProfileMenu } from './ProfileMenu'

import React, { useContext, useRef, useEffect } from "react";
import { Avatar } from './RandomAvatar';
import { ImageContext } from '../Context/ImageContext';
import { RxHamburgerMenu } from "react-icons/rx";
import { stateContext } from '../Context/StateContext';


interface MenubarProps {
  setIsPost: React.Dispatch<React.SetStateAction<boolean>>;
  isPost: boolean
}

export const Menubar: React.FC<MenubarProps> = ({ setIsPost }) => {

  const { setIsOpen,isOpen,setIsdragged,isdragged } = useContext(stateContext)
  const { preview } = useContext(ImageContext)
 


  // Step 2: Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen(!isOpen);
  const dropDownRef = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {

      if (dropDownRef.current['first'] && dropDownRef.current['second'] && !dropDownRef.current['first']?.contains(event.target as Node) && !dropDownRef.current['second']?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])


  return (
    <header className={` border-b border-b-[#b9b5b5ef] ${'fixed'} z-2 top-0 left-0 right-0 h-14 navbar`}>
        <nav className="w-full h-full flex ">
        <ul className="flex w-full justify-center ">
          <li onClick={()=> {setIsdragged(!isdragged)}} className='md:hidden block relative top-5 left-3'><RxHamburgerMenu size={20} /></li>
          {/* first-section*/}
          <li className="pr-6 flex justify-start">
            <a className='w-full' href=" ">

            </a>
          </li>
          {/* second-section*/}
          <li className=" flex flex-1 ">
            <div className='py-2  w-full flex '>
              <div className='flex w-full bg-[#E5EBEE] mx-auto md:w-[560px] items-center rounded-3xl pl-4 gap-2'>
                <span className='text-black'><svg aria-hidden="true" fill="currentColor" height="16" icon-name="search-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"> <path d="M19.5 18.616 14.985 14.1a8.528 8.528 0 1 0-.884.884l4.515 4.515.884-.884ZM1.301 8.553a7.253 7.253 0 1 1 7.252 7.253 7.261 7.261 0 0 1-7.252-7.253Z"></path> </svg></span>
                <span className='w-full'>
                  <input className="w-full outline-0 text-black " placeholder="Search here" type="text" />
                </span>
              </div>
            </div>
          </li>
          {/* last-section*/}
          <li className='pl-lg gap-2 flex items-center justify-end mr-2'>
            <div className='flex items-center'>
              <span className='px-4'>
                <button>
                  <svg fill="currentColor" height="20" icon-name="chat-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.61 19.872a10.013 10.013 0 0 0 6.51-4.035A9.999 9.999 0 0 0 12.275.264c-1.28-.3-2.606-.345-3.903-.132a10.05 10.05 0 0 0-8.25 8.311 9.877 9.877 0 0 0 1.202 6.491l-1.24 4.078a.727.727 0 0 0 .178.721.72.72 0 0 0 .72.19l4.17-1.193A9.87 9.87 0 0 0 9.998 20c.54 0 1.079-.043 1.612-.128ZM1.558 18.458l1.118-3.69-.145-.24A8.647 8.647 0 0 1 1.36 8.634a8.778 8.778 0 0 1 7.21-7.27 8.765 8.765 0 0 1 8.916 3.995 8.748 8.748 0 0 1-2.849 12.09 8.763 8.763 0 0 1-3.22 1.188 8.68 8.68 0 0 1-5.862-1.118l-.232-.138-3.764 1.076ZM6.006 9a1.001 1.001 0 0 0-.708 1.707A1 1 0 1 0 6.006 9Zm4.002 0a1.001 1.001 0 0 0-.195 1.981 1 1 0 1 0 .195-1.98Zm4.003 0a1.001 1.001 0 1 0 0 2.003 1.001 1.001 0 0 0 0-2.003Z"></path>
                  </svg>
                </button>
              </span>
              <span className='px-4'>
                <div onClick={() => { setIsPost(prev => !prev) }} className='flex items-center justify-center'>
                  <button className='mr-2 bg-gradient-to-r from-[#888BF4] to-[#5151C6] p-[6px] rounded-[50%]'>
                    <svg fill="#FFFF" height="20" icon-name="add-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 9.375h-8.375V1h-1.25v8.375H1v1.25h8.375V19h1.25v-8.375H19v-1.25Z"></path>
                    </svg>
                  </button>
                  <span className='font-medium'>Create</span>
                </div>
              </span>
              <span className='px-2'>
                <button>
                  <svg fill="currentColor" height="20" icon-name="notification-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 18h1a2 2 0 0 1-4 0h3Zm8-3.792v.673A1.12 1.12 0 0 1 17.883 16H2.117A1.12 1.12 0 0 1 1 14.881v-.673a3.947 3.947 0 0 1 1.738-3.277A2.706 2.706 0 0 0 3.926 8.7V7.087a6.07 6.07 0 0 1 12.138 0l.01 1.613a2.7 2.7 0 0 0 1.189 2.235A3.949 3.949 0 0 1 19 14.208Zm-1.25 0a2.7 2.7 0 0 0-1.188-2.242A3.956 3.956 0 0 1 14.824 8.7V7.088a4.819 4.819 0 1 0-9.638 0v1.615a3.956 3.956 0 0 1-1.738 3.266 2.7 2.7 0 0 0-1.198 2.239v.542h15.5v-.542Z">

                    </path>
                  </svg>
                </button>
              </span>

            </div>
            <div ref={el => (dropDownRef.current['first'] = el)} className='w-[2rem] h-[2rem] '>
              <span onClick={toggleDropdown} className='w-full h-full '>
                <Avatar preview={preview} />
              </span>
            </div>

          </li>

        </ul>
      </nav>
      {<ProfileMenu
        dropDownRef={dropDownRef}
        avatar={avatar}
        isOpen={isOpen} />}
    </header>
  )
}