
import { auth, Provider } from "../config/Firebase"
import { signInWithPopup } from 'firebase/auth'
import { Form } from "../Components/Form";
import { useNavigate } from "react-router-dom";
import { UserContext} from '../App'
import { useContext } from "react";
export const Login = () => {
  const navigate = useNavigate()
  const { user,setIsOpen} = useContext(UserContext)
  console.log(user)
  const signInPopup = async () => {
    try {
      const result = await signInWithPopup(auth, Provider);
      console.log(result)
      navigate('/')
      setIsOpen(false)
    }
    catch (rr) {
      console.log(rr)
    }


  }

  return (
    <>
     {!user&&<div className="flex items-center justify-center min-h-screen bg-gray-100 text-white">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md bg-line bg-gradient-to-br from-blue-700  to-purple-700  to-95%">
          <h2 className="mb-6 text-3xl font-bold text-center ">
            Login
          </h2>
          <Form />
          <button className="w-full" onClick={signInPopup}>Sign up with Google</button>
          <p className="mt-4 text-sm text-center ">
            Don’t have an account?
            <button onClick={() => { navigate('/register') }} className="text-blue-500 hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </div>
      }
    </>
  );
}
