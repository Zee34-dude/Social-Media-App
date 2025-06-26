import { addDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useContext, useRef, useState } from "react";
import { db, likesCollection } from "../config/Firebase";
import { UserContext } from "../App";

// Debounce utility: only updates based on the last call
const debounce = (cb: Function, delay = 1000) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => cb(...args), delay);
    };
};
export function likesUtils() {
    const [likesCount, setLikesCount] = useState<number>(0);
    const [liked, setLiked] = useState<boolean>(false);
    const { user } = useContext(UserContext);

    // Track last intent to avoid double firing
    const latestIntent = useRef<{ postId: string; liked: boolean } | null>(null);

    const updateLike = debounce(async (postId: string, liked: boolean) => {
        if (!user) return;
        try {
            if (liked) {
                await addDoc(likesCollection, { userId: user.uid, postId });
                console.log('Like added');
            } else {
                const deleteQuery = query(likesCollection, where('postId', '==', postId), where('userId', '==', user.uid));
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
    }, 1000);

    const handleLike = (postId: string) => {
        const nextLiked = !liked;
        setLiked(nextLiked);
        setLikesCount(prev => prev + (nextLiked ? 1 : -1));

        // Store latest intent before debounce fires
        latestIntent.current = { postId, liked: nextLiked };

        updateLike(postId, nextLiked);
    };

    return {
        handleLike,
        likesCount,
        liked,
        setLikesCount,
        setLiked,
    };
}




