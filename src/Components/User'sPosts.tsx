import { useContext } from "react"
import { UserContext } from "../App"
import { UserPost } from "../Activity-Routes/Photo&Videos/UserPost"
import { CommentedPost } from "../Activity-Routes/interactions/CommentedPost"


export const UserPosts = ({ currentTab }: { currentTab: string }) => {
  const { user } = useContext(UserContext)
  return (
    <div className="mt-10">{currentTab === 'posts' ? <UserPost /> : currentTab === 'comments' ? <CommentedPost /> : ''
    }
    </div>
    
  )

}
