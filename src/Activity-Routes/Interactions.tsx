import { Link, Outlet } from "react-router-dom"
import { interactionData } from "./interactions/interactionData"
import { useContext, useEffect } from "react"
import { themeContext } from "../Context/ThemeContext"

export interface Prop {
    activeTab: string
    handleActiveTab: Function,
    setActiveTab: Function
}

export const Interactions = ({ activeTab, setActiveTab, handleActiveTab }: Prop) => {
    const { theme } = useContext(themeContext)
    const pathname = window.location.pathname;
    const pathSegment = pathname.split('/')
    const lastPathName = pathSegment[pathSegment.length - 1]
    console.log(lastPathName)
    useEffect(() => {
        if (lastPathName) {

            setActiveTab(lastPathName)
            console.log('he')
        }

    }, [lastPathName])

    return (
        <div className="flex-1 flex flex-col h-[100vh]">
            {/* Tabs */}
            <div className={`border-b ${theme === 'dark' ? 'border-gray-800' : 'border-b-[#b9b5b5ef] '} pt-2`}>
                <div className="flex justify-center mt-4">
                    {
                        interactionData.map((data, id) => (
                            <Link key={id} to={data.to} >
                                <button onClick={() => handleActiveTab(data.tab)} className={` max-[400px]:px-2 px-4 py-4 flex gap-2 items-center text-sm font-medium 
                        ${activeTab == data.tab && ` border-b-2`} `}>
                                    {data.svg}
                                    {data.interaction}
                                </button>
                            </Link>
                        ))

                    }
                </div>
            </div>

            {/* Content Header */}
            <div className={`flex items-center justify-between max-[400px]:px-2 p-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-b-[#b9b5b5ef] '}`}>
                <div className="flex items-center gap-4">
                    <span className="font-bold max-[400px]:text-sm">Newest to oldest</span>
                    <button className="px-3 py-1 text-sm bg-transparent border border-gray-600 hover:bg-gray-800 rounded">
                        Sort & filter
                    </button>
                </div>
                <button className="text-blue-400 hover:text-blue-300">Select</button>
            </div>

            {/* Photo Grid */}

            <Outlet />

        </div>
    )
}