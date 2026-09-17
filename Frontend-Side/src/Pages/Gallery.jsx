import React from "react";
// import Navbar from "../Components/Navbar";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
// import "./gallery.css";

const API_BASE = "http://localhost:3000";

function getUserId() {
  let id = localStorage.getItem("society_user_id");
  if (!id) {
    id = "user_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("society_user_id", id);
  }
  return id;
}

function Lightbox({ item, imageIndex, onClose, onNav, onLike, liked }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNav]);

  return (
    <div className="gal-lightbox" onClick={onClose}>
      <button className="gal-lightbox-close" onClick={onClose} aria-label="Close">
        ✕
      </button>

      {item.images.length > 1 && (
        <>
          <button
            className="gal-lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            className="gal-lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            aria-label="Next"
          >
            ›
          </button>
        </>
      )}

      <div className="gal-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={item.images[imageIndex]} alt={item.eventName} />
        <div className="gal-lightbox-meta">
          <div className="gal-lightbox-info">
            <h3>{item.eventName}</h3>
            <span>
              {item.uploadedByName} ·{" "}
              {new Date(item.uploadedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="gal-lightbox-actions">
            <button
              className={`gal-lightbox-like ${liked ? "liked" : ""}`}
              onClick={() => onLike(item)}
            >
              {liked ? "♥" : "♡"} {item.likes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("recent"); // recent | liked
  const [lightbox, setLightbox] = useState(null); // { item, index }
  const userId = getUserId();

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/Society_Gallery`)
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleLike = async (item) => {
    try {
      const res = await axios.post(`${API_BASE}/api/gallery/${item._id}/like`, {
        userId,
      });
      setItems((prev) => prev.map((i) => (i._id === item._id ? res.data : i)));
      setLightbox((prev) =>
        prev && prev.item._id === item._id ? { ...prev, item: res.data } : prev
      );
    } catch (err) {
      console.log(err);
    }
  };

  const isLiked = (item) =>
    Array.isArray(item.likedBy) && item.likedBy.includes(userId);

  // Group items by event
  const grouped = useMemo(() => {
    let sorted = [...items];
    if (tab === "liked") {
      sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      sorted.sort(
        (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );
    }

    const groups = {};
    const order = [];
    sorted.forEach((item) => {
      if (!groups[item.eventName]) {
        groups[item.eventName] = [];
        order.push(item.eventName);
      }
      groups[item.eventName].push(item);
    });

    return order.map((name) => ({ eventName: name, items: groups[name] }));
  }, [items, tab]);

  const heroImages = useMemo(() => {
    const all = items.flatMap((i) => i.images);
    return all.slice(0, 3);
  }, [items]);

  const openLightbox = (item, index) => setLightbox({ item, index });

  const navLightbox = (dir) => {
    setLightbox((prev) => {
      if (!prev) return prev;
      const total = prev.item.images.length;
      const next = (prev.index + dir + total) % total;
      return { ...prev, index: next };
    });
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="gal-page">
      {/* <Navbar/> */}
      <section className="gal-hero">
        <div className="gal-mosaic">
          {heroImages.map((src, i) => (
            <img key={i} src={src} alt="" />
          ))}
        </div>
        <div className="gal-hero-text">
          <h1>Moments from our community</h1>
          <p>
            Photos from events, drives, and everyday life around the society
            — shared by the neighbors who were there.
          </p>
        </div>
      </section>

      <div className="gal-tabs">
        <button
          className={`gal-tab ${tab === "recent" ? "active" : ""}`}
          onClick={() => setTab("recent")}
        >
          Recent
        </button>
        <button
          className={`gal-tab ${tab === "liked" ? "active" : ""}`}
          onClick={() => setTab("liked")}
        >
          Most liked
        </button>
      </div>

      {grouped.length === 0 && (
        <p style={{ textAlign: "center", color: "gray" }}>
          Abhi koi photo upload nahi hui hai.
        </p>
      )}

      {grouped.map((group) => (
        <div className="gal-group" key={group.eventName}>
          <div className="gal-group-header">
            <h2>{group.eventName}</h2>
            <span>{group.items.length} upload{group.items.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="gal-grid">
            {group.items.map((item) => (
              <div
                className="gal-tile"
                key={item._id}
                onClick={() => openLightbox(item, 0)}
              >
                <img src={item.images[0]} alt={item.eventName} />
                {item.images.length > 1 && (
                  <span className="gal-tile-count">+{item.images.length - 1}</span>
                )}
                <div className="gal-tile-overlay">
                  <span className="gal-tile-name">{item.uploadedByName}</span>
                  <button
                    className={`gal-tile-like ${isLiked(item) ? "liked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(item);
                    }}
                  >
                    {isLiked(item) ? "♥" : "♡"} {item.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {lightbox && (
        <Lightbox
          item={lightbox.item}
          imageIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          onNav={navLightbox}
          onLike={handleLike}
          liked={isLiked(lightbox.item)}
        />
      )}
    </div>
  );
}

export default Gallery;
