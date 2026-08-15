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
  <div className="flex-none">
    <button className="btn btn-square btn-ghost">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block stroke-current w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
    </button>
  </div>
  <div className="flex-1">
    <a className="text-xl btn btn-ghost">daisyUI</a>
  </div>
  <div className="flex-none">
    <button className="btn btn-square btn-ghost">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block stroke-current w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
    </button>
  </div>
</div>
     </div>
   )
 }
 
 export default App
 