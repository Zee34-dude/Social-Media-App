
import { UserPost } from "../Activity-Routes/Photo&Videos/UserPost"
import { CommentedPost } from "../Activity-Routes/interactions/CommentedPost"


export const UserPosts = ({ currentTab }: { currentTab: string }) => {

  return (
    <div className="mt-10">{currentTab === 'posts' ? <UserPost /> : currentTab === 'comments' ? <CommentedPost /> : ''
    }
    </div>
    
  )

}
