import React from "react";
// import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// Status ke hisaab se badge color
const statusColors = {
  pending: "goldenrod",
  claimed: "seagreen",
  closed: "gray",
};

// Type (Lost / Found) ke hisaab se badge color
const typeColors = {
  lost: "firebrick",
  found: "seagreen",
};

function Lost_Found() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/Lost_Found-data") // 👈 backend URL
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);   
      });
  }, []);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div> <div2
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
        <div1 className="navbar-center">
          {/* <a className="text-xl btn btn-ghost"> </a> */}
        </div1>
        <div1 className="navbar-end">

           <button className="btn btn-ghost btn-circle">
         ➕
          </button>
      
        </div1>
      </div2>
      {/* <Navbar/> */}
      <div style={{ padding: "20px" }}>
        <h1>🔎 Lost & Found</h1>

        <div
          className="lostfound-list"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {items.map((item) => (
            <Link
              to={`/lostfound/${item._id}`}
              key={item._id}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  border: "1px solid #ddd",
                  borderLeft: `4px solid ${
                    typeColors[String(item.type).toLowerCase()] || "#d24545"
                  }`,
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
                {/* Image thumbnail */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.itemname}
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
                    {item.type && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          color: "#fff",
                          backgroundColor:
                            typeColors[String(item.type).toLowerCase()] ||
                            "gray",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.type}
                      </span>
                    )}
                    <h3 style={{ margin: 0, color: "darkcyan" }}>
                      {item.itemname}
                    </h3>
                    {item.category && (
                      <span style={{ color: "skyblue", fontSize: "13px" }}>
                        {item.category}
                      </span>
                    )}
                  </div>

                  {item.description && (
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
                      {item.description}
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
                    {item.location && <span>📍 {item.location}</span>}
                    {item.contactpersonname && (
                      <span>Contact: {item.contactpersonname}</span>
                    )}
                    {item.contactphone && <span>📞 {item.contactphone}</span>}
                    {item.datereported && (
                      <span>
                        🕒 {new Date(item.datereported).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: status badge */}
                {item.status && (
                  <span
                    style={{
                      flexShrink: 0,
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#fff",
                      backgroundColor:
                        statusColors[String(item.status).toLowerCase()] ||
                        "gray",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.status}
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

export default Lost_Found;
