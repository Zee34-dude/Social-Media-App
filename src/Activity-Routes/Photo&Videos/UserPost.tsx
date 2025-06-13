import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../config/Firebase"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../App"
import { Posts } from '../../pages/Home'
import RadialLoader from "../../GIfComponents/RadialLoader"

export const UserPost = () => {
    const { user } = useContext(UserContext)
    const postsRef = collection(db, 'posts')
    const postQuery = query(postsRef, where('userId', '==', user?.uid))
    const [postsList, setPostsList] = useState<Posts[]>([])
    const [loader, setLoader] = useState<boolean>(false)
    const fetchPosts = async () => {
        setLoader(true)
        const postDoc = await getDocs(postQuery)
        setPostsList(postDoc.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Posts[])
        setLoader(false)
    }
    useEffect(() => {
        fetchPosts()
    }, [])
    if (loader) {
        return <RadialLoader />
    }
    const Post = postsList.map((post) => {
        return (
            <div className="relative aspect-square group cursor-pointer">
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
            <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
                {Post}
            </div>
        </div>
    )
}