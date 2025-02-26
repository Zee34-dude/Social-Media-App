
import { getDocs } from "firebase/firestore"
import { db } from "../config/Firebase"
import { collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useContext } from 'react'
import { UserContext } from '../App'
export interface User {
  RandomId: string
  userId: string,
  id: string,
  Bio:string
}
export const Avatar = ({preview}:{preview:string|null}) => {
  const [avatar, SetAvatar] = useState<User[] | null>(null)
  const [randomId, setRandomId] = useState<string| undefined>(undefined)
  const [loading, setLoading] = useState<Boolean>(false)
  const { user } = useContext(UserContext)

  const getUser = async () => {
    setLoading(true)
    try {
      const data = await getDocs(collection(db, 'user'))
      SetAvatar(
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as User[]
      )
      setLoading(true)
    }

    catch (err) {

    }
    finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getUser()

  }, [])
  useEffect(() => {

    try{

      avatar?.map((doc) => {
        if (user?.uid === doc.userId) {
          setRandomId(doc.RandomId)
          
        }
  
      })
    }
    catch{

    }
    finally{
  
    }
  },[avatar])
  if(loading){
    return 
  }

  return <img className='w-full h-full rounded-[50%] object-cover' src={preview&&preview||randomId} alt="" />
}
