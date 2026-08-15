 import React from 'react'
import "./App.css";import "./index.css"
 function App() {
   return (
     <div>
     {/* Navbar */}
      <nav className="flex justify-between items-center bg-white shadow-md px-6 py-4">
        <h1 className="font-bold text-purple-600 text-xl">MyCommunity</h1>
        <ul className="flex gap-6 font-medium text-gray-700">
          <li className="hover:text-purple-600 cursor-pointer">Home</li>
          <li className="hover:text-purple-600 cursor-pointer">About</li>
          <li className="hover:text-purple-600 cursor-pointer">Contact</li>
        </ul>
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white">
          Login
        </button>
      </nav>

      {/* Card */}
      <div className="flex justify-center mt-10">
        <div className="bg-white shadow-lg border border-gray-200 rounded-xl w-72 overflow-hidden">
          <img
            src="https://placehold.co/300x150"
            alt="card"
            className="w-full h-36 object-cover"
          />
          <div className="p-4">
            <h2 className="font-semibold text-gray-800 text-lg">Card Title</h2>
            <p className="mt-1 text-gray-500 text-sm">
              Ye ek simple card hai Tailwind se banaya gaya, bas check karne ke liye ki styling sahi se apply ho rahi hai.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 mt-4 px-4 py-2 rounded-lg w-full text-white text-sm">
              Read More
            </button>
          </div>
        </div> 
      </div>
      <div className="bg-base-100 shadow-sm navbar">
  <div className="flex-1">
    <a className="text-xl btn btn-ghost">daisyUI</a>
  </div>
  <div className="flex-none">
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
          <span className="badge badge-sm indicator-item">8</span>
        </div>
      </div>
      <div
        tabIndex={0}
        className="z-1 bg-base-100 shadow mt-3 w-52 card card-sm dropdown-content">
        <div className="card-body">
          <span className="font-bold text-lg">8 Items</span>
          <span className="text-info">Subtotal: $999</span>
          <div className="card-actions">
            <button className="btn-block btn btn-primary">View cart</button>
          </div>
        </div>
      </div>
    </div>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="rounded-full w-10">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex="-1"
        className="z-1 bg-base-100 shadow mt-3 p-2 rounded-box w-52 menu menu-sm dropdown-content">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
     </div>
   )
 }
 
 export default App
 