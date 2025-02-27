
import { createContext, useContext, useEffect, useState } from "react"
import { Post } from "../Components/Posts"
import { collection, getDocs, deleteDoc, doc, } from "firebase/firestore"
import { db } from "../config/Firebase"
import { SKeletonPost } from "../Components/SkeletonPost"
import { UserContext } from "../App"

interface Posts {
  id: string,
  image: string,
  username: string,
  text: string
  userId: string
  isUserPost: Function,
  profilePic: string | undefined
}
interface HomeContextType {
  deletePost: Function,

}
interface User {
  RandomId: string | null,
  userId: string
}

export const HomeContext = createContext<HomeContextType>({
  deletePost: () => { }
})
export const Home = () => {
  const [postsList, setPostsList] = useState<Posts[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [userList, setUserList] = useState<User[] | null>(null)
  const [Prop, setProp] = useState<Posts[] | undefined>(undefined)
  const postRef = collection(db, 'posts');
  const userRef = collection(db, 'user')


  const { setPopup, user, setUserPost, setPopupId } = useContext(UserContext)

  const getPosts = async () => {
    try {

      const data = await getDocs(postRef)
      const userData = await getDocs(userRef)
      setUserList(userData.docs.map((doc) => ({ ...doc.data() })) as User[])


      setLoading(true)

      setPostsList(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Posts[]
      );
    }
    catch (err) {

      console.log(err)
    }
    finally {

      setLoading(false)
      if (!navigator.onLine) {
        setLoading(true)
      }
    }
  }

  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'posts', id))
      setPostsList((prevPosts) => prevPosts ? prevPosts.filter((post) => post.id !== id) : null);

    }
    catch (err) {
      console.log(err)
    }

    console.log('r')
  }

  useEffect(() => {
    getPosts()


  }, [])


  function isUserPost(id: string) {

    postsList?.map((post) => {

      if (id === post.id) {
        setPopupId(id)
        setPopup(true)

        post.username === user?.displayName ? setUserPost(true) : setUserPost(false)
      }

    })

  }


  useEffect(() => {

    const Prop = postsList?.map((post) => {
      const profilePic = CheckUserId(post.userId)
      return { ...post, profilePic: profilePic?.filter(post => post !== null) }
    });
    function CheckUserId(PostId: string) {
      console.log(PostId)
      return userList?.map((doc) => doc.userId === PostId ? doc.RandomId : null)
    }
    console.log(Prop)
    setProp(Prop as Posts[])

  }, [postsList?.length])

  return (
    <>
      <HomeContext.Provider value={{ deletePost }}>

        <div className=" grid grid-cols-1 max-[600px]:p-4 max-[600px]:mt-20  md:ml-[25vw]  
        pt-[75px]  ">

          {
            loading && Array.from({ length: 5 }).fill('').map((o, index) => {
              console.log(o)
              return <SKeletonPost
             
                key={index}
              />

            }) as []
          }

          {
            Prop?.map((post, index) =>
              <Post
                username={post.username}
                profilePic={post.profilePic ?? ''}
                img={post.image}
                text={post.text}
                loading={loading}
                id={post.id}
                key={index}
                isUserPost={isUserPost}

              />
            )
          }
        </div>
      </HomeContext.Provider>

    </>
  )

}

{/* <Post username={'skinnysgram'}
  profilePic={avatar}
  img={'src/assets/skinny-image.jpeg'}
  text={'Happy and really gratefutl to be alive today'} />
<Post
  username={'AkpiNwaMama'}
  profilePic={'src/assets/speedy.jpg'}
  img={'src/assets/speedy.jpg'}
  text={'gbas gbos'} /> */}