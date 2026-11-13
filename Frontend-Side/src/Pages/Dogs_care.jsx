import React from "react";
import { Link } from "react-router-dom";
// import "./communityPages.css";

function Dogs_care() {
  return (
    <div
      className="cp-page"
      style={{ "--accent": "#2E8B84", "--accent-dark": "#1F615C", "--accent-tint": "#DCEFED" }}
    >
      <section className="cp-hero">
        <div className="cp-hero-icon">🐕</div>
        <div className="cp-hero-text">
          <h1>Adopt, feed and care for community dogs</h1>
          <p className="cp-sub">
            The dogs around our streets and parks depend on people who
            notice them. A regular feeding round or a single adoption
            changes a life.
          </p>
          <div className="cp-cta-row">
            <Link to="/dogscare/reports" className="cp-btn-primary">
              See dogs needing care
            </Link>
            <Link to="/dogscare/volunteer" className="cp-link-secondary">
              Start feeding a dog
            </Link>
          </div>
        </div>
      </section>

      <div className="cp-stats">
        <div>
          <div className="cp-stat-num">18</div>
          <div className="cp-stat-label">dogs adopted this year</div>
        </div>
        <div>
          <div className="cp-stat-num">200+</div>
          <div className="cp-stat-label">meals served monthly</div>
        </div>
        <div>
          <div className="cp-stat-num">25</div>
          <div className="cp-stat-label">active caretakers</div>
        </div>
      </div>

      <section className="cp-steps">
        <h2>How it works</h2>
        <p className="cp-steps-sub">Three steps from noticing a dog in need to it being cared for.</p>

        <div className="cp-step">
          <div className="cp-step-num">01</div>
          <div>
            <p className="cp-step-title">Notice a dog in need</p>
            <p className="cp-step-desc">
              Hungry, injured, or a litter of puppies nearby — note where
              you saw them.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">02</div>
          <div>
            <p className="cp-step-title">Report or start a feeding round</p>
            <p className="cp-step-desc">
              Post it, or add the spot to an existing feeding round in the
              area.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">03</div>
          <div>
            <p className="cp-step-title">A caretaker steps in</p>
            <p className="cp-step-desc">
              Regular feeding, vet care, or a full adoption — whatever the
              dog needs next.
            </p>
          </div>
        </div>
      </section>

      <div className="cp-quote">
        <p>
          "We started feeding one stray outside our gate. Two years later
          she's the whole street's dog."
        </p>
        <span className="cp-quote-by">— Resident, Park Road</span>
      </div>

      <section className="cp-cta-band">
        <h2>A dog nearby might need you today</h2>
        <p>It takes two minutes to sign up and start helping.</p>
        <Link to="/dogscare/volunteer" className="cp-btn-primary">
          Join as a caretaker
        </Link>
      </section>
    </div>
  );
}

export default Dogs_care;