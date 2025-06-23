import { LiaUserEditSolid } from "react-icons/lia"
import { signOut } from "firebase/auth"
import { RiUserCommunityLine } from "react-icons/ri"
import { UserContext } from '../App'
import { useContext } from "react";
import { auth } from '../config/Firebase';
import { useNavigate, Link } from "react-router-dom";
import { Avatar } from "./RandomAvatar";
import { ImageContext } from "../Context/ImageContext";

export const ProfileMenu = ({ isOpen, dropDownRef }: any) => {

  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  const { preview, setForm } = useContext(ImageContext)
  const handleSignOut = async () => {
    try {

      await signOut(auth)
      setForm({
        displayName: null,
        bio: (prev) => prev
      })
      navigate('/')

    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div ref={el => (dropDownRef.current['second'] = el)} className={`fixed  h-[500px] min-w-[256px] top-[60px] right-1 rounded-[6px] shadow-[0px_4px_10px_rgba(0,0,0,0.3)] z-10 create-post ${isOpen ? 'block opacity-100' : 'hidden opacity-0'} transition-opacity duration-500  ease-in-out`}>
      <ul className='flex flex-col w-full items-start gap-6 py-3'>

        <li className='w-full flex hover:bg-[#b9b9b933] px-3 '>
          <Link className="flex gap-2 items-center" to={'user-profile'}>
            <span className='w-[2rem] h-[2rem]'>
              <Avatar preview={preview} />
            </span>

            <span className='text-sm'>
              View Profile
              <p
                className='text-[12px] text-[#747474]'>{user?.displayName}</p>
            </span>
          </Link>
        </li>
        <li className='flex items-center gap-2 w-full px-3  '>
          <Link className="flex items-center gap-2" to={'/edit-profile'}>
            <span className=''>
              <LiaUserEditSolid size={25} />
            </span>
            <span className='text-sm'>
              Edit Profile
            </span>

          </Link>
        </li>
        <li className='flex gap-2 px-3 '>
          <span>
            <svg fill="currentColor" height="20" icon-name="contest-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.757 10.211A4.615 4.615 0 0 0 20 5.625 1.627 1.627 0 0 0 18.375 4H16V2.135A1.126 1.126 0 0 0 14.886 1H5.114A1.126 1.126 0 0 0 4 2.135V4H1.625A1.627 1.627 0 0 0 0 5.625a4.615 4.615 0 0 0 4.243 4.586 6.219 6.219 0 0 0 5.132 4.753v2.786H6V19h8v-1.25h-3.375v-2.786a6.22 6.22 0 0 0 5.132-4.753Zm2.618-4.961a.375.375 0 0 1 .375.375 3.374 3.374 0 0 1-2.777 3.314c.016-.194.027-.389.027-.587V5.25h2.375ZM1.25 5.625a.375.375 0 0 1 .375-.375H4v3.1c0 .2.011.393.027.587A3.374 3.374 0 0 1 1.25 5.625Zm4 2.727V2.25h9.5v6.1c0 2.976-2.131 5.4-4.75 5.4s-4.75-2.422-4.75-5.398Z"></path>
            </svg>
          </span>
          <span className='text-sm'>Achievements</span>
        </li>
        <li className='flex items-center gap-2 px-3  '>
          <span>
            <RiUserCommunityLine size={20} />
          </span>
          <span className='text-sm'>
            Communities
          </span>
        </li>
        <li className='flex gap-2 items-center px-3  '>
          <span >
            <svg fill="currentColor" height="20" icon-name="logout-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.991 10.625H1v-1.25h10.991l-1.933-1.933.884-.884 3 3a.624.624 0 0 1 0 .884l-3 3-.884-.884 1.933-1.933ZM15.375 1h-9.75A2.629 2.629 0 0 0 3 3.625v.792h1.25v-.792A1.377 1.377 0 0 1 5.625 2.25h9.75a1.377 1.377 0 0 1 1.375 1.375v12.75a1.377 1.377 0 0 1-1.375 1.375h-9.75a1.377 1.377 0 0 1-1.375-1.375v-.792H3v.792A2.63 2.63 0 0 0 5.625 19h9.75A2.63 2.63 0 0 0 18 16.375V3.625A2.63 2.63 0 0 0 15.375 1Z"></path>
            </svg>
          </span>
          <span onClick={handleSignOut} className='text-sm'>
            Log Out
          </span>

        </li>
        <li></li>
      </ul>
    </div>
  )
}