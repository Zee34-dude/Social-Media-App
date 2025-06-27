import { createContext, useEffect, useState } from "react"
interface Context{
  theme:string,
  toggleTheme:()=>void,
  showMode:Boolean,
  setShowMode:(showMode:Boolean)=>void
}


export const themeContext = createContext<Context>({
  theme: 'light',
  toggleTheme: () => { },
  showMode:false,
  setShowMode:()=>{}
})
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme')||'dark')
  const [showMode, setShowMode] = useState<Boolean>(false)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  },
    [theme])
  const toggleTheme = () => {
    setTheme(prevtheme => prevtheme === 'light' ? 'dark' : 'light')
    
  }
  return (
    <themeContext.Provider value={{theme, toggleTheme,showMode,setShowMode} }>
      { children}
    </themeContext.Provider>
  )
}