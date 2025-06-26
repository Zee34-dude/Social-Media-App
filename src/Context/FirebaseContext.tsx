import { getDocs, query, where } from "firebase/firestore"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { followCollection } from "../config/Firebase"
import { UserContext } from "../App"
import { followUtils } from "../utils/followUtils"

interface contextType {
    followsCount: any,
    followingCount: any,
    setFollowsCount: (followsCount: any) => void,
    setFollowingCount: (followingCount: any) => void
}
export const FirebaseContext = createContext<contextType>({
    followsCount: 0,
    followingCount: 0,
    setFollowsCount: () => { },
    setFollowingCount: () => { }
})


export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useContext(UserContext)
    const [followsCount, setFollowsCount] = useState<any>([])
    const [followingCount, setFollowingCount] = useState<any>([])
    const {addFollow,removeFollow}=followUtils()


    useEffect(() => {
        const fetchFollowers = async () => {
            const followDoc = query(followCollection, where('userId', '==', user?.uid))
            const followingDoc = query(followCollection, where('followerId', '==', user?.uid))
            const followsData = await getDocs(followDoc)
            const followingData = await getDocs(followingDoc)
            setFollowsCount(followsData.docs.map((doc) => ({ ...doc.data() })))
            setFollowingCount(followingData.docs.map((doc) => ({ ...doc.data() })))

        }
        fetchFollowers()
    }, [user?.uid,addFollow,removeFollow])



    const contextValue: contextType = useMemo(() => ({
        followingCount,
        followsCount,
        setFollowingCount,
        setFollowsCount
    }), [followingCount,
        followsCount,
        setFollowingCount,
        setFollowsCount])

    return (
        <FirebaseContext.Provider value={contextValue}>
            {children}
        </FirebaseContext.Provider>
    )
}