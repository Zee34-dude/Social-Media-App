import { createContext, useState } from "react";
interface Form {
    displayName: string | null
    bio:string|((prev:string|null)=>string|null)|null
}

interface ContextType {
    preview: string | null,
    setPreview: (preview: string | null) => void,
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void,
    form:Form|null,
    setForm:(form:Form)=>void
}

export const ImageContext = createContext<ContextType>({
    preview: null,
    setPreview: () => {},
    isLoading: false,
    setIsLoading: () => {},
    form:null,
    setForm:()=>{}
})
export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
    const [preview, setPreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [form, setForm] = useState<Form| null>(null)
    return (
        <ImageContext.Provider value={{ preview, setPreview, isLoading, setIsLoading,form,setForm }}>
            {children}
        </ImageContext.Provider>
    )
}