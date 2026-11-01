import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import "./auth.css";

// Left side ki image (khali chhodo to gradient dikhega, image fail ho to bhi gradient rahega)
const IMAGE_URL = "LoginImage.png";

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  // Pehle se login hai to login page dikhane ki zaroorat nahi
  if (user) return <Navigate to={from} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login nahi ho paya, dobara try karo");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="au-page">
      <aside
        className="au-side"
        style={IMAGE_URL ? {width:"40rem", backgroundImage: `url(${IMAGE_URL}),  linear-gradient(135deg, #4338ca, #0f766e)` } : undefined}
      >
        {/* <Link to="/" className="au-logo">🏘️ MyCommunity</Link> */}
        {/* <div>
          <h2>Aapki society, ek hi jagah.</h2>
          <p>Notices, events, emergency madad aur padosiyon se jude raho.</p>
        </div> */}
      </aside>

      <main className="au-main">
        <form className="au-form" onSubmit={handleSubmit}>
          <div>
            <h1>Welcome back</h1>
            <p className="au-sub">Apne account mein login karo</p>
          </div>

          {error && <div role="alert" className="au-error">⚠️ {error}</div>}

          <div>
            <label htmlFor="email" className="au-label">Email</label>
            <input
              id="email" name="email" type="email" autoComplete="email" required
              value={form.email} onChange={handleChange}
              placeholder="name@example.com" className="au-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="au-label">Password</label>
            <div className="au-pass">
              <input
                id="password" name="password" type={showPass ? "text" : "password"}
                autoComplete="current-password" required
                value={form.password} onChange={handleChange}
                className="au-input"
              />
              <button
                type="button" className="au-toggle"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? "Password chhupao" : "Password dikhao"}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="au-btn" disabled={submitting}>
            {submitting ? "Login ho raha hai..." : "Login karo"}
          </button>
<Link to="/Signup" className="inline-block">
  <p className="bg-gradient-to-r from-indigo-600 hover:from-indigo-700 to-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg px-6 py-2.5 rounded-lg font-semibold text-green text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 duration-200 transform">
    Sign up kro
  </p>
</Link>
        
        </form>
      </main>
    </div>
  );
}
