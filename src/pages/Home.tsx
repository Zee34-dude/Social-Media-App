
import { createContext, useContext, useEffect, useState } from "react"
import { Post } from "../Components/Posts"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
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
  profilePic: string | undefined,
  likes: number
}
interface HomeContextType {
  deletePost: Function,
  commentPop: CommentPop | null,
  setCommentPop: Function,
  userComment: boolean
  setUserComment:(userComment: boolean) => void ;
  toDelete: boolean
  setToDelete: (toDelete: boolean) => void
  postsList: Posts[] | null
  setPostsList: Function


}
interface User {
  RandomId: string | null,
  userId: string
}
interface CommentPop {
  userId: string,
  id: string


}

export const HomeContext = createContext<HomeContextType>({
  deletePost: () => { },
  commentPop: null,
  setCommentPop: () => { },
  userComment: false,
  setUserComment: () => { },
  toDelete: false,
  setToDelete: () => { },
  postsList: null,
  setPostsList: () => { },
})
export const Home = () => {
  const { setPopup, user, setUserPost, setPopupId } = useContext(UserContext)
  const [postsList, setPostsList] = useState<Posts[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [userList, setUserList] = useState<User[] | null>(null)
  const [Prop, setProp] = useState<Posts[]>([])
  const [commentPop, setCommentPop] = useState<CommentPop | null>(null)
  const [userComment, setUserComment] = useState<boolean>(false)
  const [toDelete, setToDelete] = useState<boolean>(false)
  const postRef = collection(db, 'posts');
  const userRef = collection(db, 'user')


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


  }
  // const updateDisplayName = async () => {
  //   const response = await getDocs(postRefToUpdate)
  //   console.log(response)

  // for(let i=0;i++;i<response.docs.length){
  //   const DocToupdate = doc(db, 'posts', response.docs[i].id)
  //   try {
  //     await updateDoc(DocToupdate, {
  //       username: user?.displayName
  //     })
  //   }
  //   catch (err) {
  //     console.log(err)
  //   }
  // }

  // }

  useEffect(() => {
    getPosts()
  }, [user?.displayName])


  // console.log(user?.uid)
  function isUserPost(id: string, userId: string) {
    postsList?.map((post) => {

      if (id === post.id && userId == undefined) {
        setPopupId(id)
        setPopup(true)
        post.username === user?.displayName ? setUserPost(true) : setUserPost(false)
      }
      if (id === post.id && userId == post.userId) {
        setCommentPop({
          userId: userId,
          id: id
        })
      }

    })

  }
  function CheckUserId(PostId: string) {
    return userList?.map((doc) => doc.userId === PostId ? doc.RandomId : null)
  }

  useEffect(() => {
    const Prop = postsList?.map((post) => {
      const profilePic = CheckUserId(post.userId)
      return { ...post, profilePic: profilePic?.filter(post => post !== null) }
    });

    setProp(Prop as Posts[])

  }, [postsList?.length])


  return (
    <>
      <HomeContext.Provider value={{ deletePost, commentPop, setCommentPop,  userComment, setUserComment, toDelete, setToDelete, postsList, setPostsList }}>
        <div className=" relative grid grid-cols-1 max-[600px]:p-4 max-[600px]:mt-20  md:ml-[25vw]  
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
                userId={post.userId}
                isUserPost={isUserPost}


              />
            )
          }
        </div>
      </HomeContext.Provider>
      {/* {(displayOption) ?
        (<div className={`bg-[#0000009a] fixed top-0 w-full h-full z-14`}>
         
        </div>):''
      } */}
    </>
  )

}

