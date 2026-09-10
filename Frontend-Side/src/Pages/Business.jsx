import React from "react";
import Navbar from "../Pages/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Business() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products") // 👈 backend URL
      .then((res) => {
        setBusinesses(res.data);
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
      <Navbar/>
      <div className="Business-image">
        <img style={{width:"100%",height:"3%"}}src="https://img.magnific.com/premium-vector/vibrant-market-street-scene-indian-town_1163311-2740.jpg?semt=ais_hybrid&w=740&q=80" />
      </div>

      <div style={{ padding: "20px" }}>
        <h1>🏢 Our Businesses</h1>
        <div
          className="business-card"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {businesses.map((biz) => (
            // 👇 Click karo toh /business/:id pe jayega
            <Link
              to={`/business/${biz._id}`}
              key={biz._id}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div
                style={{
                  border: "2px solid #d24545",
                  borderRadius: "10px",
                  padding: "15px",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                  backgroundColor: "#fff",
                  position: "relative",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0,0,0,0.15)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                {/* Open / Closed badge */}
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    padding: "3px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#fff",
                    backgroundColor: biz.isopen ? "seagreen" : "gray",
                  }}
                >
                  {biz.isopen ? "Open" : "Closed"}
                </span>

                {biz.image && (
                  <img
                    src={biz.image}
                    alt={biz.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}

                <h2 style={{ margin: "10px 0 5px", color: "darkcyan" }}>
                  {biz.name}
                </h2>
                <h2 style={{ color: "skyblue", fontSize: "14px" }}>
                  {biz.category}
                </h2>

                {biz.description && (
                  <p
                    style={{
                      color: "#555",
                      fontSize: "13px",
                      margin: "5px 0",
                    }}
                  >
                    {biz.description}
                  </p>
                )}

                <ul style={{ paddingLeft: "0", listStyle: "none" }}>
                  {biz.ownerName && (
                    <li>
                      <p style={{ color: "chocolate", fontSize: "14px" }}>
                        Owner: {biz.ownerName}
                      </p>
                    </li>
                  )}
                  {biz.phone && (
                    <li>
                      <p style={{ color: "gray", fontSize: "14px" }}>
                        📞 {biz.phone}
                      </p>
                    </li>
                  )}
                  {(biz.address || biz.city) && (
                    <li>
                      <p style={{ color: "gray", fontSize: "14px" }}>
                        📍 {biz.address ? `${biz.address}, ` : ""}
                        {biz.city}
                      </p>
                    </li>
                  )}
                </ul>

                {biz.rating && (
                  <p style={{ color: "firebrick", fontSize: "14px" }}>
                    ⭐ {biz.rating}{" "}
                    {biz.totalReviews ? `(${biz.totalReviews} reviews)` : ""}
                  </p>
                )}

                {biz.Pricerange && (
                  <p style={{ fontWeight: "bold", color: "#e44" }}>
                    {biz.Pricerange}
                  </p>
                )}

                {Array.isArray(biz.Services) && biz.Services.length > 0 && (
                  <p style={{ color: "#333", fontSize: "12px" }}>
                    Services: {biz.Services.join(", ")}
                  </p>
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

export default Business;
