import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/Firebase";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import RadialLoader from "../../GIfComponents/RadialLoader";
interface Comments {
    id: string;
    comment: string;
    img: string;
    postId: string;
    userId: string;
}

export const CommentedPost = () => {
    const { user } = useContext(UserContext);
    const [commentedData, setCommentedData] = useState<
        { comment: Comments; post: any | null }[]
    >([]);
    const [loader, setLoader] = useState<boolean>(false)

    useEffect(() => {
        setLoader(true)
        const fetchCommentedPosts = async () => {
            setLoader(true)
            try {
                const commentRef = collection(db, "comments");
                const commentQ = query(commentRef, where("userId", "==", user?.uid));
                const commentSnapshot = await getDocs(commentQ);
                const commentData = commentSnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                })) as Comments[];

                const combinedData = await Promise.all(
                    commentData.map(async (comment) => {
                        const postDocRef = doc(db, "posts", comment.postId);
                        const postSnapshot = await getDoc(postDocRef);
                        const post = postSnapshot.exists() ? postSnapshot.data() : null;

                        return {
                            comment,
                            post,
                        };
                    })
                );

                setCommentedData(combinedData);
            }
            catch (err) {
                console.log(err)
            }
            finally {
                setLoader(false)
            }

        };

        fetchCommentedPosts();

    }, [user?.uid]);
    console.log(commentedData)
    if (loader) {
        return <RadialLoader />
    }

    return (
        <div className="lg:px-10 pt-6 flex flex-col gap-6 overflow-auto pb-20">
            {commentedData.map(({ comment, post }) => (
                <div
                    key={comment.id}
                    className="border border-gray-700 rounded-lg p-4 relative"
                >
                    {/* Post Preview */}
                    {post ? (
                        <div className="flex items-top gap-3 mb-3">
                            <img src={post.profilePic} className="w-10 h-10 rounded-full object-cover aspect-[1/1]" alt="" />
                            <div className="flex gap-1 w-full">
                                <span className="text-sm  line-clamp-3">
                                    <span className="text-sm font-bold mr-1">{post.username}</span>
                                    {post.text}
                                </span>

                            </div>


                            <div className="ml-auto">
                                {post.image ? <img
                                    src={post.image}
                                    alt="Post"
                                    className="w-12 h-12 object-cover rounded-md"
                                /> : <video className="w-12 h-12 object-cover rounded-md" src={post.video}></video>}
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-500 text-sm mb-2">Original post not found</p>
                    )}

                    {/* User Comment */}
                    <div className="flex items-start gap-4 mt-2 px-10">
                        <img
                            src={comment.img}
                            alt="User"
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-sm">{comment.comment}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
