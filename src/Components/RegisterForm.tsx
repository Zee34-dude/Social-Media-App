import { createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { useState, useContext } from "react";
import { auth } from '../config/Firebase'
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { generateRandomId } from "./RandomId";
import { db } from "../config/Firebase";
import { addDoc, collection } from "firebase/firestore";

interface CreateForm {
  name: string,
  email: string,
  password: string,
  confirmPassword: string
}


export const RegisterForm = () => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { setAuthInitialized } = useContext(UserContext)
  const randomId = generateRandomId() as number
  const schema = yup.object().shape({
    name: yup.string().required('this field is required'),
    email: yup.string().email().required('Please enter a vaild Email address'),
    password: yup.string().min(4).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password')], "Passwords Don't Match").required(),

  })

  const { register, handleSubmit, formState: { errors } } = useForm<CreateForm>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: CreateForm) => {

    try {
      setLoading(true)
      const userCredentials = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await signOut(auth)
      await updateProfile(userCredentials.user, {
        displayName: data.name
      });
      await addDoc(collection(db, 'user'), {
        userId: userCredentials.user?.uid,
        RandomId: `https://avatar.iran.liara.run/public/${randomId}`
      })
      setAuthInitialized(false)

      navigate('/')

    } catch (err: any) {
      console.log(err.message);
      setError(true)
    }
    finally {
      setAuthInitialized(true)
      setLoading(false)
    }

  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium "
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="Full name"
          className="w-full px-4 py-2  bg-gray-50 border outline-none border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-600"
          required
          {...register('name')}
        />
        {errors && <p className='text-red-600x'> {errors.email?.message}</p>}
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium "
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 outline-none  bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-600"
          required
          {...register('email')}
        />
        {errors && <p className='text-red-600x'> {errors.email?.message}</p>}
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium "
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          className="w-full px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-600"
          required
          {...register('password')}
        />
        {errors.password && <p className='text-red-600'> {errors.password?.message}</p>}
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium "
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm password"
          className="w-full px-4 py-2 outline-none  bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-600"
          required
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <p className='text-red-600'> {errors.confirmPassword?.message}</p>}
        {error && <p className="text-red-600 text-sm">Account already exists</p>}
      </div>


      <div className="flex items-center mb-4">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 text-blue-600 outline-none border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          htmlFor="remember"
          className="ml-2 text-sm "
        >
          Remember me
        </label>
      </div>

      <button
        type="submit"
        className="w-full px-4  flex justify-center py-2 outline-none text-white bg-[#213ec0f1] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {loading ? <div className='spinner border-2  w-7 h-7'> </div> : 'Sign Up'}

      </button>
    </form>
  )

}