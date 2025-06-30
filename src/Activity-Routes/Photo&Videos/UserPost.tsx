import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../config/Firebase"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../App"
import { Posts } from '../../pages/Home'
import RadialLoader from "../../GIfComponents/RadialLoader"
import { useNavigate } from "react-router-dom"

export const UserPost = ({ userId }: { userId: string }) => {
    const { user } = useContext(UserContext)
    const postsRef = collection(db, 'posts')
    const postQuery = query(postsRef, where('userId', '==', userId || user?.uid))
    const [postsList, setPostsList] = useState<Posts[]>([])
    const [loader, setLoader] = useState<boolean>(false)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchPosts = async () => {
            setLoader(true)
            const postDoc = await getDocs(postQuery)
            console.log(postDoc)
            setPostsList(postDoc.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Posts[])
            setLoader(false)
        }
        fetchPosts()
    }, [userId])
    function NavigateTopage(PostId: string): void {
        navigate(`/p/${PostId}`)
    }

    if (loader) {
        return <RadialLoader />
    }
    console.log(postsList)
    const Post = postsList.map((post, i) => {
        return (
            <div key={i} onClick={() => NavigateTopage(post.id)} className="relative aspect-square group cursor-pointer">
                {
                    post.video ?
                        <video muted autoPlay className="w-full h-full object-cover rounded-sm" src={post.video}>

                        </video> : <img
                            src={post.image}
                            alt="Post"
                            className="w-full h-full object-cover rounded-sm"
                        />

                }
                <div className="absolute top-2 right-2">
                    <div className=" bg-opacity-60 rounded-full p-1">
                        <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                            <div className="bg-white rounded-sm"></div>
                            <div className="bg-white rounded-sm"></div>
                            <div className="bg-white rounded-sm"></div>
                            <div className="bg-white rounded-sm"></div>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-sm"></div>
            </div>
        )
    })
    return (
        <div className="flex-1 p-6 overflow-auto">
            {
                !(Post.length == 0) ?
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
                        {Post}
                    </div> :
                    <div className="text-center text-gray-500 text-3xl font-bold">
                        You haven't made any Post.
                    </div>
            }
        </div>
    )
}