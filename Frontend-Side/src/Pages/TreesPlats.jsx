import React from "react";
import { Link } from "react-router-dom";
// import "./communityPages.css";

function TreesPlants() {
  return (
    <div
      className="cp-page"
      style={{ "--accent": "#4C9A5B", "--accent-dark": "#347040", "--accent-tint": "#DCEEDF" }}
    >
      <section className="cp-hero">
        <div className="cp-hero-icon">🌱</div>
        <div className="cp-hero-text">
          <h1>Make our community greener, together</h1>
          <p className="cp-sub">
            Every tree planted here is tracked, watered, and looked after by
            the neighbor who planted it. Small patches add up to a greener
            society.
          </p>
          <div className="cp-cta-row">
            <Link to="/trees/plant" className="cp-btn-primary">
              Plant a tree
            </Link>
            <Link to="/trees/map" className="cp-link-secondary">
              See what's growing
            </Link>
          </div>
        </div>
      </section>

      <div className="cp-stats">
        <div>
          <div className="cp-stat-num">312</div>
          <div className="cp-stat-label">trees planted</div>
        </div>
        <div>
          <div className="cp-stat-num">9</div>
          <div className="cp-stat-label">green patches created</div>
        </div>
        <div>
          <div className="cp-stat-num">64</div>
          <div className="cp-stat-label">families involved</div>
        </div>
      </div>

      <section className="cp-steps">
        <h2>How it works</h2>
        <p className="cp-steps-sub">From an empty patch to a growing tree.</p>

        <div className="cp-step">
          <div className="cp-step-num">01</div>
          <div>
            <p className="cp-step-title">Pick a spot</p>
            <p className="cp-step-desc">
              Found a bare patch of soil that could use some green? Mark it.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">02</div>
          <div>
            <p className="cp-step-title">Plant together</p>
            <p className="cp-step-desc">
              Join or start a planting session — saplings and tools are
              arranged by the society.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">03</div>
          <div>
            <p className="cp-step-title">Track its growth</p>
            <p className="cp-step-desc">
              Whoever planted it gets reminders to water and check in on it.
            </p>
          </div>
        </div>
      </section>

      <div className="cp-quote">
        <p>
          "The mango sapling my daughter planted last year is taller than her
          now."
        </p>
        <span className="cp-quote-by">— Resident, Block D</span>
      </div>

      <section className="cp-cta-band">
        <h2>Got ten minutes and a bare patch of earth?</h2>
        <p>That's really all it takes to plant something that outlives us.</p>
        <Link to="/trees/plant" className="cp-btn-primary">
          Start planting
        </Link>
      </section>
    </div>
  );
}

export default TreesPlants;
