
import { auth, db, Provider } from "../config/Firebase"
import { signInWithPopup } from 'firebase/auth'
import { Form } from "../Components/Form";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App'
import { useContext } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { generateRandomId } from "../Components/RandomId";
import DatabaseLandingAnimation from "../Components/LandingPageAnimation";
import googleImage from '../assets/google.bc5e59cc.svg'
export const Login = () => {
  const navigate = useNavigate()
  const { user, setIsOpen } = useContext(UserContext)
  const randomId = generateRandomId() as number
  const docRef = collection(db, 'user');


  const signInPopup = async () => {

    try {
      const result = await signInWithPopup(auth, Provider);
      const q = query(docRef, where('userId', '==', result.user.uid))
      const docs = await getDocs(q)
      if (docs.empty) {
        await addDoc(collection(db, 'user'), {
          userId: result.user?.uid,
          RandomId: `https://avatar.iran.liara.run/public/${randomId}`
        });
        console.log('yes')
      }


      navigate('/')
      setIsOpen(false)
    }
    catch (rr) {
      console.log(rr)
    }


  }

  return (

    <div className="h-[630px] text-black">
      {!user && <div className="flex min-h-screen  h-full w-full">
        <DatabaseLandingAnimation />
        <div className=" edit-login min-[600px]:w-[70%] h-full p-6 bg-[#ffffff] shadow-md  ">
          <h2 className="mb-6 text-3xl font-bold text-center ">
            Login
          </h2>
          <Form />
          <button className="w-full py-2 border-1 hover:border-blue-500 
          hover:text-blue-500 mt-8 border-gray-300 flex justify-center items-center
           rounded-3xl gap-2 transition-colors " onClick={signInPopup}>
            <img src={googleImage} alt="" />
            Sign in with Google
          </button>
          <p className="mt-20 text-sm text-center  ">
            Don’t have an account?
            <button onClick={() => { navigate('/register') }}
              className="text-[#213ec0f1] hover:underline 
            ">
              Sign up
            </button>
          </p>
        </div>
      </div>
      }
    </div>

  );
}
