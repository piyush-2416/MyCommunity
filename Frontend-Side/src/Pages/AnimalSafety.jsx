import React from "react";
import { Link } from "react-router-dom";
// import "./communityPages.css";

function AnimalSafety() {
  return (
    <div
      className="cp-page"
      style={{ "--accent": "#CC6B3F", "--accent-dark": "#8F4A2B", "--accent-tint": "#F6E1D4" }}
    >
      <section className="cp-hero">
        <div className="cp-hero-icon">🐾</div>
        <div className="cp-hero-text">
          <h1>Report, rescue and protect animals in need</h1>
          <p className="cp-sub">
            Injured strays, abandoned pets, and animals in danger often go
            unnoticed until someone nearby steps in. A quick report can
            connect them to a rescuer within minutes.
          </p>
          <div className="cp-cta-row">
            <Link to="/animalsafety/reports" className="cp-btn-primary">
              See animals needing help
            </Link>
            <Link to="/animalsafety/volunteer" className="cp-link-secondary">
              Become a rescuer
            </Link>
          </div>
        </div>
      </section>

      <div className="cp-stats">
        <div>
          <div className="cp-stat-num">87</div>
          <div className="cp-stat-label">animals rescued this year</div>
        </div>
        <div>
          <div className="cp-stat-num">45+</div>
          <div className="cp-stat-label">reports resolved</div>
        </div>
        <div>
          <div className="cp-stat-num">20</div>
          <div className="cp-stat-label">active rescuers</div>
        </div>
      </div>

      <section className="cp-steps">
        <h2>How it works</h2>
        <p className="cp-steps-sub">Three steps from spotting an animal in distress to getting it help.</p>

        <div className="cp-step">
          <div className="cp-step-num">01</div>
          <div>
            <p className="cp-step-title">Spot an animal in distress</p>
            <p className="cp-step-desc">
              Injured, abandoned, or stuck somewhere it shouldn't be — note
              the exact location.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">02</div>
          <div>
            <p className="cp-step-title">Report the location</p>
            <p className="cp-step-desc">
              Share a photo and location. It goes straight to nearby
              rescuers and shelters.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">03</div>
          <div>
            <p className="cp-step-title">A rescuer responds</p>
            <p className="cp-step-desc">
              Someone from the community picks it up — rescue, treatment, or
              a foster home.
            </p>
          </div>
        </div>
      </section>

      <div className="cp-quote">
        <p>
          "I reported an injured dog on my way to work and by evening it was
          already at the vet."
        </p>
        <span className="cp-quote-by">— Resident, Sector 12</span>
      </div>

      <section className="cp-cta-band">
        <h2>An animal nearby might need you today</h2>
        <p>It takes two minutes to sign up and start helping.</p>
        <Link to="/animalsafety/volunteer" className="cp-btn-primary">
          Join as a rescuer
        </Link>
      </section>
    </div>
  );
}

export default AnimalSafety;
