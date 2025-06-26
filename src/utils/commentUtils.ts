import { useContext, useState } from "react"
import { commentCollection, db, userCollection } from "../config/Firebase";
import { UserContext } from "../App";
import { addDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { Comment } from "../Components/Posts";



export function commentUtils() {
    const [comment, setComment] = useState<string | null>(null)
    const [commentLoading, setCommentLoading] = useState(false)

    const [volatileList, setVolatileList] = useState<Comment[]>([])

    const { user } = useContext(UserContext)
    const userDoc = query(userCollection, where('userId', '==', user?.uid));

    function handleComment(e: any) {
        setComment(e.currentTarget.value)
        console.log(e.currentTarget.value)

    }
    async function addComment(inputRef: any, id: string, cb: Function) {

        if (inputRef?.current) inputRef.current.value = '';
        setCommentLoading(true)
        const imageData = await getDocs(userDoc)
        const img = imageData.docs[0].data().RandomId
        try {

            setCommentLoading(true)
            if (comment !== null) {
                await addDoc(commentCollection, {
                    postId: id,
                    userId: user?.uid,
                    comment: comment,
                    username: user?.displayName,
                    img: img
                })
            }

        }
        catch (err) {
            console.log(err)
        }
        finally {
            setVolatileList((prev) => [...prev, { comment: comment, username: user?.displayName, img: img, }] as Comment[])
            cb((prev: Comment[]) => [...prev, { comment: comment, username: user?.displayName, img: img, }] as Comment[])
            setCommentLoading(false)
            setComment(null)

        }
    }

    const deleteComment = async (commentId: string, cb: Function) => {
        cb((comments: Comment[]) => comments ? comments.filter(cment => cment.commentId !== commentId) : [])
        setVolatileList((comments) => comments ? comments.filter(cment => cment.commentId !== commentId) : [])
        const cmentToDeleteData = doc(db, 'comments', commentId)
        try {
            await deleteDoc(cmentToDeleteData)
        }
        catch (err) {

        }
        finally {

        }
        console.log('money')
    }

    return { handleComment, comment, setComment, commentLoading, addComment, volatileList, deleteComment }
}


