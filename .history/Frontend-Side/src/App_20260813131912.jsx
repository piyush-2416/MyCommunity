 import React from 'react'
import "./App.css";import "./index.css"
 function App() {
   return (
     <div>
  <div className="drawer">
  <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
     
  </div>
  <div className="drawer-side">
    <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>
    <ul className="bg-base-200 p-4 w-80 min-h-full menu">
      {/* Sidebar content here */}
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </ul>
  </div>
</div>
<div className="bg-base-100 shadow-sm navbar">
  <div className="navbar-start">
    <div className="dropdown">
     <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    {/* Page content here */}
    <label htmlFor="my-drawer-1" className="btn drawer-button"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block stroke-current w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg></label>
  </div>
     
    </div>
  </div>
  <div className="navbar-center">
    <a className="text-xl btn btn-ghost"> Home</a>
  </div>
  <div className="navbar-end">
    <button className="btn btn-ghost btn-circle">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
    </button>
    <button className="btn btn-ghost btn-circle">
      <div className="indicator">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
        <span className="badge badge-xs badge-primary indicator-item"></span>
      </div>
    </button>
  </div>
</div>
     </div>
   )
 }
 
 export default App
 