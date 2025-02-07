// eslint-disable-next-line no-unused-vars
import React from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import landingimg from "../assets/landingimg.svg"
export default function Home() {
  console.log("Home");
  return (
  <div>
     <Header/>
     <div className="flex justify-center ">
      <div className="bg-black rounded-2xl w-[93%] mt-6  h-auto " >
          <div className="flex mt-10 items-center justify-center">
            <h1 className="text-[6rem]  font-bold  tracking-tight bg-gradient-to-r from-white via-gray-300 to-gray-400 text-transparent bg-clip-text">
                      InaiVibe
            </h1> 
          </div>
          {/* fef */}
          <div className="flex mt-4">
              <div >
                <div className="ml-28">
                  <h1 className="text-white text-[3rem] font-light w-[520px]">
                    Watch videos with your <br /> friends seamlessly
                  </h1>
                  <h3 className="text-[#BDBDBD] text-[1rem] mt-3 font-light w-[520px]">
                    Watch videos seamlessly with your friends <br /> in perfect sync, no matter where they are. Enjoy <br /> shared viewing experiences with interactive <br /> controls and real-time reactions.
                  </h3>
                  <div className=" flex mt-[30px] space-x-4 ">
                    <Link to='/room' className="text-black bg-white text-[1.2rem] p-2 px-5 rounded-3xl">
                      Create Room →
                    </Link>
                    <Link className=" text-white relative top-2 text-[1.2rem]">About </Link>
                  </div>
                </div>
                </div>
                <div className=" mt-[10px] mb-[80px] mr-6 ml-12">
                  <img src={landingimg} className="  h-[400px] " alt="" />
                </div>
          </div>
         
      </div>
     </div>

  </div>
  );
}
