import React from "react";
import "./App.css";import "./index.css";
import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Navbar from "./Pages/Navbar.jsx";
import Business from "./Pages/Business.jsx";
 import Complaints from "./Pages/Complaints.jsx";
 import Emergency from "./Pages/Emergency.jsx";
 import Event from "./Pages/Event.jsx";
  import Notice from "./Components/Notices.jsx";
 import Profile from "./Pages/Profile.jsx";
 import Lost_Found from "./Pages/Lost_Found.jsx";
 import Society_polls from "./Pages/Society_Polls.jsx";
 import Elders from "./Pages/Elders.jsx";
 import AnimalsSafety from "./Pages/AnimalSafety.jsx";
 import Blood_donation from "./Pages/Blood_donation";
 import Dogs_care from "./Pages/Dogs_care";
 import TreesPlats from "./Pages/TreesPlats";
  
function App() {
  return (
    <>
         <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Navbar" element={<Navbar />} />
          <Route path="Business" element={<Business />} />
          <Route path="/Complaints" element={<Complaints />} />
          <Route path="/Emergency" element={<Emergency />} />
          <Route path="/Event" element={<Event />} />
             <Route path="/Lost_Found-data" element={<Lost_Found />} />
          <Route path="/Notice" element={<Notice />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Society_Polls" element={<Society_polls />} />
          <Route path="/Elders" element={<Elders />} />
      <Route path="/AnimalsSafety" element={<AnimalsSafety />} />
          <Route path="/Blood_donation" element={<Blood_donation />} />
          <Route path="/Dogs_care" element={<Dogs_care />} />
          <Route path="/TreesPlats" element={<TreesPlats />} /> 
          {/* <Route path="/" element={<Home />} />  */}

{/* <Route path="/Doctorid/:id" element={<Doctorid />} />  */}

{/* <Route path="/products/:id" element={<ProductPage />} />  */}
        </Routes>
      </BrowserRouter>
      </>
  );
}

export default App;
