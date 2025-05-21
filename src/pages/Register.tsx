
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../Components/RegisterForm";
export const Register = () => {
  const navigate = useNavigate()


  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500 text-black">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-3xl font-bold text-center ">
          Sign up
        </h2>
        <RegisterForm />
        <p className="mt-4 text-sm text-center ">
           have an account?
          <button onClick={() => { navigate('/') }} className="text-blue-500 hover:underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
