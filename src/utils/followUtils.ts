import { useContext, useState } from "react"
import { db, followCollection } from "../config/Firebase"
import { addDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { UserContext } from "../App"

export function followUtils() {
    const [followed, setFollowed] = useState<boolean>(false)
    const { user } = useContext(UserContext)
    const [loader, setLoader] = useState<boolean>(false)

    const addFollow = async (userId:string) => {
        setLoader(true)
        try {
            await addDoc(followCollection,
                { userId: userId, followerId: user?.uid })
        }
        catch {

        }
        finally {
            setFollowed(true)
            setLoader(false)
        }

    }
    const removeFollow = async (userId: string) => {
        const followDoc = query(followCollection, where('userId', '==', userId))
        setLoader(true)
        const followerData = await getDocs(followDoc)
        const deleteId = doc(db, 'follow', followerData.docs[0].id)
        await deleteDoc(deleteId)
        setFollowed(false)
        setLoader(false)
    }
   
    return { addFollow, removeFollow, loader, followed,setFollowed }
}
