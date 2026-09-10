 import React from "react";
// import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Status ke hisaab se badge color
const statusColors = {
  pending: "goldenrod",
  "in-progress": "steelblue",
  resolved: "seagreen",
  rejected: "firebrick",
};

function Complain() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/Complains") // 👈 backend URL
      .then((res) => {
        setComplaints(res.data);
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
        <h1>📋 Complaints</h1>

        <div
          className="complaint-list"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {complaints.map((c) => (
            <Link
              to={`/complaints/${c._id}`}
              key={c._id}
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0,0,0,0.1)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                {/* Photo thumbnail */}
                {c.photo ? (
                  <img
                    src={c.photo}
                    alt={c.title}
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

                {/* Middle: main details, grows to fill space */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <h3 style={{ margin: 0, color: "darkcyan" }}>
                      {c.title}
                    </h3>
                    {c.type && (
                      <span style={{ color: "skyblue", fontSize: "13px" }}>
                        {c.type}
                      </span>
                    )}
                  </div>

                  {c.description && (
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
                      {c.description}
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
                    {c.location && <span>📍 {c.location}</span>}
                    {c.raiseby && <span>Raised by: {c.raiseby}</span>}
                    {c.createAt && (
                      <span>
                        🕒 {new Date(c.createAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: status badge */}
                {c.status && (
                  <span
                    style={{
                      flexShrink: 0,
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#fff",
                      backgroundColor:
                        statusColors[String(c.status).toLowerCase()] || "gray",
                      textTransform: "capitalize",
                    }}
                  >
                    {c.status}
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

export default Complain;
