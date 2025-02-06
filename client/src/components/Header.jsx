// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    /* responsive hedder that including logo  home page, about page Sign in button */
    <header className='text-gray-600 body-font'>
      <div className='container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center'>
        <Link
          to='/'
          className='flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0'
        >
          <span className='ml-3 text-xl'>Home</span>
        </Link>
        <nav className='md:ml-auto flex flex-wrap items-center text-base justify-center'>
          {/* <Link to='/about' className='mr-5 hover:text-gray-900'>
            About
          </Link> */}
          <Link to='/profile' className='relative left-[50px] mt-5 hover:text-gray-900 hover:underline'>
            {currentUser ? (
              <div className="flex space-x-4">
                <div>
                  <h4 className="font-bold text-black text-[1.3rem]  " >{currentUser.username}</h4>
                  <p className="text-[0.9rem] font-extralight text-[#98A1B8] " >{currentUser.email}</p>
                </div>

                <img
                  src={currentUser.profilePicture}
                  alt='profile'
                  className='h-10 w-10 rounded-full object-cover '
                />
              </div>
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
