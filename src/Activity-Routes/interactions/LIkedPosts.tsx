import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "../../config/Firebase"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../App"
import RadialLoader from "../../GIfComponents/RadialLoader"
import { useNavigate } from "react-router-dom"

interface Likes { userId: string, postId: string, id: string }
export const LikedPost = () => {
    const { user } = useContext(UserContext)
    const likesRef = collection(db, 'likes')
    const likeQuery = query(likesRef, where('userId', '==', user?.uid))
    const [likedData, setLikedData] = useState<{ like: Likes; post: any | null }[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    useEffect(() => {
        const getLikedPost = async () => {
            setLoading(true)
            const likeSnapShot = await getDocs(likeQuery)
            const likedata = likeSnapShot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            })) as Likes[];
            const combinedData = await Promise.all(
                likedata.map(async (like) => {
                    const postDocRef = doc(db, "posts", like.postId);
                    const postSnapshot = await getDoc(postDocRef);
                    const postData = postSnapshot.data()
                    const id = postSnapshot.id
                    const post = postSnapshot.exists() ? { ...postData, id } : null;

                    return { like, post }
                }))
            setLikedData(combinedData)
            setLoading(false)
        }
        getLikedPost()
    }, [user?.uid])
    if (loading) {
        return <RadialLoader />
    }

    function NavigateTopage(PostId: string): void {
        navigate(`/p/${PostId}`)
    }

    return (
        <div className="flex-1 p-6 overflow-auto pb-20">
            {
                !(likedData.length == 0) ?
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
                        {likedData.map(({ like, post }) => (
                            post &&
                            <div
                                key={like.id}
                                className="relative aspect-square group cursor-pointer"
                                onClick={() => NavigateTopage(like.postId)}
                            >
                                {
                                    post.video ?
                                        <video muted controls={true} autoPlay className="w-full h-full object-cover rounded-sm" src={post.video}>

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
                        ))

                        }
                    </div>
                    : <div className=" text-3xl text-gray-400 w-full font-bold text-center">
                        You Haven't Liked any Post. Like posts to see them here
                    </div>
            }
        </div >




    )
}