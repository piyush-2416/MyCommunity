import React from "react";
// import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Notice() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/Notice") // 👈 backend URL
      .then((res) => {
        setNotices(res.data);
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
        <h1>📢 Notices</h1>

        <div
          className="notice-list"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {notices.map((n) => {
            const important = n.isimportant === true || n.isimportant === "true";

            return (
              <Link
                to={`/notices/${n._id}`}
                key={n._id}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    border: "1px solid #ddd",
                    borderLeft: `4px solid ${important ? "#e44" : "#d24545"}`,
                    borderRadius: "8px",
                    padding: "12px 15px",
                    backgroundColor: important ? "#fff8f6" : "#fff",
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 2px 10px rgba(0,0,0,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  {/* Middle: main details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {important && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "#fff",
                            backgroundColor: "#e44",
                            padding: "2px 8px",
                            borderRadius: "10px",
                          }}
                        >
                          IMPORTANT
                        </span>
                      )}
                      <h3 style={{ margin: 0, color: "darkcyan" }}>
                        {n.title}
                      </h3>
                      {n.category && (
                        <span style={{ color: "skyblue", fontSize: "13px" }}>
                          {n.category}
                        </span>
                      )}
                    </div>

                    {n.description && (
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
                        {n.description}
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
                      {n.createBy && <span>By: {n.createBy}</span>}
                      {n.date && (
                        <span>📆 {new Date(n.date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
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

export default Notice;
