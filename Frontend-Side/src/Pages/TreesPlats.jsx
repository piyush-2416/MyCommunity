import React from "react";
import { Link } from "react-router-dom";
// import "./communityPages.css";

function TreesPlants() {
  return (
    <div
      className="cp-page"
      style={{ "--accent": "#3E8E5B", "--accent-dark": "#295F3D", "--accent-tint": "#DFF0E4" }}
    >
      <section className="cp-hero">
        <div className="cp-hero-icon">🌱</div>
        <div className="cp-hero-text">
          <h1>Make our community greener, together</h1>
          <p className="cp-sub">
            Empty patches of land and bare streets are chances waiting to
            happen. Every drive, however small, adds up to a cleaner,
            cooler neighborhood.
          </p>
          <div className="cp-cta-row">
            <Link to="/treesplants/drives" className="cp-btn-primary">
              See planting drives
            </Link>
            <Link to="/treesplants/volunteer" className="cp-link-secondary">
              Volunteer for a drive
            </Link>
          </div>
        </div>
      </section>

      <div className="cp-stats">
        <div>
          <div className="cp-stat-num">500+</div>
          <div className="cp-stat-label">trees planted</div>
        </div>
        <div>
          <div className="cp-stat-num">12</div>
          <div className="cp-stat-label">green drives run</div>
        </div>
        <div>
          <div className="cp-stat-num">300+</div>
          <div className="cp-stat-label">volunteers involved</div>
        </div>
      </div>

      <section className="cp-steps">
        <h2>How it works</h2>
        <p className="cp-steps-sub">Three steps from an idle patch of land to a growing tree.</p>

        <div className="cp-step">
          <div className="cp-step-num">01</div>
          <div>
            <p className="cp-step-title">Pick a spot</p>
            <p className="cp-step-desc">
              A bare patch, a park corner, or a stretch of road that could
              use some green.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">02</div>
          <div>
            <p className="cp-step-title">Join or organize a drive</p>
            <p className="cp-step-desc">
              Sign up for an upcoming plantation drive, or start one for
              your area.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">03</div>
          <div>
            <p className="cp-step-title">Track it growing</p>
            <p className="cp-step-desc">
              Volunteers keep watering and maintenance going long after
              planting day.
            </p>
          </div>
        </div>
      </section>

      <div className="cp-quote">
        <p>
          "We planted twelve saplings on a Sunday morning. Three years on,
          they're taller than us."
        </p>
        <span className="cp-quote-by">— Volunteer, City Park Drive</span>
      </div>

      <section className="cp-cta-band">
        <h2>The next drive needs hands like yours</h2>
        <p>It takes two minutes to sign up and start helping.</p>
        <Link to="/treesplants/volunteer" className="cp-btn-primary">
          Join a drive
        </Link>
      </section>
    </div>
  );
}

export default TreesPlants;
