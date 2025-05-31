import React, { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../App"
import { db } from '../config/Firebase'
import { addDoc, collection } from "firebase/firestore";
import { ClipLoader } from 'react-spinners';



interface MenubarProps {
  setIsPost: React.Dispatch<React.SetStateAction<boolean>>;
  override: object,
  isPost: boolean

}

export const CreatePost: React.FC<MenubarProps> = ({ setIsPost, override }) => {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | undefined>(undefined)
  const [uploading, setUploading] = useState<boolean>(false)
  const [doneUpload, setDoneUpload] = useState<boolean>(false)
  const [textValue, setTextvalue] = useState<string | null>(null)
  const InputRef = useRef<HTMLInputElement>(null)
  const Cloud_name = 'zion123'
  const preset = 'zion-uploads'
  const { user, postRef } = useContext(UserContext)
  const postsRef = collection(db, 'posts')
 

  const handleDragOver = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0]
    console.log(file)
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
    console.log(URL.createObjectURL(file))
  }


  const handleUpload = async () => {
    if (!image) return;
    setUploading(true)
    const formData = new FormData();
    formData.append('file', image)
    formData.append('upload_preset', preset)
    const response = await fetch(`https://api.cloudinary.com/v1_1/${Cloud_name}/image/upload`,
      {
        method: "POST",
        body: formData

      }
    )

    const data = await response.json()
    try {

      await addDoc(postsRef, {
        image: data.secure_url,
        username: user?.displayName,
        userId: user?.uid,
        text: textValue,
      })

      console.log('o')
    }
    catch (error) {
      console.error('upload failed :', error)
    }
    finally {
      setUploading(false)
      setDoneUpload(true)
      // setPostsList((prev) =>[...prev,{profilePic:CheckUserId(user?.uid||''),}] as Posts[] )
    }

  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (postRef.current && !postRef.current.contains(event.target as Node)) {
        setIsPost(false)

      }

    }
    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setImage(e.target.files[0])
      setPreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  function handleButtonClick() {
    InputRef.current?.click()
  }

  return (

    <form onSubmit={(e) => {
      e.preventDefault()
      console.log(e)
    }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      
      ref={postRef} className={`fixed z-5 center-div top-30`}>
      <div className="  animate-slide-up create-post max-[500px]:w-[300px] max-[500px]:h-[320px] w-[348px] h-[348px] shadow-[0px_4px_10px_rgba(0,0,0,0.3)] rounded-[4px] p-4">
        {uploading ? <ClipLoader
          cssOverride={override}
          size={40} /> :
          doneUpload && !uploading ? <div>
            Upload Succesful
          </div>
            :
            <div className="h-full">
              <div className="flex items-center justify-center w-full relative ">

                {!preview && <h2 className="text-center text-xl font-bold">Create a Post
                </h2>}

              </div>
              <div className="h-[70%] flex flex-col items-center justify-center gap-10">
                <div
                  className=" h-full w-full flex items-center justify-center">
                  {preview ? <img className="object-cover h-full w-full" src={preview} alt="" /> : <svg aria-label="Icon to represent media such as images or videos" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="77" role="img" viewBox="0 0 97.6 77.3" width="96">
                    <title>Icon to represent media such as images or videos</title>
                    <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor">
                    </path>
                    <path d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path>
                    <path d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor">

                    </path>

                  </svg>}

                </div>
                <input
                  ref={InputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {!preview && <button onClick={handleButtonClick} className="mt-4 text-white bg-gradient-to-r  from-[#888BF4] to-[#5151C6] p-2 rounded-[5px]">
                  Upload from Device
                </button>
                }
              </div>

              {preview &&
                <div className="text pt-4">
                  <textarea onChange={(e) => {
                    setTextvalue(e.currentTarget.value)
                  }}
                    placeholder="say something..." className="w-full 
                  resize-none outline-0" >
                  </textarea>
                </div>
              }

              {preview &&
                <div className="">
                  <span onClick={() => { setPreview(undefined) }} className="text-[#5151C6]"> go back</span>
                  <span onClick={handleUpload} className="
            text-[#5151C6] absolute right-4  ">
                    Share
                  </span>

                </div>

              }
            </div>}
      </div>
    </form>
  )
}