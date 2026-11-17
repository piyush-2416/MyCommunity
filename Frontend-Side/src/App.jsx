import React, { lazy, Suspense } from "react";
import "./App.css";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

// ---------- Eager (logout wala "/" page turant dikhna chahiye) ----------
import Auth from "./Pages/Auth.jsx";

// ---------- Lazy: har page apna alag chhota bundle banayega ----------
const Login = lazy(() => import("./Pages/Login.jsx"));
const Signup = lazy(() => import("./Pages/Signup.jsx"));
const Logout = lazy(() => import("./Pages/Logout.jsx"));

const Home = lazy(() => import("./Pages/Home.jsx"));
const About = lazy(() => import("./Pages/About.jsx"));
const Dashboard = lazy(() => import("./Pages/Dashboard.jsx"));
const Business = lazy(() => import("./Pages/Business.jsx"));
const Complaints = lazy(() => import("./Pages/Complaints.jsx"));
const ComplaintsCrud = lazy(() => import("./Pages/ComplaintsCrud.jsx"));
const Emergency = lazy(() => import("./Pages/Emergency.jsx"));
const Emergencycrud = lazy(() => import("./Pages/Emergencycrud.jsx"));
const Events = lazy(() => import("./Pages/Events.jsx"));
const Notice = lazy(() => import("./Components/Notices.jsx"));
const Profile = lazy(() => import("./Pages/Profile.jsx"));
const Lost_Found = lazy(() => import("./Pages/Lost_Found.jsx"));
const Society_polls = lazy(() => import("./Pages/Society_Polls.jsx"));
const Elders = lazy(() => import("./Pages/Elders.jsx"));
const AnimalsSafety = lazy(() => import("./Pages/AnimalSafety.jsx"));
const Blood_donation = lazy(() => import("./Pages/Blood_donation"));
const Dogs_care = lazy(() => import("./Pages/Dogs_care"));
const Directory = lazy(() => import("./Pages/Directory.jsx"));
const TreesPlats = lazy(() => import("./Pages/TreesPlats"));
const Gallery = lazy(() => import("./Pages/Gallery"));
const Blogs = lazy(() => import("./Components/Blogs.jsx"));
const Feed = lazy(() => import("./Pages/Feed.jsx"));
const Feedback = lazy(() => import("./Pages/Feedback.jsx"));
const Explore = lazy(() => import("./Pages/Explore.jsx"));
const Achievements = lazy(() => import("./Pages/Achievements.jsx"));
const SafetyCheck = lazy(() => import("./Pages/SafetyCheck.jsx"));
const SafetyPlanner = lazy(() => import("./Pages/SafetyPlanner.jsx"));
const VolunteerDashboard = lazy(() => import("./Pages/VolunteerDashboard.jsx"));
const VolunteerProfile = lazy(() => import("./Pages/VolunteerProfile.jsx"));
// Settings abhi use nahi ho raha (route commented hai), isliye import hata diya.
// Jab route chalu karo to ye line wapas lagao:
// const Settings = lazy(() => import("./Pages/Setting.jsx"));

// Login ke peeche wala page: <P><Page /></P>
const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

// Page load hote waqt dikhne wala simple loader (animation nahi)
const PageLoader = () => (
  <div style={{ padding: "48px 16px", textAlign: "center", color: "#166534" }}>
    Loading...
  </div>
);

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ---------- Public (login ke bina) ---------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/Auth" element={<Auth />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/About" element={<About />} />

            {/* ---------- Community ---------- */}
            <Route path="/" element={<RootRoute />} />
            <Route path="/Dashboard" element={<P><Dashboard /></P>} />
            <Route path="/Directory" element={<P><Directory /></P>} />
            <Route path="/Society_Polls" element={<P><Society_polls /></P>} />
            <Route path="/Business" element={<P><Business /></P>} />
            <Route path="/Notice" element={<P><Notice /></P>} />
            <Route path="/Events" element={<P><Events /></P>} />
            <Route path="/Complaints" element={<P><Complaints /></P>} />
            <Route path="/ComplaintsCrud" element={<P><ComplaintsCrud /></P>} />
            <Route path="/Lost_Found-data" element={<P><Lost_Found /></P>} />

            {/* ---------- Emergency ---------- */}
            <Route path="/Emergency" element={<P><Emergency /></P>} />
            <Route path="/Emergencycrud" element={<P><Emergencycrud /></P>} />

            {/* ---------- AI features ---------- */}
            <Route path="/SafetyChecker" element={<P><SafetyCheck /></P>} />
            <Route
              path="/SafetyCheck"
              element={<Navigate to="/SafetyChecker" replace />}
            />
            <Route path="/SafetyPlanner" element={<P><SafetyPlanner /></P>} />

            {/* ---------- Care ---------- */}
            <Route path="/Elders" element={<P><Elders /></P>} />
            <Route path="/AnimalsSafety" element={<P><AnimalsSafety /></P>} />
            <Route path="/Blood_donation" element={<P><Blood_donation /></P>} />
            <Route path="/Dogs_care" element={<P><Dogs_care /></P>} />
            <Route path="/TreesPlats" element={<P><TreesPlats /></P>} />

            {/* ---------- Discover ---------- */}
            <Route path="/Explore" element={<P><Explore /></P>} />
            <Route path="/Feed" element={<P><Feed /></P>} />
            <Route path="/Gallery" element={<P><Gallery /></P>} />
            <Route path="/Achievements" element={<P><Achievements /></P>} />
            <Route path="/Feedback" element={<P><Feedback /></P>} />
            <Route path="/Blogs" element={<P><Blogs /></P>} />

            {/* ---------- Account ---------- */}
            <Route path="/Profile" element={<P><Profile /></P>} />
            {/* <Route path="/Setting" element={<P><Settings /></P>} /> */}
            <Route
              path="/volunteer/profile"
              element={
                <ProtectedRoute roles={["volunteer"]}>
                  <VolunteerProfile />
                </ProtectedRoute>
              }
            />

            {/* ---------- Koi galat URL ---------- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
