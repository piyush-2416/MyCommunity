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
          <Route path="/Notice" element={<Notice />} />
          <Route path="/Profile" element={<Profile />} />

{/* <Route path="/Doctorid/:id" element={<Doctorid />} />  */}

{/* <Route path="/products/:id" element={<ProductPage />} />  */}
        </Routes>
      </BrowserRouter>
      </>
  );
}

export default App;
