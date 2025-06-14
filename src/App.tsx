import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Home } from './pages/Home'
import { Menubar } from './Components/Menubar'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
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
import { Activity } from './pages/ActivityPage'
import { UserPost } from './Activity-Routes/Photo&Videos/UserPost'
import { LikedPost } from './Activity-Routes/interactions/LIkedPosts'
import { CommentedPost } from './Activity-Routes/interactions/CommentedPost'
import { Interactions } from './Activity-Routes/Interactions'
import { PhotoVideos } from './Activity-Routes/Photo&Videos'
//state type specification
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  setAuthInitialized: (authInitialized: boolean) => void,
  postRef: { current: null | HTMLFormElement }
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  popUp: string | null,
  setPopup: (popUp: string | null) => void
  userPost: boolean,
  setUserPost: (userPost: boolean) => void
  menuRef: { current: null | HTMLDivElement }
  popUpId: string | null,
  setPopupId: (popUpId: string | null) => void
  isdragged: boolean
  setIsdragged: (isdragged: boolean) => void
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
  setPopupId: () => { },
  isdragged: false,
  setIsdragged: () => { }
});

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authInitialized, setAuthInitialized] = useState(false)
  const [isPost, setIsPost] = useState<boolean>(false)
  const postRef = useRef<HTMLFormElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [popUp, setPopup] = useState<string | null>(null)
  const [userPost, setUserPost] = useState(false)
  const [isdragged, setIsdragged] = useState<boolean>(false)
  const [popUpId, setPopupId] = useState<string | null>(null)
  const [scrollPosition, setScrollPostion] = useState<number>(JSON.parse(localStorage.getItem('scrollPostion') as string) || 0)
  const [activeTab, setActiveTab] = useState<string>(localStorage.getItem(`tabId${user?.uid}` as string) || 'likes')
  useEffect(() => {
    if (user) {
      const savedTab = localStorage.getItem(`tabId${user.uid}`) || 'likes';
      setActiveTab(savedTab);
    }
  }, [user]);

  const handleActiveTab = (tabId: string) => {
    setActiveTab(tabId)
    if (user) {
      localStorage.setItem(`tabId${user.uid}`, tabId);
    }
  }
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
        setPopupId(null)

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
          <UserContext.Provider value={{ user, setUser, setAuthInitialized, postRef, isOpen, setIsOpen, popUp, setPopup, userPost, setUserPost, menuRef, popUpId, setPopupId, isdragged, setIsdragged }}>
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
                  <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
                  <Route path="/login" element={<Login />} />
                  {<Route path='/register' element={<Register />} />}
                  <Route path='/user-profile' element={<UserProfile />} />
                  <Route path='/edit-profile' element={<EditProfile />} />
                  <Route path="/activity" element={<Activity />}>
                    <Route path='interactions' element={<Interactions
                      activeTab={activeTab}
                      handleActiveTab={handleActiveTab}
                    />}>
                      <Route path='CommentedPost' element={<CommentedPost />} />
                      <Route path='LikedPost' element={<LikedPost />} />
                    </Route>
                    <Route path='photovideos' element={<PhotoVideos
                      activeTab={activeTab}
                      handleActiveTab={handleActiveTab} />}>
                      <Route path='UserPost' element={<UserPost

                      />} />
                    </Route>
                  </Route>

                </Routes>
                <Routes>
                  
                  {/* Other routes */}
                </Routes>
              </Router>
            </QueryClientProvider>
          </ UserContext.Provider>
        </ThemeProvider>
      </ImageProvider>

      {(popUpId || isPost) &&
        (<div className={`bg-[#0000009a] fixed top-0 w-full h-full z-3`}>
          <div onClick={() => { setIsPost(false), setPopupId(null) }} className='fixed right-10 top-14'>
            <MdClose fill='white' className='si' size={30} />
          </div>
        </div>)
      }
    </div>
  )
}

export default App
