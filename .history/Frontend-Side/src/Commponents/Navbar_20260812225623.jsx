 import React from 'react'
import { Link } from 'react-router-dom'
 import { useState } from 'react'
 import About from './About'
 import Login from '../Pages/Login'
 import Appointment from '../Pages/Appointment'
 import Schemes from '../Pages/Schemes'
 import SignIn from '../Pages/Signin'
 import Profile from '../Pages/Profile'
//  import { BrowserRouter, Routes, Route } from "react-router-dom";
 import Doctors from '../Pages/Doctors'
 function Navbar() {
   return (
     <div>
         
  <div className="bg-base-100 shadow-sm navbar">
  <div className="navbar-start">
    <div className="dropdown">
        <Link to="/"><a className="text-xl btn btn-ghost">CarePoint</a>
</Link> 
       
    </div>
  </div>
  <div className="navbar-center">
   <Link to="/Doctors"> <button className="btn-outline btn btn-ghost">
      <div className="indicator">
Doctor       <span className="badge badge-xs badge-primary indicator-item"></span>
      </div>
    </button> </Link>|  
      <Link to="/About">
       <button className="btn-outline btn btn-ghost">
      <div className="indicator">
About      <span className="badge badge-xs badge-primary indicator-item"></span>
      </div>
    </button> |
    </Link> 
<Link to="/Medicines">  <button className="btn-outline btn btn-ghost">
      <div className="indicator">
Medicine      <span className="badge badge-xs badge-primary indicator-item"></span>
      </div>
    </button></Link>  </div>
  <div className="navbar-end">
   <Link to="/Appointment"> <button1 className="btn btn-ghost btn-circle">
📅    </button1></Link>
 <Link to="/schemes"> <button1 className="btn btn-ghost btn-circle">
 🏛️   </button1></Link>
 {/* <Link to=""><button className="btn btn-ghost btn-circle">
      <div className="indicator">
       <span className="badge badge-xs badge-primary indicator-item"></span>
      </div>
    </button></Link> */}
   <Link to="/Profile"> <button1 className="btn btn-ghost btn-circle">
      <div className="indicator">
👤        <span className="badge badge-xs badge-primary indicator-item"></span>
      </div>
    </button1></Link> 
  </div>
</div>  
      {/* </div> */}
     </div>
   )
 }
 
 export default Navbar
 