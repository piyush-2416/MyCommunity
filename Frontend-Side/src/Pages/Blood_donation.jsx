import React from "react";
import { Link } from "react-router-dom";
// import "./communityPages.css";

function Blood_donation() {
  return (
    <div
      className="cp-page"
      style={{ "--accent": "#C23A5C", "--accent-dark": "#8C2A44", "--accent-tint": "#FBE0E6" }}
    >
      <section className="cp-hero">
        <div className="cp-hero-icon">🩸</div>
        <div className="cp-hero-text">
          <h1>Give blood, give a second chance at life</h1>
          <p className="cp-sub">
            Hospitals nearby often run short on blood exactly when someone
            needs it most. One unit from a willing neighbor can be the
            difference.
          </p>
          <div className="cp-cta-row">
            <Link to="/blooddonation/requests" className="cp-btn-primary">
              See urgent requests
            </Link>
            <Link to="/blooddonation/donate" className="cp-link-secondary">
              Register as a donor
            </Link>
          </div>
        </div>
      </section>

      <div className="cp-stats">
        <div>
          <div className="cp-stat-num">96</div>
          <div className="cp-stat-label">units donated this year</div>
        </div>
        <div>
          <div className="cp-stat-num">30+</div>
          <div className="cp-stat-label">lives directly helped</div>
        </div>
        <div>
          <div className="cp-stat-num">65</div>
          <div className="cp-stat-label">registered donors</div>
        </div>
      </div>

      <section className="cp-steps">
        <h2>How it works</h2>
        <p className="cp-steps-sub">Three steps from an urgent need to a donor showing up.</p>

        <div className="cp-step">
          <div className="cp-step-num">01</div>
          <div>
            <p className="cp-step-title">A request comes in</p>
            <p className="cp-step-desc">
              A patient, family, or hospital posts the blood group and
              quantity needed.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">02</div>
          <div>
            <p className="cp-step-title">Nearby donors are notified</p>
            <p className="cp-step-desc">
              Matching donors in the area get an alert with the hospital and
              urgency.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">03</div>
          <div>
            <p className="cp-step-title">A donor steps up</p>
            <p className="cp-step-desc">
              Someone available confirms and heads to the hospital directly.
            </p>
          </div>
        </div>
      </section>

      <div className="cp-quote">
        <p>
          "We needed O-negative at 2 AM and a donor from three streets away
          showed up within the hour."
        </p>
        <span className="cp-quote-by">— Patient's family, Block D</span>
      </div>

      <section className="cp-cta-band">
        <h2>Someone nearby needs blood today</h2>
        <p>It takes two minutes to register and be notified when it matters.</p>
        <Link to="/blooddonation/donate" className="cp-btn-primary">
          Become a donor
        </Link>
      </section>
    </div>
  );
}

export default Blood_donation;