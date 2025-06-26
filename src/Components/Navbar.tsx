import { Link } from "react-router-dom"
import { GoReport } from "../SvgComponents/GoReport";
import { Appearance } from "../SvgComponents/Appearance";
import { BookMark } from "../SvgComponents/BookMark";
import { Activity } from "../SvgComponents/Activity";
import { CiSettings } from "../SvgComponents/CiSetting";
import { themeContext } from "../Context/ThemeContext";
import { useContext, useEffect, useRef, useState } from "react";
import { ModeChanger } from "./ModeChanger";
import { stateContext } from "../Context/StateContext";

export default function Navbar() {

  const { toggleTheme, theme, setShowMode, showMode } = useContext(themeContext)
  const { isdragged, setIsdragged } = useContext(stateContext)
  const appearanceRef = useRef<{
    [key: string]: HTMLDivElement | null
  }>({})

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appearanceRef.current['first'] && appearanceRef.current['second'] && !appearanceRef.current['first']?.contains(event.target as Node) && !appearanceRef.current['second']?.contains(event.target as Node)) {
        setShowMode(false)

      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => { document.removeEventListener('mousedown', handleClickOutside) }
  }, [])
  //logic for slide effect on sidebar for smaller screens

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchEndX.current - touchStartX.current;

    if (!isdragged && touchStartX.current < 30 && distance > 80) {
      setIsdragged(true); // open on right swipe from edge
    } else if (isdragged && distance < -80) {
      setIsdragged(false); // close on left swipe
    }
  };
  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth))
  }, [window.innerWidth])

  return (
    <div className="">
      {
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={` z-3 block border-r  ${theme==='dark'?'border-gray-800':'border-r-[#b9b5b5ef] '}  left-0 top-[56px] bottom-0  py-4 px-6  fixed  xl:w-[260px] ${theme==='dark'?'bg-[#121212]':'bg-[#f8f7f7f8]'} ${windowWidth < 768 && (isdragged ? "translate-x-0" : "-translate-x-full")}
         `}>
          <div

            className={`container mx-auto flex  flex-col justify-between `}>
            <nav>
              <ul className="flex gap-6 flex-col">
                <li className=" flex gap-2">
                  {<Link className="flex gap-2" to='/'>
                    <svg fill="currentColor" height="20" icon-name="home-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m17.71 8.549 1.244.832v8.523a1.05 1.05 0 0 1-1.052 1.046H12.73a.707.707 0 0 1-.708-.707v-4.507c0-.76-1.142-1.474-2.026-1.474-.884 0-2.026.714-2.026 1.474v4.507a.71.71 0 0 1-.703.707H2.098a1.046 1.046 0 0 1-1.052-1.043V9.381l1.244-.835v9.158h4.44v-3.968c0-1.533 1.758-2.72 3.27-2.72s3.27 1.187 3.27 2.72v3.968h4.44V8.549Zm2.04-1.784L10.646.655a1.12 1.12 0 0 0-1.28-.008L.25 6.765l.696 1.036L10 1.721l9.054 6.08.696-1.036Z"></path> </svg>
                    <p className="hidden lg:block">Home</p>
                  </Link>}
                </li>
                {<li className="flex gap-2">
                  <Link className="flex gap-2" to='/popular'>
                    <svg fill="currentColor" height="20" icon-name="popular-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10 0a10 10 0 1 0 10 10A10.01 10.01 0 0 0 10 0Zm0 18.75a8.7 8.7 0 0 1-5.721-2.145l8.471-8.471v4.148H14V6.638A.647.647 0 0 0 13.362 6H7.718v1.25h4.148L3.4 15.721A8.739 8.739 0 1 1 10 18.75Z"></path> </svg>
                    <p className="hidden lg:block"> Popular</p>
                  </Link>
                </li>}
                <li className="flex gap-2" >
                  <Link className="flex gap-2" to='/explore'>
                    <svg fill="currentColor" height="20" icon-name="communities-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m18.937 19.672-2.27-2.23A9.917 9.917 0 0 1 10 20a10.032 10.032 0 0 1-7.419-3.297 1.976 1.976 0 0 1-.475-1.418 3.455 3.455 0 0 1 2.173-3.207c.426-.17.881-.255 1.34-.248h2.49a3.569 3.569 0 0 1 3.616 3.504v1.57h-1.25v-1.565a2.313 2.313 0 0 0-2.366-2.256h-2.49a2.243 2.243 0 0 0-2.098 1.388c-.113.275-.17.57-.167.868a.784.784 0 0 0 .143.52A8.778 8.778 0 0 0 10 18.752a8.694 8.694 0 0 0 6.234-2.607l.084-.085v-.72a2.235 2.235 0 0 0-2.218-2.256h-2.361v-1.248H14.1a3.492 3.492 0 0 1 3.464 3.504v1.237l2.245 2.206-.872.89ZM4.63 8.53a2.443 2.443 0 0 1 1.511-2.259A2.45 2.45 0 0 1 9.48 8.053a2.443 2.443 0 0 1-2.401 2.923A2.451 2.451 0 0 1 4.63 8.53Zm1.25 0a1.198 1.198 0 0 0 1.434 1.176 1.2 1.2 0 0 0 .875-1.634 1.2 1.2 0 0 0-2.309.458Zm4.794 0a2.443 2.443 0 0 1 1.511-2.259 2.45 2.45 0 0 1 3.338 1.782 2.443 2.443 0 0 1-2.401 2.923 2.451 2.451 0 0 1-2.448-2.446Zm1.25 0a1.197 1.197 0 0 0 1.434 1.176 1.2 1.2 0 0 0 .875-1.634 1.2 1.2 0 0 0-2.309.458ZM1.25 10.01A8.733 8.733 0 0 1 4.361 3.3a8.753 8.753 0 0 1 10.654-.48 8.745 8.745 0 0 1 3.702 6.406 8.732 8.732 0 0 1-.498 3.756l.714 1.498a9.98 9.98 0 0 0-2.62-12.237A10.005 10.005 0 0 0 .992 5.652a9.98 9.98 0 0 0-.103 8.454l.729-1.598a8.723 8.723 0 0 1-.368-2.497Z"></path> </svg>
                    <p className="hidden lg:block"> Explore</p>
                  </Link>

                </li>
                <li className="flex gap-2">
                  <Link className="flex gap-2" to='/all'>
                    <svg fill="currentColor" height="20" icon-name="all-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"> <path d="M10 0a10 10 0 1 0 10 10A10.01 10.01 0 0 0 10 0Zm5 17.171V6h-1.25v11.894a8.66 8.66 0 0 1-2.75.794V10H9.75v8.737A8.684 8.684 0 0 1 6.47 18H7v-4H5.75v3.642a8.753 8.753 0 1 1 9.25-.471Z"></path> </svg>
                    <p className="hidden lg:block"> All</p>
                  </Link>
                </li>
                <li className="flex gap-2 ">
                  <Link className="flex gap-2" to='/reels'>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg"><path d="M232,220H167.18A100,100,0,1,0,128,228H232a4,4,0,0,0,0-8ZM36,128a92,92,0,1,1,92,92A92.1,92.1,0,0,1,36,128Zm92-28a20,20,0,1,0-20-20A20,20,0,0,0,128,100Zm0-32a12,12,0,1,1-12,12A12,12,0,0,1,128,68Zm20,108a20,20,0,1,0-20,20A20,20,0,0,0,148,176Zm-32,0a12,12,0,1,1,12,12A12,12,0,0,1,116,176Zm60-28a20,20,0,1,0-20-20A20,20,0,0,0,176,148Zm0-32a12,12,0,1,1-12,12A12,12,0,0,1,176,116Zm-96-8a20,20,0,1,0,20,20A20,20,0,0,0,80,108Zm0,32a12,12,0,1,1,12-12A12,12,0,0,1,80,140Z"></path></svg>
                    <p className="hidden lg:block">  Reels</p>
                  </Link>
                </li>
              </ul>

            </nav>

            <div className="w-full border-t-[#b9b5b5ef] border-t-1 mt-5 flex flex-col items-start  gap-6 pt-4">
              <div className="flex gap-2 items-center ">

                <Link className="flex gap-2" to='activity/interactions/LikedPost'>
                  <Activity />
                  <p className="hidden lg:block"> Activity</p>
                </Link>
              </div>
              <div className="flex gap-2 items-center">

                <Link className="flex gap-2" to='/saved'>
                  <BookMark />
                  <p className="hidden lg:block"> Saved </p>
                </Link>
              </div>
              <div ref={el => appearanceRef.current['second'] = el} className="flex gap-2 items-center relative">

                <span className="flex gap-2" onClick={() => { setShowMode(!showMode) }}>
                  <Appearance />
                  <p className="hidden lg:block">
                    Change Appearance
                  </p>

                </span>
                {showMode && <ModeChanger
                  toggleTheme={toggleTheme}
                  theme={theme}
                  appearanceRef={appearanceRef}
                />}

              </div>
              <div className="flex gap-2 items-center">

                <Link className="flex gap-2" to='/report'>
                  <GoReport />
                  <p className="hidden lg:block">Report</p>
                </Link>
              </div>
              <div className="flex gap-2 items-center">

                <Link className="flex gap-2" to='/report'>
                  <CiSettings />
                  <p className="hidden lg:block">Settings </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
    </div>







  )

}