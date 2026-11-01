import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import "./auth.css";

const IMAGE_URL = "Signup.png";

const ROLES = [
  { id: "user", icon: "🏠", title: "Resident", desc: "Society ka member" },
  { id: "volunteer", icon: "🤝", title: "Volunteer", desc: "Directory mein listed" },
];

export default function Signup() {
  const { user, loading, signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "", role: "user", inviteCode: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      return setError("Password kam se kam 8 characters ka ho, usme letter aur number dono hon");
    }
    if (form.password !== form.confirm) {
      return setError("Dono password same hone chahiye");
    }
    if (form.role === "volunteer" && !form.inviteCode.trim()) {
      return setError("Volunteer invite code daalo");
    }

    setSubmitting(true);
    try {
      const u = await signup(
        form.name.trim(),
        form.email.trim(),
        form.password,
        form.phone,
        form.role,
        form.role === "volunteer" ? form.inviteCode.trim() : ""
      );
      // Volunteer ko seedha Directory profile bharne bhejo
      navigate(u.role === "volunteer" ? "/volunteer/profile" : "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Signup nahi ho paya, dobara try karo");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="au-page">
      <aside
        className="au-side"
        style={IMAGE_URL ? {width:"35rem", backgroundImage: `url(${IMAGE_URL}),  linear-gradient(135deg, #4338ca, #0f766e)` } : undefined}
    >
        {/* <Link to="/" className="au-logo">🏘️ MyCommunity</Link>
        <div>
          <h2>Apni society se jud jao.</h2>
          <p>Resident ban ke events, notices aur emergency madad pao, ya volunteer ban ke Directory mein judo.</p>
        </div> */}
      </aside>

      <main className="au-main">
        <form className="au-form" onSubmit={handleSubmit}>
          <div>
            <h1>Account banao</h1>
            <p className="au-sub">Kuch hi seconds mein shuru karo</p>
          </div>

          {error && <div role="alert" className="au-error">⚠️ {error}</div>}

          {/* Role chuno */}
          <div>
            <span className="au-label">Main hoon</span>
            <div className="au-roles">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  aria-pressed={form.role === r.id}
                  onClick={() => setForm({ ...form, role: r.id })}
                  className={`au-role ${form.role === r.id ? "on" : ""}`}
                >
                  <span aria-hidden="true">{r.icon}</span>
                  <b>{r.title}</b>
                  <small>{r.desc}</small>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="au-label">Naam</label>
            <input
              id="name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={60}
              value={form.name} onChange={handleChange} placeholder="Aapka poora naam" className="au-input"
            />
          </div>

          <div>
            <label htmlFor="email" className="au-label">Email</label>
            <input
              id="email" name="email" type="email" autoComplete="email" required
              value={form.email} onChange={handleChange} placeholder="name@example.com" className="au-input"
            />
          </div>

          <div>
            <label htmlFor="phone" className="au-label">
              Mobile number {form.role === "volunteer" ? "" : "(optional)"}
            </label>
            <input
              id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" maxLength={15}
              value={form.phone} onChange={handleChange} placeholder="10 digit number" className="au-input"
            />
          </div>

          {form.role === "volunteer" && (
            <div>
              <label htmlFor="inviteCode" className="au-label">Volunteer invite code</label>
              <input
                id="inviteCode" name="inviteCode" type="password" autoComplete="off"
                value={form.inviteCode} onChange={handleChange} className="au-input"
              />
              <p className="au-hint">Ye code aapko society committee se milega</p>
            </div>
          )}

          <div>
            <label htmlFor="password" className="au-label">Password</label>
            <div className="au-pass">
              <input
                id="password" name="password" type={showPass ? "text" : "password"}
                autoComplete="new-password" required maxLength={72}
                value={form.password} onChange={handleChange} className="au-input"
              />
              <button
                type="button" className="au-toggle"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? "Password chhupao" : "Password dikhao"}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            <p className="au-hint">Kam se kam 8 characters, letter aur number dono</p>
          </div>

          <div>
            <label htmlFor="confirm" className="au-label">Password dobara</label>
            <input
              id="confirm" name="confirm" type={showPass ? "text" : "password"}
              autoComplete="new-password" required maxLength={72}
              value={form.confirm} onChange={handleChange} className="au-input"
            />
          </div>

          <button type="submit" className="au-btn" disabled={submitting}>
            {submitting ? "Account ban raha hai..." : "Sign up karo"}
          </button>

          <p className="au-foot">
            Pehle se account hai? <Link to="/login">Login karo</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
