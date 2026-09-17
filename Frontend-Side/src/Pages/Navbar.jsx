import React from "react";
import Gallery from "./Gallery";
import NotificationBell from "./NotificationBell ";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <div>
      <div className="drawer">
        <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content"></div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-1"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="bg-base-200 p-4 w-80 min-h-full menu">
            {/* Sidebar content here */}
            <li>
              <h2 style={{ color: "gray" }}>Community</h2>
            </li>
            <li>
              <Link to="/Gallery">
                <b>
                  <h3>🏠 Dashboard</h3>
                </b>
              </Link>
            </li>
            <li>
              <Link to="/Gallery">
                <b>
                  <h3>👥 Members</h3>
                </b>
              </Link>
            </li>
            <li>
              <Link to="/Gallery">
                <b>
                  <h3>🤝 Volunteers</h3>
                </b>
              </Link>
            </li>{" "}
            <li>
              <Link to="/Gallery">
                <b>
                  <h3>🗳️ Polls & Voting</h3>
                </b>
              </Link>
            </li>
            <li>
              <h2 style={{ color: "gray" }}>Discover </h2>
            </li>{" "}
            <li>
              <Link to="/Gallery">
                <b>
                  <h3>🔍 Explore</h3>
                </b>
              </Link>
            </li>
            <li>
              <Link to="/Gallery">
                <b>
                  <h3>📰 Community Feed</h3>
                </b>
              </Link>
            </li>
            <li>
              <Link to="/Gallery">
                <b>
                  <h3>📸 Memories</h3>
                </b>
              </Link>
            </li>
            <li>
              <Link to="/Gallery">
                <b>
                  <h3></h3>
                </b>
              </Link>
            </li>{" "}
            <li>
              <Link to="/Gallery">
                <b>
                  <h3>🏆 Achievements</h3>
                </b>
              </Link>
            </li>
             <li>
              <Link to="/Gallery">
                <b>
                  <h3>💬 Feedback</h3>
                </b>
              </Link>
            </li>
            <li>
              
              <h2 style={{ color: "gray" }}>Account</h2>
            </li>
            <li>
              <b>
                <a>👤My Profile </a>
              </b>
            </li>{" "}
            <li>
              <b>
                <a>🔔Notification</a>
              </b>
            </li>
            <li>
              <b>
                <a> 💾 Saved</a>
              </b>
            </li>  <li>
              <b>
                <a>⚙️ Settings</a>
              </b>
            </li>
            <li>
              <b>
                <a>Logout</a>
              </b>
            </li>
            <img src="" />
          </ul>
        </div>
      </div>
      <div
        className="bg-base-100 shadow-sm navbar"
        style={{ backgroundColor: "mediumseagreen" }}
      >
        <div className="navbar-start">
          <div className="dropdown">
            <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label
                htmlFor="my-drawer-1"
                style={{ color: "mediumseagreen" }}
                className="btn drawer-button"
              >
                {" "}
                Mycommunity
              </label>
            </div>
          </div>
        </div>
        <div className="navbar-center">
          {/* <a className="text-xl btn btn-ghost"> </a> */}
        </div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />{" "}
            </svg>
          </button>

          {/* Notification bell with dropdown */}
          <NotificationBell />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
