import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Home } from './pages/Home'
import { Menubar } from './Components/Menubar'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import { onAuthStateChanged, User } from 'firebase/auth'
import Navbar from './Components/Navbar'
import { createContext, useState, useEffect, CSSProperties } from 'react'
import { auth } from './config/Firebase'
import { CreatePost } from './Components/CreatePost'
import { MdClose } from "react-icons/md";

import { UserProfile } from './pages/UserProfile'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EditProfile } from './pages/Editprofile'
import { ImageProvider } from './Context/ImageContext'
import { Activity } from './pages/ActivityPage'
import { UserPost } from './Activity-Routes/Photo&Videos/UserPost'
import { LikedPost } from './Activity-Routes/interactions/LIkedPosts'
import { CommentedPost } from './Activity-Routes/interactions/CommentedPost'
import { Interactions } from './Activity-Routes/Interactions'
import { PhotoVideos } from './Activity-Routes/Photo&Videos'
import ViewPostPage from './pages/ViewPostPage'
import { StateProvider } from './Context/StateContext'
import { FirebaseProvider } from './Context/FirebaseContext'
import webLogo from './assets/ChatGPT Image Jun 24, 2025, 12_55_07 PM.png'
import Synergy from './Components/Synergy-text'
//state type specification
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  setAuthInitialized: (authInitialized: boolean) => void,

};
//context
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => { },
  setAuthInitialized: () => { },
});

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authInitialized, setAuthInitialized] = useState(false)
  const [isPost, setIsPost] = useState<boolean>(false)


  const [activeTab, setActiveTab] = useState<string>('LikedPost')
  // useEffect(() => {
  //   if (user) {
  //     const savedTab = localStorage.getItem(`tabId${user.uid}`) || 'LikedPost';
  //     setActiveTab(savedTab);
  //   }
  //   console.log(activeTab)
  // }, [user]);

  const handleActiveTab = (tabId: string) => {
    setActiveTab(tabId)
  }
  const client = new QueryClient({
    defaultOptions:
    {
      queries: {
        refetchOnWindowFocus: false

      },
    }
  });

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



  const override: CSSProperties = {
    position: "absolute",
    top: '40%',
    left: '45%',

  }


  if (true) {
    return (
      <div className=''>
        <div className='w-50 h-50 animate-pulse relative top-39 center-div'><img className='w-full h-full' src={webLogo} alt="" /></div>
        <Synergy />
      </div>
    )
  }
  return (
    <div className={`relative`}>
      <ImageProvider>

        <UserContext.Provider value={{ user, setUser, setAuthInitialized }}>

          <QueryClientProvider client={client}>
            <FirebaseProvider>
              <StateProvider>

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
                    <Route path='/p/:id' element={<ViewPostPage />} />
                    <Route path="/activity" element={<Activity
                    />}>
                      <Route path='interactions' element={<Interactions
                        activeTab={activeTab}
                        handleActiveTab={handleActiveTab}
                        setActiveTab={setActiveTab}
                      />}>
                        <Route path='CommentedPost' element={<CommentedPost />} />
                        <Route path='LikedPost' element={<LikedPost />} />
                      </Route>
                      <Route path='photovideos' element={<PhotoVideos
                        activeTab={activeTab}
                        handleActiveTab={handleActiveTab}
                        setActiveTab={setActiveTab} />}>
                        <Route path='UserPost' element={<UserPost

                        />} />
                      </Route>
                    </Route>

                  </Routes>
                  <Routes>

                    {/* Other routes */}
                  </Routes>
                </Router>
              </StateProvider>
            </FirebaseProvider>
          </QueryClientProvider>
        </ UserContext.Provider>

      </ImageProvider>

      {(isPost) &&
        (<div className={`bg-[#0000009a] fixed top-0 w-full h-full z-3`}>
          <div onClick={() => { setIsPost(false) }} className='fixed right-10 top-14'>
            <MdClose fill='white' className='si' size={30} />
          </div>
        </div>)
      }
    </div>
  )
}

export default App
