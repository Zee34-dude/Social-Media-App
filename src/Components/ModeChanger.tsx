import { MdOutlineWbSunny } from "react-icons/md";

interface AppearanceRefType {
  first?: HTMLDivElement | null
}
interface ModeChangerType {
  toggleTheme: () => void,
  theme: string,
  appearanceRef: React.MutableRefObject<AppearanceRefType>
}

export const ModeChanger = ({ toggleTheme, theme, appearanceRef }: ModeChangerType) => {

  return (
    <div ref={el => (appearanceRef.current['first'] = el)} className="absolute  shadow-[0px_4px_10px_rgba(0,0,0,0.3)] rounded-3xl ">
      <div className=" create-post w-[275px] rounded-3xl">
        <div className="py-4 px-[15px] flex justify-between ">
          <span>
            Change appearance
          </span>
          <span>
            {theme === 'dark'?
              <svg aria-label="Theme icon" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18"><title>Theme icon</title><path d="M11.502,22.99805A11.4313,11.4313,0,0,1,.49512,14.83691a.99889.99889,0,0,1,.251-.998,1.01148,1.01148,0,0,1,.99707-.249,9.43041,9.43041,0,0,0,2.75879.40821A9.5082,9.5082,0,0,0,13.5957,1.74023a1.00039,1.00039,0,0,1,1.24707-1.248A11.501,11.501,0,0,1,11.502,22.99805ZM3.08984,15.91211A9.49991,9.49991,0,0,0,21.002,11.498,9.57875,9.57875,0,0,0,15.916,3.08594,11.5083,11.5083,0,0,1,3.08984,15.91211Z"></path></svg> :
              <MdOutlineWbSunny />
            }
          </span>
        </div>
        <div className="w-full border-b border-gray-400"></div>
        <div className="py-4 px-[15px] flex justify-between">
          <span>Dark mode</span>
          <span>
            <label className="relative flex cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              {/* Background */}
              <div className="w-10 h-5 bg-gray-300 rounded-full  transition relative">
                {/* Knob */}
                <div className={`absolute left-1 top-1 w-3.5 h-3.5 rounded-full transition-all ${theme === 'dark' ? 'translate-x-5 bg-black' : 'bg-white'} `}></div>
              </div>
            </label>
          </span>
        </div>
      </div>
    </div>


  )
}