import { useContext } from "react"
import { UserContext } from "../App"


export const UserPosts = () => {
  const {user}=useContext(UserContext)
  return (
    <div className="w-[88%] h-full">
    <div className="flex justify-center items-center h-full pt-10 text-[#8c8f92] text-2xl font-bold">
    {user?.displayName} has not made any post
    </div>
    </div>

  )
}