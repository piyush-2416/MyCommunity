import React from "react";
import { Link } from "react-router-dom";
// import "./communityPages.css";

function Dogs_care() {
  return (
    <div
      className="cp-page"
      style={{ "--accent": "#3E7CB1", "--accent-dark": "#2A5A82", "--accent-tint": "#DCE8F2" }}
    >
      <section className="cp-hero">
        <div className="cp-hero-icon">🐶</div>
        <div className="cp-hero-text">
          <h1>Adopt, report and care for community dogs</h1>
          <p className="cp-sub">
            Our society's strays are looked after by residents who feed them,
            get them vaccinated, and help find them homes when they can.
          </p>
          <div className="cp-cta-row">
            <Link to="/dogs/directory" className="cp-btn-primary">
              Meet the dogs
            </Link>
            <Link to="/dogs/report" className="cp-link-secondary">
              Report a concern
            </Link>
          </div>
        </div>
      </section>

      <div className="cp-stats">
        <div>
          <div className="cp-stat-num">23</div>
          <div className="cp-stat-label">dogs known and cared for</div>
        </div>
        <div>
          <div className="cp-stat-num">11</div>
          <div className="cp-stat-label">adopted this year</div>
        </div>
        <div>
          <div className="cp-stat-num">19</div>
          <div className="cp-stat-label">vaccinated & sterilized</div>
        </div>
      </div>

      <section className="cp-steps">
        <h2>How it works</h2>
        <p className="cp-steps-sub">From meeting a dog to it being cared for by the community.</p>

        <div className="cp-step">
          <div className="cp-step-num">01</div>
          <div>
            <p className="cp-step-title">Meet the dogs</p>
            <p className="cp-step-desc">
              Browse the directory of dogs in the society, with names, photos,
              and their usual spot.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">02</div>
          <div>
            <p className="cp-step-title">Report a concern</p>
            <p className="cp-step-desc">
              Sick, injured, or a safety issue involving a dog — flag it so
              caretakers know.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">03</div>
          <div>
            <p className="cp-step-title">Community responds</p>
            <p className="cp-step-desc">
              Volunteers arrange food, vet visits, or adoption when it's the
              right fit.
            </p>
          </div>
        </div>
      </section>

      <div className="cp-quote">
        <p>
          "Bruno used to hide from everyone. Now half the building waves at
          him on their morning walk."
        </p>
        <span className="cp-quote-by">— Volunteer caretaker, Block C</span>
      </div>

      <section className="cp-cta-band">
        <h2>Want to help look after our dogs?</h2>
        <p>Whether it's feeding, a vet visit, or an adoption — every bit helps.</p>
        <Link to="/dogs/directory" className="cp-btn-primary">
          Meet the dogs
        </Link>
      </section>
    </div>
  );
}

export default Dogs_care;
