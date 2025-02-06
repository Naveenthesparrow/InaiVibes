// og code/////////////////////////////////////
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import Logo from '../assets/logo.png'
import Music1 from "../assets/Music1.svg"

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signin failed. Please try again.");
      }

      dispatch(signInSuccess(data));
      Swal.fire({ icon: "success", title: "Success!", text: "Signin successful." });
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Signin failed. Please try again.",
      });
    }
  };

  return (
    <div className="flex">

        <div className="aspect-square w-full max-w-full mx-auto relative">
          {/* Text on top */}
          <div className="absolute top-0 left-0 w-full h-full flex z-10">

            <img src={Music1} className="h-[200px] relative m-4 mt-[60px] "  alt="" />
            <div className="absolute left-1/2 -translate-x-1/2 flex justify-center w-full">
              <h1 className="text-[11rem] font-bold mt-[140px] tracking-tight bg-gradient-to-r from-white via-gray-300 to-gray-400 text-transparent bg-clip-text">
                InaiVibe
              </h1> 
            </div>

            <div>
              <div>
                <h2 className="text-white">Share Whatever you want to share</h2>
              </div>
            </div>



          </div>

          {/* Grid */}
          <div className="w-full h-full grid grid-cols-5 grid-rows-5 bg-gradient-to-tr from-[#2A2A2A]  to-[#000]">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="border-[0.1px] border-[#ffffff52] " />
            ))}
          </div>
        </div>

    <div className=" flex mr-[40px] ml-[40px] justify-end">
    <div className="flex min-h-screen items-center justify-center  p-4">
      <div className="  mb-[130px] w-[400px] space-y-8">
        <div className="text-center">
          <img
            src={Logo}
            alt="Logo"
            width={90}
            height={10}
            className="mx-auto mb-3"
          />
          <h1 className="text-3xl font-semibold">Sign in</h1>
          <p className="mt-2 text-[1.1rem] text-[#000]">Please enter your credentials</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4 mt-[60px]">
            <div className="space-y-1">
              <label className="text-[1rem] font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-[#000] pb-1 focus:border-black focus:outline-none transition-colors"
              />
            </div>
            <br />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[1rem] font-medium">Password</label>
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b border-[#000] pb-1 focus:border-black focus:outline-none transition-colors"
              />
            </div>
            <p className="text-sm text-gray-500 hover:text-gray-700 mt-3" >Forgot Passoword?</p>
          </div>
          <div className=" relative top-[20px]">

         
          <div className="flex mt-5 justify-center">
            <button
              type="submit"
              className=" w-[320px] rounded-full bg-[#000] py-2.5 text-white hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
         

          <OAuth />
          </div>

          
         
        </form>
        

        <p className="text-center relative text-[1rem] top-[110px]  text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
        
        
      </div>
      
      
    </div>
    
    
    </div>
    
    </div>
  );
}
