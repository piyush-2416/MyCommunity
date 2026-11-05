import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000";

function getUserId() {
  let id = localStorage.getItem("society_user_id");

  if (!id) {
    id = "user_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("society_user_id", id);
  }

  return id;
}

const galleryCSS = `
.gal-page {
  min-height: 100vh;
  padding: 30px clamp(14px, 4vw, 55px) 70px;
  background:
    radial-gradient(circle at 1px 1px, rgba(46,139,87,.10) 1.2px, transparent 0) 0 0/24px 24px,
    linear-gradient(180deg, #e9f7ee 0%, #f5faf6 45%, #ffffff 100%);
  color: #173d2b;
  font-family: "Segoe UI", system-ui, sans-serif;
}

.gal-container {
  max-width: 1250px;
  margin: auto;
}

/* HERO */

.gal-hero {
  position: relative;
  min-height: 320px;
  overflow: hidden;
  display: flex;
  align-items: center;
  border-radius: 28px;
  padding: clamp(25px, 5vw, 60px);
  background: linear-gradient(120deg, #145c38, #238653 60%, #42a875);
  box-shadow: 0 15px 35px rgba(24, 100, 59, .18);
  margin-bottom: 32px;
}

.gal-hero::before {
  content: "";
  position: absolute;
  width: 350px;
  height: 350px;
  border: 55px solid rgba(255,255,255,.07);
  border-radius: 50%;
  right: -90px;
  top: -140px;
}

.gal-hero-text {
  position: relative;
  z-index: 2;
  max-width: 570px;
  color: white;
}

.gal-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: rgba(255,255,255,.15);
  border: 1px solid rgba(255,255,255,.25);
  border-radius: 30px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.gal-hero-text h1 {
  font-size: clamp(30px, 5vw, 48px);
  line-height: 1.15;
  margin: 20px 0 12px;
  color: white;
  letter-spacing: -1.5px;
}

.gal-hero-text p {
  max-width: 470px;
  color: rgba(255,255,255,.85);
  line-height: 1.8;
  font-size: 15px;
  margin: 0;
}

.gal-hero-icon {
  position: absolute;
  right: 9%;
  font-size: clamp(100px, 17vw, 180px);
  opacity: .18;
  transform: rotate(-12deg);
}

/* SECTION HEADING */

.gal-section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin: 32px 0 20px;
}

.gal-section-heading h2 {
  font-size: 25px;
  margin: 0;
  color: #174b30;
}

.gal-section-heading p {
  margin: 5px 0 0;
  color: #789083;
  font-size: 13px;
}

/* TABS */

.gal-tabs {
  display: flex;
  gap: 9px;
  background: #e5f2e9;
  border: 1px solid #d5e9dc;
  padding: 6px;
  width: fit-content;
  border-radius: 14px;
  margin-bottom: 30px;
}

.gal-tab {
  border: none;
  background: transparent;
  color: #587666;
  padding: 11px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: .2s;
}

.gal-tab:hover {
  color: #176b3b;
}

.gal-tab.active {
  background: #27864e;
  color: white;
  box-shadow: 0 4px 12px rgba(39,134,78,.2);
}

/* GROUP */

.gal-group {
  margin-bottom: 42px;
}

.gal-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 17px;
}

.gal-group-header h2 {
  margin: 0;
  font-size: 21px;
  color: #194b31;
}

.gal-group-header span {
  color: #388355;
  background: #e5f5e9;
  padding: 7px 13px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 700;
}

/* GRID */

.gal-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.gal-tile {
  position: relative;
  height: 260px;
  border-radius: 19px;
  overflow: hidden;
  cursor: pointer;
  background: #dcece1;
  box-shadow: 0 5px 16px rgba(26,70,43,.09);
  transition: transform .3s, box-shadow .3s;
}

.gal-tile:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 25px rgba(26,70,43,.17);
}

.gal-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .5s;
}

.gal-tile:hover img {
  transform: scale(1.07);
}

.gal-tile::after {
  content: "";
  position: absolute;
  inset: 35% 0 0;
  background: linear-gradient(transparent, rgba(10,40,23,.8));
  pointer-events: none;
}

.gal-tile-count {
  position: absolute;
  top: 13px;
  right: 13px;
  z-index: 2;
  background: rgba(255,255,255,.93);
  color: #236a3e;
  padding: 7px 11px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 800;
}

.gal-tile-overlay {
  position: absolute;
  z-index: 2;
  bottom: 13px;
  left: 13px;
  right: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.gal-tile-name {
  color: white;
  font-size: 13px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gal-tile-like {
  border: 0;
  background: rgba(255,255,255,.94);
  color: #376c4b;
  padding: 8px 12px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  flex-shrink: 0;
  transition: .2s;
}

.gal-tile-like:hover {
  background: white;
  transform: scale(1.06);
}

.gal-tile-like.liked {
  color: #e04458;
}

/* EMPTY */

.gal-empty {
  text-align: center;
  padding: 65px 20px;
  background: rgba(255,255,255,.8);
  border: 2px dashed #cce4d3;
  border-radius: 22px;
}

.gal-empty-icon {
  font-size: 55px;
  margin-bottom: 12px;
}

.gal-empty h3 {
  margin: 0 0 8px;
  color: #24603c;
}

.gal-empty p {
  margin: 0;
  color: #789083;
  font-size: 14px;
}

/* LIGHTBOX */

.gal-lightbox {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(5, 25, 15, .94);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(8px);
}

.gal-lightbox-content {
  width: min(850px, 100%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gal-lightbox-content > img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 15px;
}

.gal-lightbox-close {
  position: absolute;
  top: 22px;
  right: 25px;
  border: none;
  background: rgba(255,255,255,.15);
  color: white;
  width: 43px;
  height: 43px;
  border-radius: 50%;
  font-size: 22px;
  cursor: pointer;
}

.gal-lightbox-nav {
  position: absolute;
  top: 45%;
  border: 1px solid rgba(255,255,255,.25);
  background: rgba(255,255,255,.15);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 32px;
  cursor: pointer;
}

.gal-lightbox-nav.prev {
  left: 25px;
}

.gal-lightbox-nav.next {
  right: 25px;
}

.gal-lightbox-meta {
  width: min(700px, 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 17px 5px;
  color: white;
}

.gal-lightbox-info h3 {
  margin: 0 0 5px;
  font-size: 19px;
}

.gal-lightbox-info span {
  font-size: 12px;
  color: #b8d5c1;
}

.gal-lightbox-like {
  background: #e9f7ee;
  color: #287447;
  border: none;
  border-radius: 30px;
  padding: 11px 17px;
  cursor: pointer;
  font-weight: 800;
}

.gal-lightbox-like.liked {
  color: #e04458;
}

.gal-loading {
  text-align: center;
  padding: 100px 15px;
  color: #287447;
  font-weight: 700;
}

/* RESPONSIVE */

@media(max-width:850px) {
  .gal-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gal-tile {
    height: 230px;
  }

  .gal-hero-icon {
    right: 3%;
  }
}

@media(max-width:550px) {
  .gal-page {
    padding: 16px 12px 45px;
  }

  .gal-hero {
    min-height: 280px;
    border-radius: 20px;
    padding: 25px 20px;
  }

  .gal-hero-icon {
    right: 5px;
    bottom: 0;
    top: auto;
    font-size: 95px;
  }

  .gal-hero-text h1 {
    font-size: 31px;
  }

  .gal-hero-text p {
    font-size: 13px;
    max-width: 90%;
  }

  .gal-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .gal-tile {
    height: 180px;
    border-radius: 13px;
  }

  .gal-tile-overlay {
    left: 8px;
    right: 8px;
    bottom: 8px;
  }

  .gal-tile-name {
    font-size: 11px;
  }

  .gal-tile-like {
    padding: 6px 9px;
    font-size: 11px;
  }

  .gal-group-header h2 {
    font-size: 17px;
  }

  .gal-tabs {
    width: 100%;
  }

  .gal-tab {
    flex: 1;
    padding: 10px 8px;
  }

  .gal-lightbox-nav.prev {
    left: 8px;
  }

  .gal-lightbox-nav.next {
    right: 8px;
  }

  .gal-lightbox-nav {
    width: 38px;
    height: 38px;
    font-size: 25px;
  }
}
`;

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
      <button
        className="gal-lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
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
          >
            ‹
          </button>

          <button
            className="gal-lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
          >
            ›
          </button>
        </>
      )}

      <div
        className="gal-lightbox-content"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={item.images[imageIndex]} alt={item.eventName} />

        <div className="gal-lightbox-meta">
          <div className="gal-lightbox-info">
            <h3>{item.eventName}</h3>

            <span>
              {item.uploadedByName} ·{" "}
              {new Date(item.uploadedAt).toLocaleDateString()}
            </span>
          </div>

          <button
            className={`gal-lightbox-like ${liked ? "liked" : ""}`}
            onClick={() => onLike(item)}
          >
            {liked ? "♥" : "♡"} {item.likes || 0}
          </button>
        </div>
      </div>
    </div>
  );
}

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("recent");
  const [lightbox, setLightbox] = useState(null);

  const userId = getUserId();

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/Society_Gallery`)
      .then((res) => {
        setItems(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (item) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/gallery/${item._id}/like`,
        { userId }
      );

      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? res.data : i))
      );

      setLightbox((prev) =>
        prev && prev.item._id === item._id
          ? { ...prev, item: res.data }
          : prev
      );
    } catch (err) {
      console.log(err);
    }
  };

  const isLiked = (item) =>
    Array.isArray(item.likedBy) && item.likedBy.includes(userId);

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
      const name = item.eventName || "Community Moments";

      if (!groups[name]) {
        groups[name] = [];
        order.push(name);
      }

      groups[name].push(item);
    });

    return order.map((name) => ({
      eventName: name,
      items: groups[name],
    }));
  }, [items, tab]);

  const heroImages = useMemo(() => {
    return items.flatMap((i) => i.images || []).slice(0, 3);
  }, [items]);

  const openLightbox = (item, index) => {
    setLightbox({ item, index });
  };

  const navLightbox = (dir) => {
    setLightbox((prev) => {
      if (!prev) return prev;

      const total = prev.item.images.length;
      const next = (prev.index + dir + total) % total;

      return { ...prev, index: next };
    });
  };

  if (loading) {
    return (
      <div className="gal-loading">
        <style>{galleryCSS}</style>
        <h2>🌿 Loading Community Memories...</h2>
      </div>
    );
  }

  return (
    <div className="gal-page">
      <style>{galleryCSS}</style>

      <div className="gal-container">

        {/* HERO SECTION */}

        <section className="gal-hero">
          <div className="gal-hero-text">
            <span className="gal-label">
              🌿 MyCommunity Gallery
            </span>

            <h1>Our Community, Our Memories.</h1>

            <p>
              Every picture tells a story. Explore beautiful moments,
              celebrations, events and memories shared by your neighbours.
            </p>
          </div>

          <div className="gal-hero-icon">📸</div>
        </section>

        {/* SECTION HEADING */}

        <div className="gal-section-heading">
          <div>
            <h2>Community Memories 📷</h2>
            <p>Beautiful moments shared by our residents.</p>
          </div>
        </div>

        {/* TABS */}

        <div className="gal-tabs">
          <button
            className={`gal-tab ${tab === "recent" ? "active" : ""}`}
            onClick={() => setTab("recent")}
          >
            🕒 Recent
          </button>

          <button
            className={`gal-tab ${tab === "liked" ? "active" : ""}`}
            onClick={() => setTab("liked")}
          >
            ❤️ Most Liked
          </button>
        </div>

        {/* EMPTY STATE */}

        {grouped.length === 0 && (
          <div className="gal-empty">
            <div className="gal-empty-icon">🌿</div>
            <h3>No Memories Yet!</h3>
            <p>
              Community memories will appear here when residents
              share their photos.
            </p>
          </div>
        )}

        {/* GALLERY */}

        {grouped.map((group) => (
          <div className="gal-group" key={group.eventName}>

            <div className="gal-group-header">
              <h2>🌳 {group.eventName}</h2>

              <span>
                {group.items.length} Photos
              </span>
            </div>

            <div className="gal-grid">
              {group.items.map((item) => (
                <div
                  className="gal-tile"
                  key={item._id}
                  onClick={() => openLightbox(item, 0)}
                >
                  <img
                    src={item.images?.[0]}
                    alt={item.eventName}
                  />

                  {item.images?.length > 1 && (
                    <span className="gal-tile-count">
                      +{item.images.length - 1} photos
                    </span>
                  )}

                  <div className="gal-tile-overlay">
                    <span className="gal-tile-name">
                      👤 {item.uploadedByName}
                    </span>

                    <button
                      className={`gal-tile-like ${
                        isLiked(item) ? "liked" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(item);
                      }}
                    >
                      {isLiked(item) ? "♥" : "♡"} {item.likes || 0}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* LIGHTBOX */}

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
    </div>
  );
}

export default Gallery;
