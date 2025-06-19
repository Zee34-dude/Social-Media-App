import { createContext, useState, useRef } from "react";
interface stateContextType {
 postRef: { current: null | HTMLFormElement }
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  popUp: string | null,
  setPopup: (popUp: string | null) => void
  userPost: boolean,
  setUserPost: (userPost: boolean) => void
  menuRef: { current: null | HTMLDivElement }
  popUpId: string | null,
  setPopupId: (popUpId: string | null) => void
  isdragged: boolean
  setIsdragged: (isdragged: boolean) => void
  commentSectionRef: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>
}
export const stateContext = createContext<stateContextType>({
    postRef: { current: null },
    isOpen: false,
    setIsOpen: () => { },
    popUp: null,
    setPopup: () => { },
    userPost: false,
    setUserPost: () => { },
    menuRef: { current: null },
    popUpId: null,
    setPopupId: () => { },
    isdragged: false,
    setIsdragged: () => { },
    commentSectionRef: { current: {} },
})

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
    const postRef = useRef<HTMLFormElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const commentSectionRef = useRef<{ [key: string]: HTMLDivElement | null }>({})
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [popUp, setPopup] = useState<string | null>(null)
    const [userPost, setUserPost] = useState(false)
    const [isdragged, setIsdragged] = useState<boolean>(false)
    const [popUpId, setPopupId] = useState<string | null>(null)


    const stateContextvalue:stateContextType = {
        postRef,
        isOpen,
        setIsOpen,
        popUp, setPopup,
        userPost,
        setUserPost,
        menuRef,
        popUpId,
        setPopupId,
        isdragged,
        setIsdragged,
        commentSectionRef
    }
    return (
        <stateContext.Provider value={stateContextvalue} >
            {children}
        </stateContext.Provider>
    )
}