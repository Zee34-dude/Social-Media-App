
import { UserPost } from "../Activity-Routes/Photo&Videos/UserPost"
import { CommentedPost } from "../Activity-Routes/interactions/CommentedPost"


export const UserPosts = ({ currentTab,userId }: { currentTab: string,userId:string }) => {

  return (
    <div className="mt-10">{currentTab === 'posts' ? <UserPost userId={userId} /> : currentTab === 'comments' ? <CommentedPost /> : ''
    }
    </div>
    
  )

}
