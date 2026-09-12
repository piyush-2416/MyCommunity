import React from "react";
import { Link } from "react-router-dom";
// import "./communityPages.css";

function Blood_donation() {
  return (
    <div
      className="cp-page"
      style={{ "--accent": "#C74B4B", "--accent-dark": "#933333", "--accent-tint": "#F5DEDE" }}
    >
      <section className="cp-hero">
        <div className="cp-hero-icon">🩸</div>
        <div className="cp-hero-text">
          <h1>Donate blood, help save a life</h1>
          <p className="cp-sub">
            When someone nearby needs blood urgently, minutes matter. Register
            once and get notified only when your blood group is needed.
          </p>
          <div className="cp-cta-row">
            <Link to="/blooddonation/register" className="cp-btn-primary">
              Register as donor
            </Link>
            <Link to="/blooddonation/requests" className="cp-link-secondary">
              See active requests
            </Link>
          </div>
        </div>
      </section>

      <div className="cp-stats">
        <div>
          <div className="cp-stat-num">57</div>
          <div className="cp-stat-label">donations made</div>
        </div>
        <div>
          <div className="cp-stat-num">140</div>
          <div className="cp-stat-label">registered donors</div>
        </div>
        <div>
          <div className="cp-stat-num">8</div>
          <div className="cp-stat-label">blood groups covered</div>
        </div>
      </div>

      <section className="cp-steps">
        <h2>How it works</h2>
        <p className="cp-steps-sub">From an urgent need to a matched donor.</p>

        <div className="cp-step">
          <div className="cp-step-num">01</div>
          <div>
            <p className="cp-step-title">Request goes out</p>
            <p className="cp-step-desc">
              Someone posts the blood group needed, quantity, and hospital.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">02</div>
          <div>
            <p className="cp-step-title">Matching donors are notified</p>
            <p className="cp-step-desc">
              Only registered donors with the matching group see the alert.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">03</div>
          <div>
            <p className="cp-step-title">A donor steps up</p>
            <p className="cp-step-desc">
              Contact details are shared directly so the donor can reach the
              hospital.
            </p>
          </div>
        </div>
      </section>

      <div className="cp-quote">
        <p>
          "My father needed O-negative at 2 AM. A neighbor two blocks away
          showed up within the hour."
        </p>
        <span className="cp-quote-by">— Resident, Block B</span>
      </div>

      <section className="cp-cta-band">
        <h2>Your blood group might be the one someone needs</h2>
        <p>Registration takes under a minute — you'll only hear from us when needed.</p>
        <Link to="/blooddonation/register" className="cp-btn-primary">
          Register now
        </Link>
      </section>
    </div>
  );
}

export default Blood_donation;
