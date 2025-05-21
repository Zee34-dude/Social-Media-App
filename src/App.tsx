import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Home } from './pages/Home'
import { Menubar } from './Components/Menubar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import { onAuthStateChanged, User } from 'firebase/auth'
import Navbar from './Components/Navbar'
import { createContext, useState, useEffect, useRef, CSSProperties } from 'react'
import { auth } from './config/Firebase'
import { CreatePost } from './Components/CreatePost'
import { MdClose } from "react-icons/md";
import { RingLoader } from 'react-spinners'
import { ThemeProvider } from './Components/ThemeContext'
import { UserProfile } from './pages/UserProfile'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EditProfile } from './pages/Editprofile'
import { ImageProvider } from './Components/ImageProvider'

//state type specification
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  setAuthInitialized: (authInitialized: boolean) => void,
  postRef: { current: null | HTMLFormElement }
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  popUp: any,
  setPopup: (popUp: boolean) => void
  userPost: boolean,
  setUserPost: (userPost: boolean) => void
  menuRef: { current: null | HTMLDivElement }
  popUpId: string | null,
  setPopupId: (popUpId: string | null) => void
};
//context
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => { },
  setAuthInitialized: () => { },
  postRef: { current: null },
  isOpen: false,
  setIsOpen: () => { },
  popUp: null,
  setPopup: () => { },
  userPost: false,
  setUserPost: () => { },
  menuRef: { current: null },
  popUpId: null,
  setPopupId: () => { }
});

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authInitialized, setAuthInitialized] = useState(false)
  const [isPost, setIsPost] = useState<boolean>(false)
  const postRef = useRef<HTMLFormElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [popUp, setPopup] = useState<boolean>(false)
  const [userPost, setUserPost] = useState(false)
  const [popUpId, setPopupId] = useState<string | null>(null)
  const [scrollPosition, setScrollPostion] = useState<number>(JSON.parse(localStorage.getItem('scrollPostion') as string) || 0)
  const client = new QueryClient({
    defaultOptions:
    {
      queries: {
        refetchOnWindowFocus: false

      },
    }
  });
  useEffect(() => {
    document.addEventListener('scroll', () => {
      setScrollPostion(window.scrollY)


    });
    return () => {
      document.removeEventListener('scroll', () => {
        setScrollPostion(window.scrollY)

      })
    }
  }, [isPost, popUp])

//user details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        setUser(firebaseUser);

      } else {
        setUser(null);
      }
      setAuthInitialized(true)
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [auth]);

  useEffect(() => {
    if (isPost) {
      document.body.classList.add('enable-static');

      // document.body.style.top = `-${scrollPosition}px`

    }
    else {
      document.body.classList.remove('disable-scroll');
      document.body.classList.add('enable-static')
      // document.body.style.top = `-${scrollPosition}px`
      console.log(scrollPosition)

    }

    // Cleanup function
    return () => {
      document.body.classList.remove('disable-scroll');
    };
  }, [isPost, popUp]);

  const override: CSSProperties = {
    position: "absolute",
    top: '40%',
    left: '45%',

  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setPopup(false)

      }
    }

    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [])


  if (!authInitialized) {
    return <RingLoader cssOverride={override} />
  }

  return (
    <div className={`relative`}>
      <ImageProvider>
        <ThemeProvider>
          <UserContext.Provider value={{ user, setUser, setAuthInitialized, postRef, isOpen, setIsOpen, popUp, setPopup, userPost, setUserPost, menuRef, popUpId, setPopupId }}>
            <QueryClientProvider client={client}>
              <Router>
                {user && <Menubar
                  setIsPost={setIsPost}
                  isPost={isPost}

                />

                }
                {user && <Navbar />}
                {isPost && <CreatePost
                  override={override}
                  setIsPost={setIsPost}
                  isPost={isPost}
                />}

                <Routes>
                  {<Route path='/' element={user ? <Home /> : <Login />} />}
                  {<Route path='/register' element={<Register />} />}
                  <Route path='/user-profile' element={<UserProfile />} />
                  <Route path='/edit-profile' element={<EditProfile />} />
                </Routes>
              </Router>
            </QueryClientProvider>
          </ UserContext.Provider>
        </ThemeProvider>
      </ImageProvider>

      {(popUp || isPost) &&
        (<div className={`bg-[#0000009a] fixed top-0 w-full h-full z-3`}>
          <div onClick={() => { setIsPost(false), setPopup(false) }} className='fixed right-10 top-14'>
            <MdClose fill='white' className='si' size={30} />
          </div>
        </div>)
      }
    </div>
  )
}

export default App
