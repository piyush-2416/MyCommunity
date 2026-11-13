import React from "react";
import "./App.css";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VolunteerProfile from "./Pages/VolunteerProfile.jsx";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Auth from "./Pages/Auth.jsx";
// ---------- Auth pages ----------
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import Logout from "./Pages/Logout.jsx";

// ---------- Pages ----------
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
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
import Settings from "./Pages/Setting.jsx";
import Explore from "./Pages/Explore.jsx";
import Achievements from "./Pages/Achievements.jsx";
import SafetyCheck from "./Pages/Safetycheck.jsx";
import SafetyPlanner from "./Pages/SafetyPlanner.jsx";
import VolunteerDashboard from "./Pages/VolunteerDashboard.jsx";
import { useAuth } from "./context/AuthContext";
// Login ke peeche wala page: <P><Page /></P>
const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;
// "/" par volunteer ko Dashboard, baaki sabko purani Home
function HomeRouter() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === "volunteer" ? <VolunteerDashboard /> : <Home />;
}

// "/" par: login nahi hai to Auth page, login hai to role wala Home/Dashboard
function RootRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <HomeRouter /> : <Auth />;
}
function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider sabse bahar: Navbar, Login, ProtectedRoute sab isi ke andar */}
      <AuthProvider>
        <Routes>
          {/* ---------- Public (login ke bina) ---------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/Auth" element={<Auth />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
            <Route path="/About" element={<About />} />

          {/* ---------- Community ---------- */}
<Route path="/" element={<RootRoute />} />          <Route
            path="/Dashboard"
            element={
              <P>
                <Dashboard />
              </P>
            }
          />
          <Route
            path="/Directory"
            element={
              <P>
                <Directory />
              </P>
            }
          />
          <Route
            path="/Society_Polls"
            element={
              <P>
                <Society_polls />
              </P>
            }
          />
          <Route
            path="/Business"
            element={
              <P>
                <Business />
              </P>
            }
          />
          <Route
            path="/Notice"
            element={
              <P>
                <Notice />
              </P>
            }
          />
          <Route
            path="/Events"
            element={
              <P>
                <Events />
              </P>
            }
          />
          <Route
            path="/Complaints"
            element={
              <P>
                <Complaints />
              </P>
            }
          />
          <Route
            path="/ComplaintsCrud"
            element={
              <P>
                <ComplaintsCrud />
              </P>
            }
          />
          <Route
            path="/Lost_Found-data"
            element={
              <P>
                <Lost_Found />
              </P>
            }
          />

          {/* ---------- Emergency ---------- */}
          <Route
            path="/Emergency"
            element={
              <P>
                <Emergency />
              </P>
            }
          />
          <Route
            path="/Emergencycrud"
            element={
              <P>
                <Emergencycrud />
              </P>
            }
          />

          {/* ---------- AI features ---------- */}
          <Route
            path="/SafetyChecker"
            element={
              <P>
                <SafetyCheck />
              </P>
            }
          />
          <Route
            path="/SafetyCheck"
            element={<Navigate to="/SafetyChecker" replace />}
          />
          <Route
            path="/SafetyPlanner"
            element={
              <P>
                <SafetyPlanner />
              </P>
            }
          />

          {/* ---------- Care ---------- */}
          <Route
            path="/Elders"
            element={
              <P>
                <Elders />
              </P>
            }
          />
          <Route
            path="/AnimalsSafety"
            element={
              <P>
                <AnimalsSafety />
              </P>
            }
          />
          <Route
            path="/Blood_donation"
            element={
              <P>
                <Blood_donation />
              </P>
            }
          />
          <Route
            path="/Dogs_care"
            element={
              <P>
                <Dogs_care />
              </P>
            }
          />
          <Route
            path="/TreesPlats"
            element={
              <P>
                <TreesPlats />
              </P>
            }
          />

          {/* ---------- Discover ---------- */}
          <Route
            path="/Explore"
            element={
              <P>
                <Explore />
              </P>
            }
          />
          <Route
            path="/Feed"
            element={
              <P>
                <Feed />
              </P>
            }
          />
          <Route
            path="/Gallery"
            element={
              <P>
                <Gallery />
              </P>
            }
          />
          <Route
            path="/Achievements"
            element={
              <P>
                <Achievements />
              </P>
            }
          />
          <Route
            path="/Feedback"
            element={
              <P>
                <Feedback />
              </P>
            }
          />
          <Route
            path="/Blogs"
            element={
              <P>
                <Blogs />
              </P>
            }
          />

          {/* ---------- Account ---------- */}
          <Route
            path="/Profile"
            element={
              <P>
                <Profile />
              </P>
            }
          />
          {/* <Route path="/Setting" element={<P><Settings /></P>} /> */}
          <Route
            path="/volunteer/profile"
            element={
              <ProtectedRoute roles={["volunteer"]}>
                <VolunteerProfile />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/Profile" element={<P><Profile /></P>} />
<Route path="/logout" element={<Logout />} /> */}
          {/* <Route path="/volunteer/profile" element={<ProtectedRoute roles={["volunteer"]}><VolunteerProfile /></ProtectedRoute>} /> */}
          {/* ---------- Koi galat URL ---------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
