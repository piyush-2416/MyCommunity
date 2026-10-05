import React from "react";
import "./App.css";
import "./index.css";
// import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Navbar from "./Pages/Navbar.jsx";
import Business from "./Pages/Business.jsx";
import Complaints from "./Pages/Complaints.jsx";import About from "./Pages/About.jsx";
import Emergency from "./Pages/Emergency.jsx";
import Events from "./Pages/Events.jsx";
import Notice from "./Components/Notices.jsx";
import ComplaintsCrud from "./Pages/ComplaintsCrud.jsx";
import Profile from "./Pages/Profile.jsx";
import Emergencycrud from "./Pages/Emergencycrud.jsx";
import Lost_Found from "./Pages/Lost_Found.jsx";
import Society_polls from "./Pages/Society_Polls.jsx";
import Elders from "./Pages/Elders.jsx";
import AnimalsSafety from "./Pages/AnimalSafety.jsx";
import Blood_donation from "./Pages/Blood_donation";
import Dogs_care from "./Pages/Dogs_care";
import Directory from "./Pages/Directory.jsx";
import TreesPlats from "./Pages/TreesPlats";
import Gallery from "./Pages/Gallery";
import Blogs from "./Components/Blogs.jsx";
import Footer from "./Pages/Footer.jsx";
import NotificationBell from "./Pages/NotificationBell .jsx";
import Feed from "./Pages/Feed.jsx";
import Feedback from "./Pages/Feedback.jsx";
import Settings from "./Pages/Setting.jsx";
import Explore from "./Pages/Explore.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Achievements from "./Pages/Achievements.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />          <Route path="/About" element={<About />} />

          <Route path="/Navbar" element={<Navbar />} />
          <Route path="Business" element={<Business />} />
          <Route path="/Complaints" element={<Complaints />} />
          <Route path="/Emergency" element={<Emergency />} />
          <Route path="/Events" element={<Events />} />
          <Route path="/Footer" element={<Footer />} />
          <Route path="/NotificationBell " element={<NotificationBell />} />
          <Route path="/Directory" element={<Directory />} />
          <Route path="/Blogs" element={<Blogs />} />
                    <Route path="/Emergencycrud" element={<Emergencycrud />} />          <Route path="/About" element={<About />} />

          <Route path="/ComplaintsCrud" element={<ComplaintsCrud />} />
          <Route path="/Lost_Found-data" element={<Lost_Found />} />
          <Route path="/Notice" element={<Notice />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Society_Polls" element={<Society_polls />} />
          <Route path="/Elders" element={<Elders />} />
          <Route path="/AnimalsSafety" element={<AnimalsSafety />} />
          <Route path="/Blood_donation" element={<Blood_donation />} />
          <Route path="/Dogs_care" element={<Dogs_care />} />
          <Route path="/TreesPlats" element={<TreesPlats />} />
          <Route path="/Gallery" element={<Gallery />} />
          <Route path="/Feed" element={<Feed />} />
          <Route path="/Feedback" element={<Feedback />} />{" "}
          <Route path="/Dashboard" element={<Dashboard />} />{" "}
          <Route path="/Achievements" element={<Achievements />} />{" "}
          <Route path="/Setting" element={<Settings />} />
            <Route path="/Explore" element={<Explore />} />

          {/* <Route path="/" element={<Home />} />  */}
          {/* <Route path="/Doctorid/:id" element={<Doctorid />} />  */}
          {/* <Route path="/products/:id" element={<ProductPage />} />  */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
