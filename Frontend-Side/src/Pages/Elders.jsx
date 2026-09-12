import React from "react";
import { Link } from "react-router-dom";
// import "./communityPages.css";

function Elders() {
  return (
    <div
      className="cp-page"
      style={{ "--accent": "#C4862B", "--accent-dark": "#8F611D", "--accent-tint": "#F3E4CC" }}
    >
      <section className="cp-hero">
        <div className="cp-hero-icon">🧓</div>
        <div className="cp-hero-text">
          <h1>Care, respect and support for our elders</h1>
          <p className="cp-sub">
            Many elders in our community live alone or need a little extra
            help day to day. A short visit, a grocery run, or someone to talk
            to can change their week.
          </p>
          <div className="cp-cta-row">
            <Link to="/eldercare/requests" className="cp-btn-primary">
              See who needs help
            </Link>
            <Link to="/eldercare/volunteer" className="cp-link-secondary">
              Become a volunteer
            </Link>
          </div>
        </div>
      </section>

      <div className="cp-stats">
        <div>
          <div className="cp-stat-num">42</div>
          <div className="cp-stat-label">elders supported this year</div>
        </div>
        <div>
          <div className="cp-stat-num">120+</div>
          <div className="cp-stat-label">visits logged</div>
        </div>
        <div>
          <div className="cp-stat-num">30</div>
          <div className="cp-stat-label">active volunteers</div>
        </div>
      </div>

      <section className="cp-steps">
        <h2>How it works</h2>
        <p className="cp-steps-sub">Three steps from noticing a need to actually helping.</p>

        <div className="cp-step">
          <div className="cp-step-num">01</div>
          <div>
            <p className="cp-step-title">Notice a need</p>
            <p className="cp-step-desc">
              Know an elder nearby who could use a hand — company, errands, or
              just a check-in?
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">02</div>
          <div>
            <p className="cp-step-title">Post the request</p>
            <p className="cp-step-desc">
              Share what kind of help is needed and where. It goes straight to
              nearby volunteers.
            </p>
          </div>
        </div>
        <div className="cp-step">
          <div className="cp-step-num">03</div>
          <div>
            <p className="cp-step-title">A neighbor responds</p>
            <p className="cp-step-desc">
              Someone from the community picks it up and follows through, no
              middleman needed.
            </p>
          </div>
        </div>
      </section>

      <div className="cp-quote">
        <p>
          "A ten-minute visit from a neighbor's kid is sometimes the best part
          of my week."
        </p>
        <span className="cp-quote-by">— Resident, Block C</span>
      </div>

      <section className="cp-cta-band">
        <h2>Someone nearby might need you today</h2>
        <p>It takes two minutes to sign up and start helping.</p>
        <Link to="/eldercare/volunteer" className="cp-btn-primary">
          Join as a volunteer
        </Link>
      </section>
    </div>
  );
}

export default Elders;
