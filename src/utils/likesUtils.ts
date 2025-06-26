import { addDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useContext, useState } from "react";
import { db, likesCollection } from "../config/Firebase";
import { UserContext } from "../App";

export function likesUtils() {

    const [likesCount, setLikesCount] = useState<number>(0);
    const [liked, setLiked] = useState<boolean>(false);
    const newLikedState = !liked;
    const {user}=useContext(UserContext)

    // Debounced functions
    const debounce = (cb: Function, delay = 1000) => {
        let timeoutId: ReturnType<typeof setTimeout>;
        return (...args: any[]) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => cb(...args), delay);
        };
    };

    const updateLike = debounce(async (id:string) => {
        console.log(id)
        try {
            if (newLikedState) {
                await addDoc(likesCollection, { userId: user?.uid, postId: id });
                console.log('Like added');
            } else {
                const deleteQuery = query(likesCollection, where('postId', '==', id), where('userId', '==', user?.uid));
                const deleteData = await getDocs(deleteQuery);
                if (!deleteData.empty) {
                    const deleteId = doc(db, 'likes', deleteData.docs[0].id);
                    await deleteDoc(deleteId);
                    console.log('Like removed');
                }
            }
        } catch (error) {
            console.error('Failed to update like status:', error);
        }
    }, 10000); // Shorter debounce for faster UI response

    const handleLike = (Id:string) => {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikesCount(likesCount + (newLikedState ? 1 : -1));
        updateLike(Id); // Pass the state to debounced function
    };
    return {handleLike,likesCount,liked,newLikedState,setLikesCount,setLiked}
} 