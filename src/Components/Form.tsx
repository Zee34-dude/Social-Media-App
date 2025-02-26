import { useState } from 'react'
import * as yup from 'yup'
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/Firebase'
// import { useAuthState } from "react-firebase-hooks/auth"

import { useNavigate } from 'react-router-dom'
interface Form {
  email: string,
  password: string
}

export function Form() {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const schema = yup.object().shape({
    email: yup.string().email().required('Enter a valid Email'),
    password: yup.string().min(4).required('Password is required')

  })
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: yupResolver(schema) })

  const onSubmit = async (data: Form) => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);


      navigate('/')
    }

    catch (err) {
      console.log(err)

      if (err) {
        setError(true)
      }
    }

    finally {
      setLoading(false)
    }


  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          className="w-full px-4 py-2  bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-600"
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
          className="w-full px-4 py-2  bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-600"
          required
          onClick={() => setError(false)}
          {...register('password')}
        />
        {errors.password && <p className='text-red-600'> {errors.password?.message}</p>}
        {error && <p className='text-red-700 text-sm'>Invalid username or password</p>}
      </div>
      <div className="flex items-center mb-4">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-center "
      >
        {loading ? <div className='spinner'> </div> : 'Login'}
      </button>
    </form>
  )


}



