
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../Components/RegisterForm";
import DatabaseLandingAnimation from "../Components/LandingPageAnimation";


export const Register = () => {
  const navigate = useNavigate()


  return (
    <div className="relative">
      <DatabaseLandingAnimation/>
      <div className="w-full max-w-sm p-6 bg-white absolute text-black rounded-lg shadow-md top-10 left-[35%]">
        <h2 className="mb-6 text-3xl font-bold text-center  ">
          Sign up
        </h2>
        <RegisterForm />
        <p className="mt-4 text-sm text-center ">
          have an account?
          <button onClick={() => { navigate('/') }} className="text-[#213ec0f1] hover:underline">
            Log in
          </button>
        </p>
      </div>
    </div>

  );
}
