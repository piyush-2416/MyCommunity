import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
const API_URL = "http://localhost:3000/api/community-events";// backend URL

function Events() {
  const [Events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(API_URL, { signal: controller.signal })
      .then((res) => {
        // backend kabhi [..] bhejta hai, kabhi { Events: [..] }
        const data = Array.isArray(res.data) ? res.data : res.data?.Events;
        setEvents (Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return; // component unmount / StrictMode
        console.log(err);
        setError("Events  load nahi ho paaye. Backend (localhost:3000) chal raha hai?");
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div>
      <Navbar/>
    <div className="events-header">

        <h1>📅 Events </h1>

        {error && <p style={{ color: "#d24545", marginTop: "12px" }}>{error}</p>}

        {!error && Events .length === 0 && (
          <p style={{ color: "#777", marginTop: "12px" }}>Abhi koi Events nahi hai.</p>
        )}

        {/* FIX: pehle <div1> tha (invalid tag) -> <div> */}
        <div
          className="Events-list"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {Events .map((e) => {
            // backend me spelling alag ho sakti hai (attendeces / attendees)
            const attendees = e.attendees ?? e.attendeces;
            const dateObj = e.date ? new Date(e.date) : null;
            const validDate = dateObj && !isNaN(dateObj);

            return (
              <Link
                to={`/Events /${e._id}`}
                key={e._id}
                style={{ display: "block", textDecoration: "none", color: "black" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    border: "1px solid #ddd",
                    borderLeft: "4px solid #d24545",
                    borderRadius: "8px",
                    padding: "12px 15px",
                    backgroundColor: "#fff",
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(ev) =>
                    (ev.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)")
                  }
                  onMouseLeave={(ev) => (ev.currentTarget.style.boxShadow = "none")}
                >
                  {/* Image thumbnail */}
                  {e.image ? (
                    <img
                      src={e.image}
                      alt={e.title}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "6px",
                        backgroundColor: "#eee",
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {/* Middle: main details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h3 style={{ margin: 0, color: "darkcyan" }}>{e.title}</h3>
                      {e.category && (
                        <span style={{ color: "skyblue", fontSize: "13px" }}>{e.category}</span>
                      )}
                    </div>

                    {e.description && (
                      <p
                        style={{
                          margin: "4px 0",
                          color: "#555",
                          fontSize: "13px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {e.description}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px",
                        fontSize: "12px",
                        color: "gray",
                      }}
                    >
                      {e.location && <span>📍 {e.location}</span>}
                      {validDate && <span>📆 {dateObj.toLocaleDateString()}</span>}
                      {e.time && <span>⏰ {e.time}</span>}
                      {(e.createby || e.createdBy) && <span>By: {e.createby || e.createdBy}</span>}
                    </div>
                  </div>

                  {/* Right: attendees count */}
                  {attendees !== undefined && (
                    <span
                      style={{
                        flexShrink: 0,
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#fff",
                        backgroundColor: "darkcyan",
                      }}
                    >
                      👥 {Array.isArray(attendees) ? attendees.length : attendees}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <hr />
    </div>
  );
}

export default Events;
