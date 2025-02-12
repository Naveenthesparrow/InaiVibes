// eslint-disable-next-line no-unused-vars
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
  
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Allows cookies to be sent/received
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
  
      const data = await res.json();
      console.log("Backend Response:", data);
  
      if (!res.ok) {
        throw new Error(data.message || "Google Sign-in failed");
      }
  
      // Store user data in Redux or local state
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("Google Sign-in Error:", error.message);
    }
  };
  
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-[320px] my-3 bg-[#EEF1F0] text-black  py-2 px-4 hover:opacity-95 hover:bg-[#F7F9FA] focus:outline-none rounded-full"
      >
        Sign In with Google
      </button>
    </div>
  );
}
