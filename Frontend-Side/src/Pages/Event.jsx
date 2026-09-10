import React from "react";
// import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Event() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/Events") // 👈 backend URL
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div>
      {/* <Navbar/> */}
      <div style={{ padding: "20px" }}>
        <h1>📅 Events</h1>

        <div
          className="event-list"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {events.map((e) => (
            <Link
              to={`/events/${e._id}`}
              key={e._id}
              style={{ textDecoration: "none", color: "black" }}
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
                  (ev.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0,0,0,0.1)")
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <h3 style={{ margin: 0, color: "darkcyan" }}>
                      {e.title}
                    </h3>
                    {e.category && (
                      <span style={{ color: "skyblue", fontSize: "13px" }}>
                        {e.category}
                      </span>
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
                    {e.date && (
                      <span>
                        📆 {new Date(e.date).toLocaleDateString()}
                      </span>
                    )}
                    {e.time && <span>⏰ {e.time}</span>}
                    {e.createby && <span>By: {e.createby}</span>}
                  </div>
                </div>

                {/* Right: attendees count */}
                {e.attendeces !== undefined && (
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
                    👥{" "}
                    {Array.isArray(e.attendeces)
                      ? e.attendeces.length
                      : e.attendeces}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <hr />
    </div>
  );
}

export default Event;
