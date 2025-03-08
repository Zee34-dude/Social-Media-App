import { CSSProperties, useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../App"
import { Avatar } from "../Components/RandomAvatar"
import Skeleton from "react-loading-skeleton"
import { doc, updateDoc, query, where, getDocs, collection } from "firebase/firestore"
import { db } from "../config/Firebase"
import { ImageContext } from "../Components/ImageProvider"
import { BeatLoader, FadeLoader } from "react-spinners"
import { auth } from '../config/Firebase'
import { updateProfile } from "firebase/auth"


export const EditProfile = () => {
  const { user } = useContext(UserContext)
  const { preview, setPreview, isLoading, setIsLoading, form, setForm } = useContext(ImageContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<File | null>(null)
  const [isTextLoading, setIsTextLoading] = useState<boolean>(false)
  const cloud_name = 'zion123'
  const preset = 'zion-uploads'
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files) {
      setImage(e.target.files[0])
    }
  }
  const docRef = collection(db, 'user');
  const q = query(docRef, where('userId', '==', user?.uid));

  const updateImage = async () => {
    if (!image) return

    const formData = new FormData()
    formData.append('file', image)
    formData.append('upload_preset', preset)
    setIsLoading(true)
    try {
      setIsLoading(true)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )
      const data = await response.json()
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].id;
        const UpdateUser = doc(db, 'user', userDoc);

        await updateDoc(UpdateUser, {
          RandomId: data.secure_url,

        });

      } else {
        return
      }
    } catch (error) {
      console.error('Error updating RandomId:', error);
    }
    finally {
      setPreview(URL.createObjectURL(image))
      setIsLoading(false)
    }
  };
  useEffect(() => {
    updateImage()
  }, [image])

  function handleButtonClick(e: any) {
    e.preventDefault()
    inputRef.current?.click()
  }

  const override: CSSProperties = {
    position: "absolute",
    top: '40%',
    left: '40%',


  }
  async function handleSubmit(e: any) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const displayName = e.target.input.value !== '' ? formData.get('displayName') as string : form?.displayName as string
    setForm({
      displayName,
      bio: formData.get('bio') as string,
    })
    e.target.input.value = ''
  
  }
  const uploadUserData = async () => {
    setIsTextLoading(true)
    try {

      if (!auth.currentUser) return
      await updateProfile(auth.currentUser, {
        displayName: form?.displayName

      })
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].id;
        const UpdateUser = doc(db, 'user', userDoc);
        await updateDoc(UpdateUser, {
          Bio: form?.bio

        });

      } else {
        return
      }
      setIsTextLoading(true)
    }
    catch (err) {
    
    }
    finally {
      setIsTextLoading(false)
    }
  }
  useEffect(() => {
    uploadUserData()
  }, [form])
  return (
    <div className="md:ml-[25vw] pt-20  pb-10">
      <div className="flex flex-col  ">
        <div className="font-bold text-xl pb-5">Edit profile</div>
        <div className="flex items-center">
          <div className="flex items-center">
            <span className="w-22.5  h-22.5 relative ">
              {Avatar ? <Avatar preview={preview} /> : <Skeleton circle width={90} height={90} />}
              {isLoading && <div className="absolute top-0 bottom-0 w-full bg-[#000000b6] rounded-[50%]"><FadeLoader cssOverride={override} /></div>}
            </span>
            {isTextLoading ?
              <span className="p-2">
                {form?.displayName || user?.displayName}
              </span>
              :
              <span className="p-2">
                {form?.displayName || user?.displayName}
              </span>
            }

          </div>
          <div className="absolute right-4  ">
            <form action="">
              <input
                ref={inputRef}
                type="file"
                onChange={uploadImage}
                className="hidden"
              />
              <button onClick={handleButtonClick} className="bg-[#5151C6] p-2 rounded-[7px]">
                Change Photo
              </button>
            </form>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="text-xl font-bold pb-3 ">Edit Profile</div>
        <div className="flex flex-col w-[50%] items-start gap-1">
          <label htmlFor="input">
            <span className="text-[#999996dd] text-[0.85rem] "> Display Name</span>
          </label>
          <div className="bg-[#303031] py-2 w-[40%] rounded-[6px]">
            <span className=" ">
              <input name='displayName' id='input' className="px-2 text-[1rem] text-[#e0e0dedd] outline-0" placeholder="Display Name" type="text" />
            </span>
          </div>
        </div>
        <div className="flex flex-col w-[50%] items-start gap-1 mt-4">
          <label htmlFor="input2">
            <span className="text-[#999996dd] text-[0.85rem] "> Bio</span>
          </label>
          <div className="bg-[#303031] pb-10 w-[60%] rounded-[6px]  ">
            <span className=" ">
              <textarea name='bio' id='input2' className="px-2 text-[1rem] outline-0 resize-none text-[#e0e0dedd] w-full " placeholder="Bio"   >
              </textarea>
            </span>
          </div>
        </div>
        <button type='submit' className="bg-[#5151C6] py-2 px-4 mt-6 rounded-[7px]">{isTextLoading ? <BeatLoader color="white" size={10}/> : 'Submit'}</button>

      </form>
    </div>
  )
}