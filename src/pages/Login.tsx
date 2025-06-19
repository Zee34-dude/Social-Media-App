import { auth, db, Provider } from "../config/Firebase";
import {  signInWithPopup} from "firebase/auth";
import { Form } from "../Components/Form";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { useContext,  useState } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { generateRandomId } from "../Components/RandomId";
import DatabaseLandingAnimation from "../Components/LandingPageAnimation";
import googleImage from "../assets/google.bc5e59cc.svg";
import { stateContext } from "../Context/StateContext";

export const Login = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const {setIsOpen}=useContext(stateContext)
  const docRef = collection(db, "user");
  const [loadingState, setLoadingState] = useState(false);
  // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const processUser = async (uid: string) => {
    const q = query(docRef, where("userId", "==", uid));
    const docs = await getDocs(q);

    if (docs.empty) {
      const randomId = generateRandomId() as number;
      await addDoc(docRef, {
        userId: uid,
        RandomId: `https://avatar.iran.liara.run/public/${randomId}`,
      });
      console.log("New user document created");
    } else {
      console.log("Existing user found");
    }

    navigate("/");
    setIsOpen(false);
  };

  const handleSignIn = async () => {
    try {
      setLoadingState(true);
      // if (isMobile) {
      //   console.log("Using redirect sign-in for mobile");
      //   await signInWithRedirect(auth, Provider);
      // } else {
      //   console.log("Using popup sign-in for desktop");
      const result = await signInWithPopup(auth, Provider);
      if (result?.user) {
        await processUser(result.user.uid);
      }
    }
    catch (err) {
      console.error("Sign-in error", err);
    } finally {
      setLoadingState(false);
    }
  };

  // useEffect(() => {
  //   const checkRedirectResult = async () => {
  //     try {
  //       setLoadingState(true);
  //       console.log("Checking redirect result...");
  //       const result = await getRedirectResult(auth);
  //       if (result?.user) {
  //         console.log("Redirect result found", result.user);
  //         await processUser(result.user.uid);
  //       } else {
  //         console.log("No redirect result");
  //       }
  //     } catch (err) {
  //       console.error("Error handling redirect result", err);
  //     } finally {
  //       setLoadingState(false);
  //     }
  //   };

  //   checkRedirectResult();

  //   const unsub = onAuthStateChanged(auth, (user) => {
  //     console.log("Auth state changed:", user);
  //     if (user) {
  //       processUser(user.uid);
  //     }
  //   });

  //   return () => unsub();
  // }, []);

  return (
    <div className="h-[630px] text-black">
      {!user && (
        <div className="flex min-h-screen h-full w-full">
          <DatabaseLandingAnimation />
          <div className="edit-login min-[600px]:w-[70%] h-full p-6 bg-[#ffffff] shadow-md">
            <h2 className="mb-6 text-3xl font-bold text-center">Login</h2>
            <Form />
            <button
              className="w-full py-2 border-1 hover:border-blue-500 hover:text-blue-500 mt-8 border-gray-300 flex justify-center items-center rounded-3xl gap-2 transition-colors"
              onClick={handleSignIn}
            >
              {loadingState && <div className="spinner border-1 w-5 h-5"></div>}
              <img src={googleImage} alt="Google logo" />
              Sign in with Google
            </button>
            <p className="mt-20 text-sm text-center">
              Don’t have an account?
              <button
                onClick={() => navigate("/register")}
                className="text-[#213ec0f1] hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
