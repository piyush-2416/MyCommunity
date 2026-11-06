import React from "react";
import "./App.css";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

// ---------- Auth pages ----------
import Auth from "./Pages/Auth.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Logout from "./Pages/Logout.jsx";

// ---------- Pages ----------
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import VolunteerDashboard from "./Pages/VolunteerDashboard.jsx";
import VolunteerProfile from "./Pages/VolunteerProfile.jsx";
import Business from "./Pages/Business.jsx";
import Complaints from "./Pages/Complaints.jsx";
import ComplaintsCrud from "./Pages/ComplaintsCrud.jsx";
import Emergency from "./Pages/Emergency.jsx";
import Emergencycrud from "./Pages/Emergencycrud.jsx";
import Events from "./Pages/Events.jsx";
import Notice from "./Components/Notices.jsx";
import Profile from "./Pages/Profile.jsx";
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
import Feed from "./Pages/Feed.jsx";
import Feedback from "./Pages/Feedback.jsx";
 import Explore from "./Pages/Explore.jsx";
import Achievements from "./Pages/Achievements.jsx";
import SafetyCheck from "./Pages/Safetycheck.jsx";
import SafetyPlanner from "./Pages/SafetyPlanner.jsx";

/* =====================================================================
   ROLES: "user" = Resident, "volunteer" = Volunteer, "admin" = Admin
   Admin ko har route par jaane diya jaata hai (neeche R() khud jodta hai).
   Kisi route ka role badalna ho to bas us line ki list badlo.
   ===================================================================== */
const RESIDENT = ["user"];
const VOLUNTEER = ["volunteer"];
const BOTH = ["user", "volunteer"];

// Is route par sirf diye gaye roles (+ admin) ja sakte hain, baaki "/" par wapas
const R = (roles, page) => (
  <ProtectedRoute roles={[...roles, "admin"]}>{page}</ProtectedRoute>
);

/* "/" par: login nahi hai to Auth page.
   Login hai to volunteer/admin ko Dashboard, baaki ko Home */
function RootRoute() {
  const { user, loading } = useAuth();
  if (loading) return null; // user check hone tak kuch mat dikhao
  if (!user) return <Auth />;
  return user.role === "volunteer" || user.role === "admin" ? (
    <VolunteerDashboard />
  ) : (
    <Home />
  );
}

/* ---------- Route list: [path, page, roles] ---------- */
const protectedRoutes = [
  // ===== Dono (Resident + Volunteer) =====
  ["/Notice", <Notice />, BOTH],
  ["/Events", <Events />, BOTH],
  ["/Complaints", <Complaints />, BOTH],
  ["/Emergency", <Emergency />, BOTH],
  ["/Society_Polls", <Society_polls />, BOTH],
  ["/Directory", <Directory />, BOTH],
  ["/Business", <Business />, BOTH],
  ["/Lost_Found-data", <Lost_Found />, BOTH],
  ["/SafetyChecker", <SafetyCheck />, BOTH],
  ["/SafetyPlanner", <SafetyPlanner />, BOTH],
  ["/Gallery", <Gallery />, BOTH],
  ["/Feedback", <Feedback />, BOTH],
  ["/Blogs", <Blogs />, BOTH],
  ["/Profile", <Profile />, BOTH],
  ["/Elders", <Elders />, BOTH],
  ["/Blood_donation", <Blood_donation />, BOTH],
  ["/Dogs_care", <Dogs_care />, BOTH],
  ["/Feed", <Feed />, BOTH],

  ["/TreesPlats", <TreesPlats />, BOTH],
  ["/AnimalsSafety", <AnimalsSafety />, BOTH],
  // ===== Sirf Resident =====
   ["/AnimalsSafety", <AnimalsSafety />, RESIDENT],
  ["/Blood_donation", <Blood_donation />, RESIDENT],
  ["/Dogs_care", <Dogs_care />, RESIDENT],
  ["/TreesPlats", <TreesPlats />, RESIDENT],
  ["/Explore", <Explore />, RESIDENT],
   ["/Achievements", <Achievements />, RESIDENT],

  // ===== Sirf Volunteer =====
  ["/volunteer/dashboard", <VolunteerDashboard />, VOLUNTEER],
  ["/volunteer/profile", <VolunteerProfile />, VOLUNTEER],

  ["/ComplaintsCrud", <ComplaintsCrud />, VOLUNTEER],
  ["/Emergencycrud", <Emergencycrud />, VOLUNTEER],

];

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider sabse bahar: Navbar, Login, ProtectedRoute sab isi ke andar */}
      <AuthProvider>
        <Routes>
          {/* ---------- Public (login ke bina) ---------- */}
          <Route path="/" element={<RootRoute />} />
          <Route path="/Auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/About" element={<About />} />

          {/* ---------- Role ke hisaab se protected routes ---------- */}
          {protectedRoutes.map(([path, page, roles]) => (
            <Route key={path} path={path} element={R(roles, page)} />
          ))}

          {/* Purane link: /SafetyCheck -> /SafetyChecker */}
          <Route
            path="/SafetyCheck"
            element={<Navigate to="/SafetyChecker" replace />}
          />

          {/* ---------- Koi galat URL ---------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
