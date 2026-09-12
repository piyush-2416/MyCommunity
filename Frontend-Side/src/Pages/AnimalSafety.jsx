import React from "react";
import { Link } from "react-router-dom";
// import "./communityPages.css";

function AnimalSafety() {
  return (
    <div
      className="cp-page"
      style={{ "--accent": "#2C8C82", "--accent-dark": "#1E625A", "--accent-tint": "#D9EEEA" }}
    >
      <section className="cp-hero">
        <div className="cp-hero-icon">🐾</div>
        <div className="cp-hero-text">
          <h1>Report, rescue and protect animals</h1>
          <p className="cp-sub">
            An injured stray, a trapped bird, or a dangerous situation for a
            pet — a quick report here gets rescuers moving faster than
            waiting on your own.
          </p>
          <div className="cp-cta-row">
            <Link to="/animalsafety/report" className="cp-btn-primary">
              Report an incident
            </Link>
            <Link to="/animalsafety/rescuers" className="cp-link-secondary">
              Become a rescuer
            </Link>
          </div>
        </div>
      </section>

      <div className="cp-stats">
        <div>
          <div className="cp-stat-num">86</div>
          <div className="cp-stat-label">animals rescued</div>
        </div>
        <div>
          <div className="cp-stat-num">18 min</div>
          <div className="cp-stat-label">average response time</div>
        </div>
        <div>
          <div className="cp-stat-num">15</div>
          <div className="cp-stat-label">trained rescuers on call</div>
        </div>
      </div>

      <section className="cp-steps">
        <h2>How it works</h2>
        <p className="cp-steps-sub">From spotting trouble to an animal being safe.</p>

        <div className="cp-step">
          <div className="cp-step-num">01</div>
          <div>
            <p className="cp-step-title">Spot an animal in distress</p>
            <p className="cp-step-desc">
              Injured, trapped, or in danger — note where exactly you saw it.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">02</div>
          <div>
            <p className="cp-step-title">Report the location</p>
            <p className="cp-step-desc">
              Add a photo if you can. The nearest rescuer gets notified
              immediately.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">03</div>
          <div>
            <p className="cp-step-title">Rescuer steps in</p>
            <p className="cp-step-desc">
              A trained community rescuer handles it safely, and the case gets
              closed once resolved.
            </p>
          </div>
        </div>
      </section>

      <div className="cp-quote">
        <p>
          "We found the kitten stuck in the drain within the hour, thanks to
          someone flagging it here."
        </p>
        <span className="cp-quote-by">— Volunteer rescuer, Block A</span>
      </div>

      <section className="cp-cta-band">
        <h2>Seen an animal that needs help?</h2>
        <p>Every report reaches a rescuer near you, right away.</p>
        <Link to="/animalsafety/report" className="cp-btn-primary">
          Report now
        </Link>
      </section>
    </div>
  );
}

export default AnimalSafety;
