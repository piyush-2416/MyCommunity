import React from "react";
import "./App.css";
import "./index.css";
function App() {
  return (
    <>
      {/* //Navbar Section  */}
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
              <b>
                {" "}
                <a> Notice</a>
              </b>
            </li>
            <li>
              <b>
                <a>Complains</a>
              </b>
            </li>
            <li>
              <b>
                <a>Events </a>
              </b>
            </li>{" "}
            <li>
              <b>
                <a>Emergency Help</a>
              </b>
            </li>
            <li>
              <h2 style={{ color: "gray" }}>Business & service </h2>
            </li>{" "}
            <li>
              <b>
                {" "}
                <a>Business</a>
              </b>
            </li>
            <li>
              <b>
                <a> Service</a>
              </b>
            </li>{" "}
            <li>
              <h2 style={{ color: "gray" }}>Account</h2>
            </li>
            <li>
              <b>
                <a>My Profile </a>
              </b>
            </li>{" "}
            <li>
              <b>
                <a>Notification</a>
              </b>
            </li>
            <li>
              <b>
                <a> Setting</a>
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
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />{" "}
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Main image section */}
      <div className="Main-image">
        <img src="" alt="" />
      </div>

      <div className="Quick-action-sec">
        <h2>Quick-Action</h2>{" "}
        <ul>
          <li>
            🚨
            <br />
            Raise Complains
          </li>
          <li>
            📝
            <br />
            View Notices
          </li>
          <li>
            📆
            <br />
            Upcomming Events
          </li>
          <li>
            🆘
            <br />
            Emergency Help
          </li>
          <li>
            🛒
            <br />
            Shopping
          </li>
        </ul>
      </div>
      <br />
      <hr />
      <div className="Quick-action-sec">
        <h2>Popular-Service</h2>{" "}
        <ul>
          <li>
            🩺
            <br />
            Doctor
          </li>
          <li>
            🏋️
            <br />
            Gym
          </li>
          <li>
            📚
            <br />
            Tutor
          </li>
          <li>
            💇‍♀️
            <br />
            Salon
          </li>
          <li>
            🏪
            <br />
            Grocery
          </li>
        </ul>
        
        <div className="Business-sec">
          <ul>
            <li>
              <img src="https://img.freepik.com/premium-vector/poster-gym-with-gym-gym-with-gym-background_1092808-11549.jpg?w=2000 "></img>
              <a>🏋️Gym</a>
              <h4>Fitness Center</h4>
            </li>
            <li>
              <img src="https://img.freepik.com/premium-vector/supermarket-store-vector-illustration-flat-street-with-people-character-near-city-shop-retail-sale-cartoon-mall-customer_109722-4796.jpg?w=2000 "></img>
              <a>🥦Grocery</a>
              <h4>Grocery center</h4>
            </li>
            <li>
              <img src=" https://cdn.vectorstock.com/i/1000v/87/00/barbershop-customers-barber-working-cut-hair-vector-51438700.jpg"></img>
              <a>Salon</a>
              <h4>Hairs cutting</h4>
            </li>
            <li>
              <img src="https://tse2.mm.bing.net/th/id/OIP.H7JSuiPNPSWFAWsizdf8gAHaFx?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"></img>
              <a>Tutor</a>
              <h4>Coaching center</h4>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
