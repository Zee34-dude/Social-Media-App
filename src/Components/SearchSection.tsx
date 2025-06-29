import debounce from 'lodash/debounce'
import { useEffect, useRef, useState } from 'react'
import { userCollection } from '../config/Firebase'
import { query, getDocs, limit } from 'firebase/firestore'
interface Result {
    id: string
    userName: string,
    RandomId: string
    userId: string
    userNameLower: string

}
export const SearchSection = ({ desktopSearchBar }: { desktopSearchBar: boolean }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement | null>(null)


    const searchUsers = async (searchText: string) => {
        if (!searchText) return [];
        setLoading(true)
        const q = query(
            userCollection, limit(100));

        const snapshot = await getDocs(q);
        const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Result[];
        const filtered = allUsers.filter(user =>
            user.userNameLower.includes(searchText.toLowerCase().replace(/\s+/g, ''))
        );
        setLoading(false)
        return filtered;
    }
    useEffect(() => {

        const debouneSearch = debounce(async () => {

            const res = await searchUsers(searchQuery)
            setResults(res)
        }, 300)
        debouneSearch()

        console.log(results, searchQuery)
        return () => debouneSearch.cancel()
    }, [searchQuery])
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setResults([])
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])




    return (
        <div className={` w-full flex relative  ${desktopSearchBar ? 'py-2' : 'top-2'}`}>
            <div className={` w-full bg-[#121212] mx-auto min-w-[320px] max-w-[560px]  relative `}>
                <div className={`items-center flex  gap-2 w-full pl-4  border border-gray-500  ${results.length > 0 || loading ? 'rounded-t-2xl' : 'rounded-2xl'} `}>
                    <span className=''><svg aria-hidden="true" fill="currentColor" height="16" icon-name="search-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"> <path d="M19.5 18.616 14.985 14.1a8.528 8.528 0 1 0-.884.884l4.515 4.515.884-.884ZM1.301 8.553a7.253 7.253 0 1 1 7.252 7.253 7.261 7.261 0 0 1-7.252-7.253Z"></path> </svg></span>
                    <span className='w-full'>
                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full outline-0 py-2" placeholder="Search here" type="text" />
                    </span>
                </div>
                {!loading &&results.map((obj, i) =>

                    <div ref={searchRef} key={i} className={`w-full bg-[#121212] border ${i==results.length-1?'':'border-b-transparent'}  border-gray-500  border-t-transparent `}>
                        <div className='p-4 w-full h-full'>
                            <div className='flex  items-center gap-2 cursor-pointer'>
                                <div className='w-8 h-8 '>
                                    <img className='w-full h-full rounded-full object-cover' src={obj.RandomId} alt="" />
                                </div>
                                <div className='text-[14px] font-bold'>{obj.userName}</div>
                            </div>
                        </div>
                    </div>
                )}

                {loading &&<div className='bg-[#121212] p-4 border border-gray-500  border-t-transparent'>
                    {
                        Array.from({ length: 5 }).fill('').map(() => {
                            return (
                                <div className='w-full mt-2 flex items-center gap-2'>
                                    <div className='w-8 h-8 rounded-full bg-[#161515]'></div>
                                    <div className='w-[70%] h-6 rounded-full bg-[#161515]'>

                                    </div>
                                </div>
                            )
                        })
                    }
                </div>}
            </div>
        </div>
    )
}